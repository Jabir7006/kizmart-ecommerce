import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  streetAddress: z.string().min(5, 'Street address is too short'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  isDefault: z.boolean(),
});

