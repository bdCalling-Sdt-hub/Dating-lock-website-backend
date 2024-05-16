import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ILike = {
  user: Types.ObjectId | IUser;
};
export type IComment = {
  user: Types.ObjectId | IUser;
  content: string;
};
