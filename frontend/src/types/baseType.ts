import type { Image } from "./productType";

export interface EntityTimestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseEntity extends EntityTimestamps {
  _id: string;
}

export interface BaseResourceInput {
  title: string;
  slug: string;
  thumbnail?: Image;
}

export interface BaseResource extends BaseEntity, BaseResourceInput {}

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  metadata: PaginationMeta;
  data: T[];
}
