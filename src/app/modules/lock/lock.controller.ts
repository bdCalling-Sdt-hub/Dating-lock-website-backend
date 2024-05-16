import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import { LockService } from './lock.service';
import sendResponse from '../../../shared/sendResponse';
import { IReqUser } from '../user/user.interface';
import paginationFields from '../../../constants/pagination';
import pick from '../../../shared/pick';

const requestLock = catchAsync(async (req: Request, res: Response) => {
  const result = await LockService.requestLock(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Lock Request Successful',
    data: result,
  });
});
const acceptLock = catchAsync(async (req: Request, res: Response) => {
  const result = await LockService.acceptLock(req.user as IReqUser, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Lock Accept Successful',
    data: result,
  });
});
const rejectLock = catchAsync(async (req: Request, res: Response) => {
  const result = await LockService.rejectLock(req.user as IReqUser, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Lock Rejected Successful',
    data: result,
  });
});

//*
const myLockList = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'status']);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await LockService.myLockList(
    req.user as IReqUser,
    filters,
    paginationOptions,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Lock Request Successful',
    data: result.data,
    meta: result.meta,
  });
});
const myPendingLock = catchAsync(async (req: Request, res: Response) => {
  const result = await LockService.myPendingLock(req.user as IReqUser);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pending Lock Retrieved Successful',
    data: result,
  });
});
const myRequestedLock = catchAsync(async (req: Request, res: Response) => {
  const result = await LockService.myRequestedLock(req.user as IReqUser);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Requested Lock Retrieved Successful',
    data: result,
  });
});
const deleteLock = catchAsync(async (req: Request, res: Response) => {
  const result = await LockService.deleteLock(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Lock deleted Successful',
    data: result,
  });
});

export const LockController = {
  requestLock,
  acceptLock,
  rejectLock,
  myLockList,
  myPendingLock,
  myRequestedLock,
  deleteLock,
};
