import { Types } from 'mongoose';

export type ISubscriptions = {
  title: string;
  items: [];
  price: number;
  status: boolean;
};
export type ISubscriptionsItem = {
  subscriptions_id: Types.ObjectId | ISubscriptions;
  title: string;
  status: boolean;
};
