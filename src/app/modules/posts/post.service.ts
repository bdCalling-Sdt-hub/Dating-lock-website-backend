/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import Post from './post.model';
import ApiError from '../../../errors/ApiError';
import { IPost } from './post.interface';
import QueryBuilder from '../../../builder/QueryBuilder';
import { IReqUser } from '../user/user.interface';

//! Add a post
const createPost = async (req: Request) => {
  const { files } = req;
  const data = req.body;
  //@ts-ignore
  if (!data && !files?.image) {
    throw new Error('Data or image missing in the request body!');
  }
  //@ts-ignore
  let image = undefined;
  //@ts-ignore
  if (files && files.image) {
    //@ts-ignore
    image = files?.image[0].path;
  }

  const result = await Post.create({
    image,
    ...data,
  });
  return result;
};
//! Get my posts
const getMyPosts = async (user: IReqUser, query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post.find({ user: user?.userId }), query)
    .search(['title'])
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
//! Single Post
const singlePost = async (id: string) => {
  const result = await Post.findById(id);
  if (!result) {
    throw new ApiError(404, 'Post not found');
  }
  return result;
};
//! Delete Post
const deletePost = async (id: string) => {
  const result = await Post.findById(id);
  if (!result) {
    throw new ApiError(404, 'Post not found');
  }
  return await Post.findByIdAndDelete(id);
};
//! Update post
const updatePost = async (id: string, req: Request) => {
  const { files } = req;
  const data = req?.body;
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const { ...PostData } = data;

  let image = undefined;
  //@ts-ignore
  if (files && files.image) {
    //@ts-ignore
    image = files?.image[0].path;
  }
  const updatedPostData: Partial<IPost> = { ...PostData };
  const result = await Post.findOneAndUpdate(
    { _id: id },
    {
      //@ts-ignore
      image,
      ...updatedPostData,
    },
    {
      new: true,
    },
  );
  return result;
};
export const PostService = {
  createPost,
  getMyPosts,
  singlePost,
  deletePost,
  updatePost,
};
