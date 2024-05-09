/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import { IReqUser } from '../user/user.interface';
import { Event } from './events.model';
import ApiError from '../../../errors/ApiError';
import Admin from '../admin/admin.model';
import QueryBuilder from '../../../builder/QueryBuilder';
import { IEvent } from './events.interface';

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
  const EventQuery = new QueryBuilder(Event.find({}), query)
    .search(['title', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await EventQuery.modelQuery;
  const meta = await EventQuery.countTotal();

  return {
    meta,
    data: result,
  };
};
//!
const getSingleEvent = async (id: string) => {
  const isExists = await Event.findById(id);
  if (!isExists) {
    throw new ApiError(404, 'Event not found');
  }
  return isExists;
};
//!
const deleteEvent = async (id: string) => {
  const isExists = await Event.findById(id);
  if (!isExists) {
    throw new ApiError(404, 'Event not found');
  }
  return await Event.findByIdAndDelete(id);
};
//!
const updateEvent = async (id: string, req: Request) => {
  const { files } = req;
  const data = req?.body?.data;
  const result = await Event.findById(id);
  if (!result) {
    throw new ApiError(404, 'Event not found');
  }
  //@ts-ignore
  if (files?.image?.length && !data) {
    const result = await Event.findOneAndUpdate(
      { _id: id },
      //@ts-ignore
      { image: files.image[0].path },
      {
        new: true,
        runValidators: true,
      },
    );

    return result;
  }
  //@ts-ignore
  else if (data && !files?.image?.length) {
    {
      const parsedData = JSON.parse(data);

      const { ...EventData } = parsedData;

      const updatedEventData: Partial<IEvent> = { ...EventData };

      const result = await Event.findOneAndUpdate(
        { _id: id },
        updatedEventData,
        {
          new: true,
        },
      );
      return result;
    }
  }
  //@ts-ignore
  else if (data && files?.image?.length) {
    const parsedData = JSON.parse(data);

    const { ...EventData } = parsedData;

    const updatedEventData: Partial<IEvent> = { ...EventData };
    const result = await Event.findOneAndUpdate(
      { _id: id },
      {
        //@ts-ignore
        image: files.image[0].path,
        ...updatedEventData,
      },
      {
        new: true,
      },
    );
    return result;
  }
};

export const EventService = {
  addEvent,
  getEvents,
  getSingleEvent,
  deleteEvent,
  updateEvent,
};
