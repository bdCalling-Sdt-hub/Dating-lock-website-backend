import { Request } from 'express';
import { IReqUser } from '../user/user.interface';

const addBlog = async (user: IReqUser, req: Request) => {
  console.log(req);
};

export const BlogService = {
  addBlog,
};
