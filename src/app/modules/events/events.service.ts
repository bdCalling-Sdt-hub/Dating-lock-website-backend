/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import { IReqUser } from '../user/user.interface';
import { Event } from './events.model';
import ApiError from '../../../errors/ApiError';
import Admin from '../admin/admin.model';
import QueryBuilder from '../../../builder/QueryBuilder';

//!
const addEvent = async (user: IReqUser, req: Request) => {
  const eventData = JSON.parse(req.body.data);
  //@ts-ignore
  if (!req.files?.image?.length) {
    throw new ApiError(404, 'Image is required');
  }
  //@ts-ignore
  const image = req.files?.image[0]?.path;

  const hostedByUser = await Admin.findById(user.userId);
  if (!hostedByUser) {
    throw new ApiError(404, 'Hosted by user not found');
  }

  const data = {
    hosted_by: hostedByUser,
    image,
    ...eventData,
  };

  const result = (await Event.create(data)).populate('hosted_by');
  return result;
};
//!
const getEvents = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Event.find({}), query)
    .search(['title', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

export const EventService = { addEvent, getEvents };
