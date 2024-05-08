import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import { BlogService } from './blog.service';
import { IReqUser } from '../user/user.interface';
import sendResponse from '../../../shared/sendResponse';

const addBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.addBlog(req.user as IReqUser, req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog added successful',
    data: result,
  });
});

export const BlogController = {
  addBlog,
};
