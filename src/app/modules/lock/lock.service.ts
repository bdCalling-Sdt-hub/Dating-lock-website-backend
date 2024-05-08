import ApiError from '../../../errors/ApiError';
import { IReqUser } from '../user/user.interface';
import { ILockRequest } from './lock.interface';
import { Lock } from './lock.model';

const requestLock = async (user: any, payload: ILockRequest) => {
  const data = {
    fromUser: user?.userId,
    toUser: payload?.toUser,
  };
  const isExistLock = await Lock.findOne({
    $and: [{ fromUser: data.fromUser }, { toUser: data.toUser }],
  }).populate({
    path: 'toUser',
    select: 'name',
  });

  if (isExistLock) {
    throw new ApiError(400, 'They are already friends');
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
const myLockList = async (user: IReqUser) => {
  const result = await Lock.find({
    $or: [
      { toUser: user.userId, status: 'accepted' },
      { fromUser: user.userId, status: 'accepted' },
    ],
  }).populate({
    path: 'fromUser',
    select: 'name',
  });
  return result;
};
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
