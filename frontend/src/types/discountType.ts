export type DiscountType = "percentage" | "fixed";
export type DiscountTargetType = "product" | "category" | "all";
export type DiscountStatus = "active" | "inactive" | "upcoming" | "expired";

export interface DiscountTargetProduct {
  _id: string;
  title: string;
  slug: string;
  price: number;
}

export interface DiscountTargetCategory {
  _id: string;
  title: string;
  slug: string;
}

export interface Discount {
  _id: string;
  name: string;
  discountType: DiscountType;
  value: number;
  targetType: DiscountTargetType;
  targetProducts: DiscountTargetProduct[];
  targetCategories: DiscountTargetCategory[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: DiscountStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscountFilters {
  search?: string;
  status?: DiscountStatus;
  discountType?: DiscountType;
  targetType?: DiscountTargetType;
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface PaginatedDiscounts {
  metadata: PaginationMeta;
  data: Discount[];
}
