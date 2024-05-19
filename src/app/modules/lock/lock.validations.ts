import { z } from 'zod';

const post = z.object({
  body: z.object({
    toUser: z.string({ required_error: 'toUser field is required' }),
  }),
});

export const LockValidation = {
  post,
};
