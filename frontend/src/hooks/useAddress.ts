import { handleMutationError } from "@/utils/errorUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../services/api/address/addressApi";
import { toast } from "sonner";
import type { Address, AddressFormData } from "@/types/addressType";

export const addressKeys = {
  all: ["addresses"] as const,
  detail: (id: string) => ["address", id] as const,
};

export const useAddressesQuery = () => {
  return useQuery<Address[]>({
    queryKey: addressKeys.all,
    queryFn: async () => {
      const { data } = await getAddresses();
      return data.data;
    },
  });
};

export const useAddressQuery = (id: string, enabled = true) => {
  return useQuery<Address>({
    queryKey: addressKeys.detail(id),
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
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success("Address created successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to create address"),
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressFormData }) =>
      updateAddress(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      queryClient.invalidateQueries({
        queryKey: addressKeys.detail(variables.id),
      });
      toast.success("Address updated successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to update address"),
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success("Address deleted successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to delete address"),
  });
};
