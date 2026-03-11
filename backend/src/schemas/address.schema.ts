import { z } from 'zod';

const addressCoreSchema = z.object({
  fullName: z.string({ error: 'Full name is required' }).min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string({ error: 'Phone number is required' }).min(10, 'Invalid phone number'),
  streetAddress: z.string({ error: 'Street address is required' }).min(5, 'Street address is too short'),
  city: z.string({ error: 'City is required' }),
  state: z.string({ error: 'State is required' }),
  postalCode: z.string({ error: 'Postal code is required' }),
  isDefault: z.boolean().optional(),
});

export const createAddressSchema = z.object({
  body: addressCoreSchema,
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: z.string({ error: 'Address ID is required' }),
  }),
  body: addressCoreSchema.partial(),
});
