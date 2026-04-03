import type { PaginatedResult } from './product.types.js';

export type DiscountListStatus = 'active' | 'inactive' | 'upcoming' | 'expired';

export interface DiscountQueryOptions {
  search?: string | undefined;
  discountType?: 'percentage' | 'fixed' | undefined;
  targetType?: 'product' | 'category' | 'all' | undefined;
  isActive?: boolean | undefined;
  status?: DiscountListStatus | undefined;
  sortBy?: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'name' | 'value' | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export type PaginatedDiscountResult<T> = PaginatedResult<T>;
