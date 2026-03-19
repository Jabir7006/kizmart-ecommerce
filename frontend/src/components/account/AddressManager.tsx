import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ErrorState from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { ShippingAddressForm } from "@/components/checkout/ShippingAddressForm";
import AddressCard from "@/components/account/AddressCard";
import { useAddressesQuery, useDeleteAddress } from "@/hooks/useAddress";
import { useAddressForm } from "@/hooks/useAddressForm";
import type { Address } from "@/types/addressType";

const AddressManagerSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {[1, 2].map((i) => (
      <Skeleton key={i} className="h-36 w-full rounded-xl" />
    ))}
  </div>
);

const AddressManager = () => {
  const { data: addresses, isLoading, isError, refetch } = useAddressesQuery();
  const deleteAddress = useDeleteAddress();
  const { form, resetForNew, resetForEdit, buildSubmitHandler, isSubmitting } =
    useAddressForm();

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);

  const isFormOpen = isAdding || !!editingAddress;

  const handleAddClick = () => {
    resetForNew();
    setEditingAddress(null);
    setIsAdding(true);
  };

  const handleEditClick = (address: Address) => {
    resetForEdit(address);
    setIsAdding(false);
    setEditingAddress(address);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingAddress(null);
    form.reset();
  };

  const handleSubmit = buildSubmitHandler(editingAddress?._id ?? null, handleCancel);

  const handleDeleteConfirm = async () => {
    if (!deletingAddress) return;
    await deleteAddress.mutateAsync(deletingAddress._id);
    setDeletingAddress(null);
  };

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Saved Addresses</h2>
          <p className="text-sm text-muted-foreground">
            Manage your delivery addresses
          </p>
        </div>
        {!isFormOpen && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleAddClick}
          >
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        )}
      </div>

      {/* Inline form */}
      {isFormOpen && (
        <FormProvider {...form}>
          <ShippingAddressForm
            editingId={editingAddress?._id ?? null}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </FormProvider>
      )}

      {/* Address list */}
      {isLoading && <AddressManagerSkeleton />}

      {isError && (
        <ErrorState
          title="Failed to load addresses"
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && addresses?.length === 0 && !isFormOpen && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-semibold">No addresses saved</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add a delivery address to get started
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddClick} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        </div>
      )}

      {!isLoading && !isError && (addresses?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses!.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={handleEditClick}
              onDelete={setDeletingAddress}
            />
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deletingAddress}
        onOpenChange={(open) => !open && setDeletingAddress(null)}
        title="Delete Address"
        description={`Are you sure you want to delete the address for ${deletingAddress?.fullName}?`}
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        loading={deleteAddress.isPending}
      />
    </div>
  );
};

export default AddressManager;
