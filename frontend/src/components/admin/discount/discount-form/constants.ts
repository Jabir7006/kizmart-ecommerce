import type { DiscountFormInput } from "@/schemas/discountSchema";

export const EMPTY_DEFAULTS: DiscountFormInput = {
  name: "",
  discountType: "percentage",
  value: 0,
  targetType: "all",
  targetProducts: [],
  targetCategories: [],
  startDate: "",
  endDate: "",
  isActive: true,
};

export const EMPTY_SELECTION: string[] = [];

export const discountTypeOptions = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed amount", value: "fixed" },
] as const;

export const targetTypeOptions = [
  { label: "All products", value: "all" },
  { label: "Specific products", value: "product" },
  { label: "Specific categories", value: "category" },
] as const;
