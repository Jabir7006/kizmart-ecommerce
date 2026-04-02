import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/api/category/categoryApi";
import { uploadSingleImage } from "@/services/api/upload/uploadApi";
import { handleMutationError } from "@/utils/errorUtils";
import { toast } from "sonner";

export const useCategory = () => {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.data.data;
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      let thumbnailData = data.thumbnail;
      if (data.thumbnail instanceof File) {
        const res = await uploadSingleImage(data.thumbnail, "thumbnails");
        thumbnailData = res.data.data;
      }

      const payload = {
        title: data.title,
        ...(thumbnailData && { thumbnail: thumbnailData }),
      };

      const response = await createCategory(payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to create category"),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      let thumbnailData = data.thumbnail;
      if (data.thumbnail instanceof File) {
        const res = await uploadSingleImage(data.thumbnail, "thumbnails");
        thumbnailData = res.data.data;
      }

      const payload: Record<string, any> = {
        title: data.title,
        thumbnail: thumbnailData ?? null,
      };

      const response = await updateCategory(id, payload);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      toast.success("Category updated successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to update category"),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteCategory(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to delete category"),
  });

  return {
    categories: categoriesQuery.data || [],
    categoriesQuery,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
};

export const useSingleCategory = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const response = await getCategory(id);
      return response.data.data;
    },
    enabled: !!id && enabled,
    retry: 1,
  });
};
