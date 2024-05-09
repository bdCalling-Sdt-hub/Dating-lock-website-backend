import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { SubscriptionsService } from './subscriptions.service';

const adSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionsService.addSubscription(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'adSubscriptions successfully',
    data: result,
  });
});
const adSubscriptionsItem = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionsService.addSubscriptionByTitle(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscriptions item add successfully',
    data: result,
  });
});
const getSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionsService.getSubscriptions();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscriptions Retrieved successfully',
    data: result,
  });
});
const deleteSubscriptionsTitle = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionsService.deleteSubscriptionsTitle(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Subscriptions item delete successfully',
      data: result,
    });
  },
);
const updateSubscriptionsTitle = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionsService.updateSubscriptionsTitle(
      req.params.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Subscriptions Update successfully',
      data: result,
    });
  },
);
const deleteSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionsService.deleteSubscriptions(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscriptions delete successfully',
    data: result,
  });
});

export const SubscriptionsController = {
  adSubscriptions,
  adSubscriptionsItem,
  getSubscriptions,
  deleteSubscriptionsTitle,
  deleteSubscriptions,
  updateSubscriptionsTitle,
};
