import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api/category/categoryApi";

export const useCategory = () => {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.data.data;
    },
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
  };
};