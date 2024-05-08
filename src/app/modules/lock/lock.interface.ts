import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ILockRequest = {
  fromUser: Types.ObjectId | IUser;
  toUser: Types.ObjectId | IUser;
  status: 'pending' | 'accepted' | 'rejected';
  isBlock: boolean;
  response: 'pending' | 'accepted' | 'rejected';
};
