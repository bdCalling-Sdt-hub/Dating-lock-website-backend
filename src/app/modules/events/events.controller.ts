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

export const EventController = {
  addEvent,
  getEvents,
};
