import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { EventService } from './events.service';
import { IReqUser } from '../user/user.interface';

const addEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.addEvent(req.user as IReqUser, req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Event added',
    data: result,
  });
});
const getEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getEvents(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Event retrieved successful',
    data: result,
  });
});
const getSingleEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getSingleEvent(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Event retrieved successful',
    data: result,
  });
});
const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.updateEvent(req.params.id, req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Event update successful',
    data: result,
  });
});
const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.deleteEvent(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Event delete successful',
    data: result,
  });
});
const joinEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.joinEvents(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Joined successful',
    data: result,
  });
});
const removeFromEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.removeFromEvent(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Joined successful',
    data: result,
  });
});

export const EventController = {
  addEvent,
  getEvents,
  getSingleEvent,
  deleteEvent,
  updateEvent,
  joinEvents,
  removeFromEvent,
};
