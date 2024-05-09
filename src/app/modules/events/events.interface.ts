import { Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';

export type IEvent = {
  title: string;
  description: string;
  image: string;
  hosted_by: Types.ObjectId | IAdmin;
  participants: [];
  time_slots: [];
};
