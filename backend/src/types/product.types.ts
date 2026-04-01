
type ImageInput = {
  publicId: string;
  secureUrl: string;
  altText: string;
};
export type ProductInput = {
  title: string;
  shortDescription: string;
  longDescription: string;
  thumbnail: ImageInput;
  gallery: ImageInput[];
  price: number;
  quantity: number;
  category: string;
  brand: string;
  status: string;
  isFeatured: boolean;
};

export interface ProductQueryOptions {
  search?: string | undefined;
  categorySlug?: string | undefined;
  brandSlug?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
  page?: number | undefined;
  limit?: number | undefined;
  status?: string | undefined;
  isFeatured?: boolean | string | undefined;
}

export interface PaginatedResult<T> {
  metadata: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
  data: T[];
}
