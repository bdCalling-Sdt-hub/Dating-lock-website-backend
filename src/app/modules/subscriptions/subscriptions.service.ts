/* eslint-disable @typescript-eslint/ban-ts-comment */
import ApiError from '../../../errors/ApiError';
import { ISubscriptions, ISubscriptionsItem } from './subscriptions.interface';
import { Subscriptions } from './subscriptions.model';

const addSubscription = async (payload: ISubscriptions) => {
  const result = await Subscriptions.create(payload);
  return result;
};
const addSubscriptionByTitle = async (payload: ISubscriptionsItem) => {
  const subscription = await Subscriptions.findOne({
    _id: payload.subscriptions_id,
  });
  if (!subscription) {
    throw new ApiError(404, 'Subscriptions Not Found');
  }

  //@ts-ignore
  subscription.items.push({ title: payload.title });
  await subscription.save();
  return subscription;
};
const getSubscriptions = async () => {
  //   console.log(id);
  const result = await Subscriptions.find({});
  return result;
};
const updateSubscriptionsTitle = async (id: string, payload: any) => {
  try {
    const subs = await Subscriptions.findOne({ 'subscriptions_id._id': id });

    if (!subs) {
      throw new ApiError(404, 'Item not found');
    }

    await Subscriptions.updateOne(
      { 'subscriptions_id._id': id },
      { $set: { 'subscriptions_id.$.title': payload.title } },
    );
  } catch (error) {
    console.error(error);
    //@ts-ignore
    throw new Error(error?.message);
  }
};

const deleteSubscriptionsTitle = async (id: string) => {
  try {
    const subs = await Subscriptions.findOne({ 'subscriptions_id._id': id });

    if (!subs) {
      throw new ApiError(404, 'Item not found');
    }

    await Subscriptions.updateOne(
      { _id: subs._id },
      { $pull: { items: { _id: id } } },
    );
  } catch (error) {
    console.error(error);
  }
};
const deleteSubscriptions = async (id: string) => {
  const check = await Subscriptions.findById(id);
  if (!check) {
    throw new ApiError(404, 'Subscriptions not found');
  }
  return await Subscriptions.findByIdAndDelete(id);
};

export const SubscriptionsService = {
  addSubscription,
  addSubscriptionByTitle,
  deleteSubscriptionsTitle,
  getSubscriptions,
  deleteSubscriptions,
  updateSubscriptionsTitle,
};
