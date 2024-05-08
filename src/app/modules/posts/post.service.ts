/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import Post from './post.model';
import ApiError from '../../../errors/ApiError';
import { IPost } from './post.interface';

const createPost = async (req: Request) => {
  const { files } = req;
  const data = req.body.data;
  //@ts-ignore
  if (!data || !files?.image) {
    throw new Error('Data or image missing in the request body!');
  }
  //@ts-ignore
  const image = files?.image[0].path;
  const postData = JSON.parse(data);
  const result = await Post.create({
    image,
    ...postData,
  });
  return result;
};
const getMyPosts = async (payload: any) => {
  const result = await Post.find({ user: payload?.userId });
  return result;
};
const singlePost = async (id: string) => {
  const result = await Post.findById(id);
  if (!result) {
    throw new ApiError(404, 'Post not found');
  }
  return result;
};
const deletePost = async (id: string) => {
  const result = await Post.findById(id);
  if (!result) {
    throw new ApiError(404, 'Post not found');
  }
  return await Post.findByIdAndDelete(id);
};

const updatePost = async (id: string, req: Request) => {
  const { files } = req;
  const data = req?.body?.data;
  const result = await Post.findById(id);
  if (!result) {
    throw new ApiError(404, 'Post not found');
  }
  //@ts-ignore
  if (files?.image?.length && !data) {
    const result = await Post.findOneAndUpdate(
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

      const { ...PostData } = parsedData;

      const updatedPostData: Partial<IPost> = { ...PostData };

      const result = await Post.findOneAndUpdate({ _id: id }, updatedPostData, {
        new: true,
      });
      return result;
    }
  }
  //@ts-ignore
  else if (data && files?.image?.length) {
    const parsedData = JSON.parse(data);

    const { ...PostData } = parsedData;

    const updatedPostData: Partial<IPost> = { ...PostData };
    const result = await Post.findOneAndUpdate(
      { _id: id },
      {
        //@ts-ignore
        image: files.image[0].path,
        ...updatedPostData,
      },
      {
        new: true,
      },
    );
    return result;
  }
};
export const PostService = {
  createPost,
  getMyPosts,
  singlePost,
  deletePost,
  updatePost,
};
