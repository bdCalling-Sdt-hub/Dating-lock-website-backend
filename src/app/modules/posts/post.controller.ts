import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import { PostService } from './post.service';
import sendResponse from '../../../shared/sendResponse';

const createPost = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.createPost(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post created successfully',
    data: result,
  });
});
const getMyPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.getMyPosts(req.user, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});
const singlePost = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.singlePost(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post retrieved successfully',
    data: result,
  });
});
const deletePost = catchAsync(async (req: Request, res: Response) => {
  await PostService.deletePost(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post delete successfully',
  });
});
const updatePost = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.updatePost(req.params.id, req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post edit successfully',
    data: result,
  });
});

export const PostController = {
  createPost,
  getMyPosts,
  singlePost,
  deletePost,
  updatePost,
};
