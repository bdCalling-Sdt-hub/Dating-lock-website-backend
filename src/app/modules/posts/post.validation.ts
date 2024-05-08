import { z } from 'zod';

const post = z.object({
  body: z.object({
    user: z
      .string({
        required_error: 'User ID is required',
      })
      .nonempty(),
    title: z
      .string({
        required_error: 'Title is required',
      })
      .min(1)
      .max(100),
    description: z
      .string({
        required_error: 'description is required',
      })
      .min(1)
      .max(1000),
  }),

  files: z.object({
    image: z.string({
      required_error: 'Image is required',
    }),
    // .url(),
  }),
});

export const PostValidation = {
  post,
};
