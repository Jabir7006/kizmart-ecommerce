import type {
  ReviewFormOutput,
  UpdateReviewFormOutput,
} from "@/schemas/reviewSchema";
import type { BaseEntity, PaginatedResponse } from "./baseType";

export interface ReviewUser {
  _id: string;
  fullName: string;
}

export interface Review extends BaseEntity {
  product: string;
  user: string | ReviewUser;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFilters {
  productId: string;
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest" | "highest-rating" | "lowest-rating";
  star?: number;
}

export type PaginatedReviews = PaginatedResponse<Review>;

export type CreateReviewInput = ReviewFormOutput;
export type EditReviewInput = UpdateReviewFormOutput;
