import { Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';

export type IEvent = {
  title: string;
  description: string;
  image: string;
  hosted_by: Types.ObjectId | IAdmin;
  start_date: Date;
  end_date: Date;
  event_type: 'onsite' | 'online';
  location: string;
  category: string;
  participants: [];
  time_slots: [];
};
