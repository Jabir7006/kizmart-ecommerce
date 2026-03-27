import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/services/api/brand/brandApi";
import { uploadSingleImage } from "@/services/api/upload/uploadApi";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useBrand = () => {
  const queryClient = useQueryClient();

  const brandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await getBrands();
      return response.data.data;
    },
  });

  const createBrandMutation = useMutation({
    mutationFn: async (data: any) => {
      let logoData = data.logo;
      if (data.logo instanceof File) {
        const res = await uploadSingleImage(data.logo, "brand_logos");
        logoData = res.data.data;
      }

      const payload = {
        title: data.title,
        ...(logoData && { logo: logoData }),
      };

      const response = await createBrand(payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      let logoData = data.logo;
      if (data.logo instanceof File) {
        const res = await uploadSingleImage(data.logo, "brand_logos");
        logoData = res.data.data;
      }

      const payload: Record<string, any> = {
        title: data.title,
        logo: logoData ?? null,
      };

      const response = await updateBrand(id, payload);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brand", id] });
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteBrand(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message || "Failed to delete brand"
        : "Something went wrong";
      toast.error(message);
    },
  });

  return {
    brands: brandsQuery.data || [],
    brandsQuery,
    createBrandMutation,
    updateBrandMutation,
    deleteBrandMutation,
  };
};

export const useSingleBrand = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["brand", id],
    queryFn: async () => {
      const response = await getBrand(id);
      return response.data.data;
    },
    enabled: !!id && enabled,
    retry: 1,
  });
};
