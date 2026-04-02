import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/services/api/banner/bannerApi";
import { uploadSingleImage } from "@/services/api/upload/uploadApi";
import { handleMutationError } from "@/utils/errorUtils";
import { toast } from "sonner";

export const useBanner = (params?: { type?: string; status?: string }) => {
  const queryClient = useQueryClient();

  const queryKey = params ? ["banners", params] : ["banners"];

  const bannersQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getBanners(params);
      return response.data.data;
    },
  });

  const createBannerMutation = useMutation({
    mutationFn: async (data: any) => {
      let imageData = data.image;
      if (data.image instanceof File) {
        const res = await uploadSingleImage(data.image, "banners");
        imageData = res.data.data;
      }
      const payload = { ...data, image: imageData };
      const response = await createBanner(payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner created successfully!");
    },
    onError: (error) => handleMutationError(error, "Failed to create banner"),
  });

  const updateBannerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      let imageData = data.image;
      if (data.image instanceof File) {
        const res = await uploadSingleImage(data.image, "banners");
        imageData = res.data.data;
      }
      const payload = { ...data, image: imageData };
      const response = await updateBanner(id, payload);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      queryClient.invalidateQueries({ queryKey: ["banner", id] });
      toast.success("Banner updated successfully!");
    },
    onError: (error) => handleMutationError(error, "Failed to update banner"),
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteBanner(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner deleted successfully!");
    },
    onError: (error) => handleMutationError(error, "Failed to delete banner"),
  });

  return {
    banners: bannersQuery.data || [],
    bannersQuery,
    createBannerMutation,
    updateBannerMutation,
    deleteBannerMutation,
  };
};

export const useSingleBanner = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["banner", id],
    queryFn: async () => {
      const response = await getBanner(id);
      return response.data.data;
    },
    enabled: !!id && enabled,
    retry: 1,
  });
};

// ─── Promo / offer banners for homepage section ───────────────────────────────
export const usePromoBanners = (type: "promo" | "offer" = "promo") => {
  return useQuery({
    queryKey: ["banners", type],
    queryFn: async () => {
      const response = await getBanners({ type, status: "active" });
      return (response.data.data as import("@/types/bannerType").Banner[]).sort(
        (a, b) => a.displayOrder - b.displayOrder,
      );
    },
    staleTime: 10 * 60 * 1000, // 10 min
  });
};
