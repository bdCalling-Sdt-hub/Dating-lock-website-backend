import { Schema, model } from 'mongoose';
import { IBlog } from './blog.interface';
import {
  commentSchema,
  likeSchema,
} from '../blog-like-comment/blog_like.model';

const blogSchema = new Schema<IBlog>(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
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
    likes: [likeSchema],
    comments: [commentSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const Blog = model<IBlog>('Blog', blogSchema);

export default Blog;
