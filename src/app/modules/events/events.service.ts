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
//!
const joinEvents = async (req: Request) => {
  const { eventId } = req.body;

  const { userId } = req.user as IReqUser;

  const eventPost = await Event.findById(eventId);

  if (!eventPost) {
    throw new ApiError(404, 'Event not found');
  }

  // Check if the user has already joined the post
  const alreadyLiked = eventPost.participants.some(
    //@ts-ignore
    participant => participant.user.toString() === userId,
  );

  if (alreadyLiked) {
    throw new ApiError(400, 'You have already joined this event');
  }

  //@ts-ignore
  eventPost.participants.push({ user: userId });
  await eventPost.save();

  return eventPost;
};
//!
const removeFromEvent = async (req: Request) => {
  const { eventId, userId } = req.params;

  const eventPost = await Event.findById(eventId);

  if (!eventPost) {
    throw new ApiError(404, 'Event post not found');
  }

  // Find the index of the like in the likes
  const likeIndex = eventPost.participants.findIndex(
    //@ts-ignore
    user => user.user.toString() === userId,
  );

  if (likeIndex === -1) {
    throw new ApiError(404, 'Like not found');
  }

  // Remove the like from the array
  eventPost.participants.splice(likeIndex, 1);
  await eventPost.save();
  return eventPost;
};

export const EventService = {
  addEvent,
  getEvents,
  getSingleEvent,
  deleteEvent,
  updateEvent,
  joinEvents,
  removeFromEvent,
};
