import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/paginations';
import { IReqUser } from '../user/user.interface';
import User from '../user/user.model';
import { ILockRequest } from './lock.interface';
import { Lock } from './lock.model';
import { getRequestLimit } from '../../../utils/Subscription';

//! add lock request
const requestLock = async (user: any, payload: ILockRequest) => {
  const data = {
    fromUser: user?.userId,
    toUser: payload?.toUser,
  };
  // Fetch the sender user from the database
  const sender = await User.findById(user?.userId);
  if (!sender) {
    throw new ApiError(404, 'Sender user not found');
  }

  const isExistLock = await Lock.findOne({
    $and: [{ fromUser: data.fromUser }, { toUser: data.toUser }],
  }).populate({
    path: 'toUser',
    select: 'name',
  });

  if (isExistLock) {
    throw new ApiError(400, 'Already requested');
    // throw new ApiError(400, 'They are already friends');
  }
  const myTotalLock = await Lock.find({
    $and: [{ fromUser: user.userId }],
  });

  if (myTotalLock?.length >= getRequestLimit(sender.plan_type)) {
    throw new ApiError(400, 'Request limit reached. Please upgrade your plan');
  }
  if (!isExistLock) {
    const createdLock = await Lock.create(data);
    const populatedLock = await Lock.populate(createdLock, {
      path: 'toUser',
      select: 'name',
    });

    return populatedLock;
  }
};
//! my pending request
const myPendingLock = async (user: IReqUser) => {
  const result = await Lock.find({
    $and: [{ status: 'pending' }, { toUser: user.userId }],
  }).populate([
    {
      path: 'fromUser',
      select: 'name',
    },
    {
      path: 'toUser',
      select: 'name',
    },
  ]);
  return result;
};
//! that is sent request to user
const myRequestedLock = async (user: IReqUser) => {
  const result = await Lock.find({
    $and: [{ status: 'pending' }, { fromUser: user.userId }],
  }).populate([
    {
      path: 'fromUser',
      select: 'name',
    },
    {
      path: 'toUser',
      select: 'name',
    },
  ]);
  return result;
};
//! lock accept controller
const acceptLock = async (user: IReqUser, payload: ILockRequest) => {
  const { fromUser, response } = payload;

  const friendRequest = await Lock.findOne({
    $and: [{ status: 'pending' }, { fromUser }, { toUser: user.userId }],
  }).populate([
    {
      path: 'fromUser',
      select: 'name',
    },
    {
      path: 'toUser',
      select: 'name',
    },
  ]);

  if (!friendRequest) {
    throw new ApiError(404, 'Lock request not found');
  }

  if (friendRequest.status !== 'pending') {
    throw new ApiError(400, 'Lock request already responded');
  }

  friendRequest.status = response;
  await friendRequest.save();
  return friendRequest;
};
//! lock reject controller
const rejectLock = async (user: IReqUser, payload: ILockRequest) => {
  const { fromUser, response } = payload;

  const friendRequest = await Lock.findOne({
    $and: [{ status: 'pending' }, { fromUser }, { toUser: user.userId }],
  }).populate([
    {
      path: 'fromUser',
      select: 'name',
    },
    {
      path: 'toUser',
      select: 'name',
    },
  ]);

  if (!friendRequest) {
    throw new ApiError(404, 'Lock request not found');
  }

  if (friendRequest.status !== 'pending') {
    throw new ApiError(400, 'Lock request already responded');
  }

  friendRequest.status = response;
  await friendRequest.save();
};
//! my friend list
const myLockList = async (
  user: IReqUser,
  filters: any,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  const andConditions: any[] = [];
  if (searchTerm) {
    const fuzzySearchRegex = new RegExp([...searchTerm].join('.*'), 'i');

    andConditions.push({
      $or: [
        ...['name'].map(field => ({
          [field]: {
            $regex: fuzzySearchRegex,
          },
        })),
        {
          fromUser: {
            $in: await User.find({
              $or: [{ name: { $regex: fuzzySearchRegex } }],
            }).distinct('_id'),
          },
        },
      ],
    });
  }
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  andConditions.push({
    $or: [
      { toUser: user.userId, status: 'accepted' },
      { fromUser: user.userId, status: 'accepted' },
    ],
  });
  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Lock.find(whereConditions)
    .populate([
      {
        path: 'fromUser',
        select: 'name',
      },
      {
        path: 'toUser',
        select: 'name',
      },
    ])
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Lock.countDocuments(whereConditions);
  // calculate the page
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};
//! delete lock from my friend list
const deleteLock = async (id: string) => {
  const isExists = await Lock.findById(id);
  if (!isExists) {
    throw new ApiError(404, 'Lock not found');
  }
  return await Lock.findByIdAndDelete(id);
};

export const LockService = {
  requestLock,
  acceptLock,
  rejectLock,
  myLockList,
  myPendingLock,
  myRequestedLock,
  deleteLock,
};
