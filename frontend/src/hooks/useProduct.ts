import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
} from "@/services/api/product/productApi";
import {
  uploadSingleImage,
  uploadMultipleImage,
} from "@/services/api/upload/uploadApi";
import { useProductStore } from "@/store/useProductStore";
import type { Product, PaginatedProducts } from "@/types/productType";
import type { ProductFormOutput, ProductInput } from "@/schemas/productSchema";

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

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormOutput) => {
      let thumbnailData = null;
      if (data.thumbnail instanceof File) {
        const thumbRes = await uploadSingleImage(data.thumbnail, "thumbnails");
        thumbnailData = thumbRes.data.data;
      } else {
        throw new Error("Thumbnail is required");
      }

      let galleryData: { publicId: string; secureUrl: string }[] = [];
      if (data.gallery && data.gallery.length > 0) {
        const validFiles = data.gallery.filter((f) => f instanceof File);
        if (validFiles.length > 0) {
          const galleryRes = await uploadMultipleImage(validFiles, "galleries");
          galleryData = galleryRes.data.data;
        }
      }

      const productPayload: ProductInput = {
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

      const response = await createProduct(productPayload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    // Query
    productsQuery,
    products: productsQuery.data?.data ?? [],
    metadata: productsQuery.data?.metadata,

    // Mutations
    createProductMutation,

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
