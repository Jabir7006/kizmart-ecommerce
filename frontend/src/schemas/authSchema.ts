import { z } from 'zod';

const authCoreSchema = z.object({
  email: z.email({ error: 'Invalid email' }),
  password: z
    .string({ error: 'Password is required' })
    .min(6, { error: 'Password must be at least 6 characters long' }),
});

export const signupSchema = authCoreSchema.extend({
  fullName: z
    .string({ error: 'Full name is required' })
    .min(3, { error: 'Full name must be at least 3 characters long' }),
});

export const signinSchema = authCoreSchema;