import { Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';

export type IBlog = {
  title: string;
  description: string;
  image: string;
  created_by: Types.ObjectId | IAdmin;
  likes: [];
  comments: [];
};
