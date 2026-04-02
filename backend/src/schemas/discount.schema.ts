import { z } from 'zod';

const discountCoreSchema = z.object({
  name: z.string({ error: 'Discount name is required' }).min(1),
  discountType: z.enum(['percentage', 'fixed'], {
    error: 'Discount type must be "percentage" or "fixed"',
  }),
  value: z
    .number({ error: 'Discount value is required' })
    .positive({ message: 'Value must be greater than 0' }),
  targetType: z.enum(['product', 'category', 'all'], {
    error: 'Target type must be "product", "category", or "all"',
  }),
  targetProducts: z.array(z.string()).default([]),
  targetCategories: z.array(z.string()).default([]),
  startDate: z.string({ error: 'Start date is required' }),
  endDate: z.string({ error: 'End date is required' }),
  isActive: z.boolean().default(true),
});

export const createDiscountSchema = z.object({
  body: discountCoreSchema.refine(
    (data) => {
      if (data.discountType === 'percentage' && data.value > 100) {
        return false;
      }
      return true;
    },
    { message: 'Percentage discount cannot exceed 100%' },
  ),
});

export const updateDiscountSchema = z.object({
  params: z.object({
    id: z.string({ error: 'Discount ID is required' }),
  }),
  body: discountCoreSchema.partial(),
});
