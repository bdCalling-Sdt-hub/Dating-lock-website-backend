import { Schema, model } from 'mongoose';
import { IPost } from './post.interface';

const postSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const Post = model<IPost>('Post', postSchema);

export default Post;
