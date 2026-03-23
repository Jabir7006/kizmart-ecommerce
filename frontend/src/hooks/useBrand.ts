import { useQuery } from "@tanstack/react-query";
import { getBrands } from "@/services/api/brand/brandApi";

export const useBrand = () => {
  const brandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await getBrands();
      return response.data.data;
    },
  });

  return {
    brands: brandsQuery.data || [],
    isLoading: brandsQuery.isLoading,
  };
};
