import { Schema, model } from 'mongoose';
import { IEvent } from './events.interface';

const participantSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const eventSchema = new Schema<IEvent>(
  {
    hosted_by: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    participants: [participantSchema],
    time_slots: [String],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Event = model<IEvent>('Event', eventSchema);
