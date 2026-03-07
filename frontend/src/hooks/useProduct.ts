import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getProductBySlug } from "@/services/api/product/productApi";
import { useProductStore } from "@/store/useProductStore";
import type { Product, PaginatedProducts } from "@/types/productType";

const useProduct = () => {
  const filters = useProductStore((state) => state.filters);
  const setFilters = useProductStore((state) => state.setFilters);
  const resetFilters = useProductStore((state) => state.resetFilters);
  const setPage = useProductStore((state) => state.setPage);
  const setSelectedProduct = useProductStore(
    (state) => state.setSelectedProduct,
  );

  const productsQuery = useQuery<PaginatedProducts>({
    queryKey: ["products", filters],
    queryFn: async () => {
      const response = await getAllProducts(filters);
      return response.data.data;
    },
    placeholderData: (previousData) => previousData,
  });

  return {
    // Query
    productsQuery,
    products: productsQuery.data?.data ?? [],
    metadata: productsQuery.data?.metadata,

    // Actions
    filters,
    setFilters,
    resetFilters,
    setPage,
    setSelectedProduct,
  };
};

export default useProduct;

export const useSingleProduct = (slug: string) => {
  return useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await getProductBySlug(slug);
      return response.data.data; 
    },
    enabled: !!slug, 
    staleTime: 5 * 60 * 1000, 
  });
};
