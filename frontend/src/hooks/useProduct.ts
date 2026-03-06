import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/api/product/productApi";
import { useProductStore } from "@/store/useProductStore";
import type { PaginatedProducts } from "@/types/productType";

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
