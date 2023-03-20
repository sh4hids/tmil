import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string(),
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(3)
    .max(100),
  body: z.string(),
});
