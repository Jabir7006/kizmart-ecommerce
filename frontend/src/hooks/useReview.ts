import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getMyReview,
  updateReview,
} from "@/services/api/review/reviewApi";
import type {
  ReviewFilters,
  PaginatedReviews,
  CreateReviewInput,
  EditReviewInput,
  Review,
} from "@/types/reviewType";
import { handleMutationError } from "@/utils/errorUtils";

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (filters: ReviewFilters) => [...reviewKeys.lists(), filters] as const,
  product: (productId: string) => [...reviewKeys.all, "product", productId] as const,
  mine: (productId: string) => [...reviewKeys.product(productId), "mine"] as const,
  productInfinite: (
    productId: string,
    filters?: Omit<ReviewFilters, "productId" | "page" | "limit">,
  ) => [...reviewKeys.product(productId), "infinite", filters ?? {}] as const,
};

export const useMyProductReview = (productId: string, enabled = true) => {
  return useQuery<Review | null>({
    queryKey: reviewKeys.mine(productId),
    queryFn: async () => {
      const response = await getMyReview(productId);
      return response.data.data;
    },
    enabled: !!productId && enabled,
  });
};

export const useReviews = (filters: ReviewFilters) => {
  return useQuery<PaginatedReviews>({
    queryKey: reviewKeys.list(filters),
    queryFn: async () => {
      const response = await getAllReviews(filters);
      return response.data.data;
    },
    enabled: !!filters.productId,
    placeholderData: (previousData) => previousData,
  });
};

export const useInfiniteProductReviews = (
  productId: string,
  options?: Omit<ReviewFilters, "productId" | "page" | "limit">,
) => {
  const limit = 5;

  return useInfiniteQuery<PaginatedReviews>({
    queryKey: reviewKeys.productInfinite(productId, options),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await getAllReviews({
        productId,
        page: pageParam as number,
        limit,
        sortBy: options?.sortBy,
        star: options?.star,
      });

      return response.data.data;
    },
    enabled: !!productId,
    getNextPageParam: (lastPage) => {
      const { metadata } = lastPage;
      return metadata.page < metadata.totalPages
        ? metadata.page + 1
        : undefined;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useReview = () => {
  const queryClient = useQueryClient();

  const invalidateReviewQueries = () => {
    queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    queryClient.invalidateQueries({ queryKey: ["product"] });
  };

  const createReviewMutation = useMutation({
    mutationFn: async (data: CreateReviewInput) => {
      const response = await createReview(data);
      return response.data;
    },
    onSuccess: () => {
      invalidateReviewQueries();
      toast.success("Review created successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to create review"),
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: EditReviewInput;
    }) => {
      const response = await updateReview(id, data);
      return response.data;
    },
    onSuccess: () => {
      invalidateReviewQueries();
      toast.success("Review updated successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to update review"),
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteReview(id);
      return response.data;
    },
    onSuccess: () => {
      invalidateReviewQueries();
      toast.success("Review deleted successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to delete review"),
  });

  return {
    createReviewMutation,
    updateReviewMutation,
    deleteReviewMutation,
  };
};
