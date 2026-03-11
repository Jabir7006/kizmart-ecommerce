import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../services/api/address/addressApi";
import { toast } from "sonner";
import type { Address } from "@/types/addressType";

export const useAddressesQuery = () => {
  return useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: async () => {
      const { data } = await getAddresses();
      return data.data;
    },
  });
};

export const useAddressQuery = (id: string, enabled = true) => {
  return useQuery<Address>({
    queryKey: ["address", id],
    queryFn: async () => {
      const { data } = await getAddressById(id);
      return data.data;
    },
    enabled: !!id && enabled,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create address");
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Address }) =>
      updateAddress(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["address", variables.id] });
      toast.success("Address updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update address");
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete address");
    },
  });
};
