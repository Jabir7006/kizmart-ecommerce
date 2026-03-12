import { useState, useCallback, useEffect } from "react";
import { MapPin, Plus, Check, Edit2, Trash2, Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosResponse } from "axios";
import { Button } from "@/components/ui/button";
import { ShippingAddressForm } from "@/components/checkout/ShippingAddressForm";
import type { AddressFormData } from "@/types/addressType";
import { addressSchema } from "@/schemas/addressSchema";
import {
  useAddressesQuery,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/hooks/useAddress";
import type { Address } from "@/types/addressType";

export const ShippingAddress = ({
  onAddressSelect,
}: {
  onAddressSelect?: (id: string) => void;
}) => {
  const { data: addresses = [], isLoading } = useAddressesQuery();
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Auto-select default address when addresses load and none is selected
  useEffect(() => {
    if (addresses.length === 0) return;

    setSelectedAddressId((prev) => {
      if (prev) return prev;
      const defaultId =
        addresses.find((a) => a.isDefault)?._id || addresses[0]?._id;
      if (defaultId) {
        onAddressSelect?.(defaultId);
        return defaultId;
      }
      return prev;
    });
  }, [addresses, onAddressSelect]);

  const formMethods = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      isDefault: false,
    },
  });

  const handleSelectAddress = useCallback(
    (id: string) => {
      setSelectedAddressId(id);
      onAddressSelect?.(id);
    },
    [onAddressSelect],
  );

  const handleAddNew = useCallback(() => {
    formMethods.reset({
      fullName: "",
      phoneNumber: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(true);
  }, [formMethods]);

  const handleEdit = useCallback(
    (address: Address) => {
      formMethods.reset({
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        streetAddress: address.streetAddress,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        isDefault: address.isDefault,
      });
      setEditingId(address._id);
      setShowForm(true);
    },
    [formMethods],
  );

  const handleRemove = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      deleteAddress(id, {
        onSuccess: () => {
          if (selectedAddressId === id) {
            const firstAvailable =
              addresses.find((a) => a._id !== id)?._id || "";
            setSelectedAddressId(firstAvailable);
            onAddressSelect?.(firstAvailable);
          }
        },
      });
    },
    [deleteAddress, addresses, selectedAddressId, onAddressSelect],
  );

  const onSubmit = useCallback(
    (data: AddressFormData) => {
      if (editingId) {
        updateAddress(
          { id: editingId, data },
          {
            onSuccess: () => setShowForm(false),
          },
        );
      } else {
        createAddress(data, {
          onSuccess: (res: AxiosResponse) => {
            setShowForm(false);
            const newId = res?.data?.id;
            if (newId) {
              setSelectedAddressId(newId);
              onAddressSelect?.(newId);
            }
          },
        });
      }
    },
    [editingId, updateAddress, createAddress, onAddressSelect],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (showForm) {
    return (
      <FormProvider {...formMethods}>
        <ShippingAddressForm
          editingId={editingId}
          onSubmit={onSubmit}
          onCancel={() => setShowForm(false)}
          isSubmitting={isCreating || isUpdating}
        />
      </FormProvider>
    );
  }

  return (
    <section>
      <div className="flex flex-col gap-6 p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-medium">Shipping Address</h2>
              <p className="text-sm text-neutral-500">
                Where should we send your order?
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddNew}
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> Add New
          </Button>
        </div>

        <div className="grid gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              onClick={() => handleSelectAddress(address._id)}
              className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedAddressId === address._id ? "border-primary bg-primary/5" : "border-neutral-200 dark:border-neutral-800 hover:border-primary/50"}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                    {address.fullName}
                  </h4>
                  {address.isDefault && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed mb-2">
                  {address.streetAddress}, {address.city}, {address.state}{" "}
                  {address.postalCode}
                </p>
                <p className="text-sm text-neutral-500 flex items-center gap-1">
                  {address.phoneNumber}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 ml-4">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedAddressId === address._id ? "bg-primary border-primary text-white" : "border-neutral-300 dark:border-neutral-700"}`}
                >
                  {selectedAddressId === address._id && (
                    <Check className="w-3 h-3" />
                  )}
                </div>

                <div className="flex gap-1 mt-auto pt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-neutral-500 hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(address);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-neutral-500 hover:text-red-500"
                    onClick={(e) => handleRemove(address._id, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && (
            <div className="text-center py-8 text-neutral-500 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
              No addresses saved. Please add a new address.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
