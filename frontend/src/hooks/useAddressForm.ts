import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "@/schemas/addressSchema";
import { useCreateAddress, useUpdateAddress } from "@/hooks/useAddress";
import type { Address, AddressFormData } from "@/types/addressType";

const EMPTY_DEFAULTS: AddressFormData = {
  fullName: "",
  phoneNumber: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  isDefault: false,
};

export const useAddressForm = () => {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: EMPTY_DEFAULTS,
  });

  const create = useCreateAddress();
  const update = useUpdateAddress();

  const resetForNew = () => form.reset(EMPTY_DEFAULTS);

  const resetForEdit = (address: Address) =>
    form.reset({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      isDefault: address.isDefault ?? false,
    });

  const buildSubmitHandler =
    (editingId: string | null, onSuccess: () => void) =>
    (data: AddressFormData) => {
      if (editingId) {
        update.mutate({ id: editingId, data }, { onSuccess });
      } else {
        create.mutate(data, { onSuccess });
      }
    };

  return {
    form,
    create,
    update,
    resetForNew,
    resetForEdit,
    buildSubmitHandler,
    isSubmitting: create.isPending || update.isPending,
  };
};
