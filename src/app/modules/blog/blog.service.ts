/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import { IReqUser } from '../user/user.interface';
import Blog from './blog.model';
import ApiError from '../../../errors/ApiError';
import { IBlog } from './blog.interface';
import QueryBuilder from '../../../builder/QueryBuilder';

//!
const addBlog = async (user: IReqUser, req: Request) => {
  const blogData = JSON.parse(req.body.data);
  const { files } = req;
  //@ts-ignore
  const image = files.image[0].path;
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
  const data = req?.body?.data;
  const result = await Blog.findById(id);
  if (!result) {
    throw new ApiError(404, 'Blog not found');
  }
  //@ts-ignore
  if (files?.image?.length && !data) {
    const result = await Blog.findOneAndUpdate(
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

      const { ...BlogData } = parsedData;

      const updatedBlogData: Partial<IBlog> = { ...BlogData };

      const result = await Blog.findOneAndUpdate({ _id: id }, updatedBlogData, {
        new: true,
      });
      return result;
    }
  }
  //@ts-ignore
  else if (data && files?.image?.length) {
    const parsedData = JSON.parse(data);

    const { ...BlogData } = parsedData;

    const updatedBlogData: Partial<IBlog> = { ...BlogData };
    const result = await Blog.findOneAndUpdate(
      { _id: id },
      {
        //@ts-ignore
        image: files.image[0].path,
        ...updatedBlogData,
      },
      {
        new: true,
      },
    );
    return result;
  }
};
export const BlogService = {
  addBlog,
  getBlogs,
  getSingleBlog,
  deleteBlog,
  updateBlog,
};
