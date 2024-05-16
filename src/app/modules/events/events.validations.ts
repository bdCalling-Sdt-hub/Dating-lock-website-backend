import { z } from 'zod';

const post = z.object({
  body: z.object({
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
    start_date: z.string({
      required_error: 'start_date  is required',
    }),
    end_date: z.string({
      required_error: 'end_date  is required',
    }),
    event_type: z.string({
      required_error: 'event_type is required',
    }),

    location: z.string({
      required_error: 'location  is required',
    }),
    category: z.string({
      required_error: 'category is required',
    }),
  }),
  files: z.object({
    image: z
      .array(
        z.object({}).refine(() => true, {
          message: 'Image is required',
        }),
      )
      .nonempty({ message: 'Image array cannot be empty' }),
  }),
});

export const EventValidation = {
  post,
};
