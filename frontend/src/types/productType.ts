export interface Image {
  publicId: string;
  secureUrl: string;
  altText?: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  thumbnail: Image;
  gallery?: Image[];
  price: number;
  quantity: number;
  sold: number;
  category: string;
  brand: string;
  status: "draft" | "active" | "archived";
  ratings: number;
  numReviews: number;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  search?: string;
  categorySlug?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface PaginatedProducts {
  metadata: PaginationMeta;
  data: Product[];
}
