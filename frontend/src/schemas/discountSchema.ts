import { z } from "zod";

export const discountSchema = z
  .object({
    name: z.string().min(1, "Discount name is required"),
    discountType: z.enum(["percentage", "fixed"]),
    value: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, "Value must be greater than 0"),
    targetType: z.enum(["product", "category", "all"]),
    targetProducts: z.array(z.string()).default([]),
    targetCategories: z.array(z.string()).default([]),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .transform((val) => new Date(val)),
    endDate: z
      .string()
      .min(1, "End date is required")
      .transform((val) => new Date(val)),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.discountType === "percentage" && (data.value as number) > 100) {
        return false;
      }
      return true;
    },
    { message: "Percentage discount cannot exceed 100%", path: ["value"] },
  )
  .refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date",
    path: ["endDate"],
  });

export type DiscountFormInput = z.input<typeof discountSchema>;
export type DiscountFormOutput = z.output<typeof discountSchema>;
export type DiscountFormValues = DiscountFormOutput;
