import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/api/product/productApi";
import { useProductStore } from "@/store/useProductStore";
import type { Product, PaginatedProducts, Image } from "@/types/productType";
import type {
  ProductEditFormOutput,
  ProductInput,
} from "@/schemas/productSchema";
import { processProductImages } from "@/utils/productImageUtils";
import { toast } from "sonner";
import { isAxiosError } from "axios";

const useProduct = () => {
  const queryClient = useQueryClient();
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

  // ─── CREATE ─────────────────────────────────────────────────────────────────
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductEditFormOutput) => {
      const { thumbnailData, galleryData } = await processProductImages({
        thumbnail: data.thumbnail as File | Image,
        gallery: data.gallery as (File | Image)[],
      });

      const payload: ProductInput = {
        title: data.title,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        price: data.price,
        quantity: data.quantity,
        category: data.category,
        brand: data.brand || undefined,
        status: data.status,
        isFeatured: data.isFeatured,
        thumbnail: thumbnailData,
        gallery: galleryData.length > 0 ? galleryData : undefined,
      };

      const response = await createProduct(payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message || "Failed to create product"
        : "Something went wrong";
      toast.error(message);
    },
  });

  // ─── UPDATE ─────────────────────────────────────────────────────────────────
  const updateProductMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ProductEditFormOutput;
    }) => {
      const { thumbnailData, galleryData } = await processProductImages({
        thumbnail: data.thumbnail as File | Image,
        gallery: data.gallery as (File | Image)[],
      });

      const payload: Partial<ProductInput> = {
        title: data.title,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        price: data.price,
        quantity: data.quantity,
        category: data.category,
        brand: data.brand || undefined,
        status: data.status,
        isFeatured: data.isFeatured,
        thumbnail: thumbnailData,
        gallery: galleryData,
      };

      const response = await updateProduct(id, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message || "Failed to update product"
        : "Something went wrong";
      toast.error(message);
    },
  });

  return {
    // Query
    productsQuery,
    products: productsQuery.data?.data ?? [],
    metadata: productsQuery.data?.metadata,

    // Mutations
    createProductMutation,
    updateProductMutation,
    deleteProductMutation: useMutation({
      mutationFn: async (id: string) => {
        const response = await deleteProduct(id);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Product deleted successfully");
      },
      onError: (error) => {
        const message = isAxiosError(error)
          ? error.response?.data?.message || "Failed to delete product"
          : "Something went wrong";
        toast.error(message);
      },
    }),

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

