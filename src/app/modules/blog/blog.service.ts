/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import { IReqUser } from '../user/user.interface';
import Blog from './blog.model';
import ApiError from '../../../errors/ApiError';
import { IBlog } from './blog.interface';
import QueryBuilder from '../../../builder/QueryBuilder';

//!
const addBlog = async (user: IReqUser, req: Request) => {
  const blogData = req.body;
  const { files } = req;
  //@ts-ignore
  let image = undefined;
  //@ts-ignore
  if (files && files.image) {
    //@ts-ignore
    image = files.image[0].path;
  }
  const data = {
    created_by: user?.userId,
    image,
    ...blogData,
  };
  return await Blog.create(data);
};
//!
const getBlogs = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Blog.find({}), query)
    .search(['title', 'description'])
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
//!
const getSingleBlog = async (id: string) => {
  const isExist = await Blog.findById(id);
  if (!isExist) {
    throw new ApiError(404, 'Blog not found');
  }
  return isExist;
};
//!
const deleteBlog = async (id: string) => {
  const isExist = await Blog.findById(id);
  if (!isExist) {
    throw new ApiError(404, 'Blog not found');
  }
  return await Blog.findByIdAndDelete(id);
};
//!
const updateBlog = async (id: string, req: Request) => {
  const { files } = req;
  let image = undefined;
  //@ts-ignore
  if (files && files.image) {
    //@ts-ignore
    image = files.image[0].path;
  }
  const data = req?.body;
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  const { ...BlogData } = data;

  const updatedBlogData: Partial<IBlog> = { ...BlogData };
  const result = await Blog.findOneAndUpdate(
    { _id: id },
    {
      //@ts-ignore
      image,
      ...updatedBlogData,
    },
    {
      new: true,
    },
  );
  return result;
};
export const BlogService = {
  addBlog,
  getBlogs,
  getSingleBlog,
  deleteBlog,
  updateBlog,
};
