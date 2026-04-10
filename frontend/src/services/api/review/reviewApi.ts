import type {
  ReviewFormOutput,
  UpdateReviewFormOutput,
} from "@/schemas/reviewSchema";
import type { ReviewFilters } from "@/types/reviewType";
import api from "../api";

export const getAllReviews = async (filters: ReviewFilters) => {
  const params: Record<string, string | number> = {
    productId: filters.productId,
  };

  if (filters.page !== undefined) params.page = filters.page;
  if (filters.limit !== undefined) params.limit = filters.limit;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.star !== undefined) params.star = filters.star;

  return api.get("/reviews", { params });
};

export const getMyReview = async (productId: string) =>
  api.get("/reviews/mine", {
    params: { productId },
  });

export const createReview = async (data: ReviewFormOutput) =>
  api.post("/reviews/create", data);

export const updateReview = async (id: string, data: UpdateReviewFormOutput) =>
  api.patch(`/reviews/${id}`, data);

export const deleteReview = async (id: string) => api.delete(`/reviews/${id}`);
