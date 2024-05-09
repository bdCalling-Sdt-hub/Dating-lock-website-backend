import { Schema, model } from 'mongoose';
import { ISubscriptions, ISubscriptionsItem } from './subscriptions.interface';

const subscriptionsSchema = new Schema<ISubscriptions>(
  {
    title: {
      type: String,
      required: true,
    },
    items: [
      {
        title: {
          type: String,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const subscriptionItemSchema = new Schema<ISubscriptionsItem>(
  {
    subscriptions_id: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);
export const Subscriptions = model<ISubscriptions>(
  'Subscription',
  subscriptionsSchema,
);
export const SubscriptionsItem = model<ISubscriptionsItem>(
  'SubscriptionsItem',
  subscriptionItemSchema,
);
