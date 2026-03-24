import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, deleteCategory } from "@/services/api/category/categoryApi";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useCategory = () => {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.data.data;
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteCategory(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message || "Failed to delete category"
        : "Something went wrong";
      toast.error(message);
    },
  });

  return {
    categories: categoriesQuery.data || [],
    categoriesQuery,
    deleteCategoryMutation,
  };
};