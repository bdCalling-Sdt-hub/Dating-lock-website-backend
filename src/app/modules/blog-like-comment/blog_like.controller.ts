import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { BlogLikeCommentService } from './blog_like.service';

const addLike = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogLikeCommentService.addLike(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Like added',
    data: result,
  });
});
const addComment = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogLikeCommentService.addComment(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'comment added',
    data: result,
  });
});
const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogLikeCommentService.deleteComment(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment Deleted',
    data: result,
  });
});
const removeLike = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogLikeCommentService.removeLike(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Like Removed',
    data: result,
  });
});

export const BlogLikeCommentController = {
  addLike,
  addComment,
  deleteComment,
  removeLike,
};
