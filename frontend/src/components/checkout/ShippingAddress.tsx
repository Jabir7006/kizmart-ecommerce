import { useState } from "react";
import { MapPin, Plus, Check, Edit2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

const DUMMY_ADDRESSES: Address[] = [
  {
    id: "1",
    fullName: "Jabir Al Fatah",
    phoneNumber: "01722222222",
    streetAddress: "123 Dhanmondi Avenue, Floor 4",
    city: "Dhaka",
    state: "Dhaka",
    postalCode: "1205",
    isDefault: true,
  },
  {
    id: "2",
    fullName: "John Doe",
    phoneNumber: "+1 (555) 123-4567",
    streetAddress: "456 Shopping Mall Blvd",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    isDefault: false,
  },
];

import { ShippingAddressForm } from "@/components/checkout/ShippingAddressForm";

export const ShippingAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>(DUMMY_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    DUMMY_ADDRESSES.find((a) => a.isDefault)?.id || DUMMY_ADDRESSES[0]?.id,
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { control, reset, handleSubmit } = useForm({
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

  const handleAddNew = () => {
    reset({
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
  };

  const handleEdit = (address: Address) => {
    reset(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddresses(addresses.filter((a) => a.id !== id));
    if (selectedAddressId === id) {
      setSelectedAddressId(addresses.find((a) => a.id !== id)?.id || "");
    }
  };

  const onSubmit = (data: any) => {
    if (editingId) {
      setAddresses(
        addresses.map((a) =>
          a.id === editingId ? { ...data, id: editingId } : a,
        ),
      );
    } else {
      const newId = `addr_${addresses.length + 1}`;
      setAddresses([...addresses, { ...data, id: newId }]);
      setSelectedAddressId(newId);
    }
    setShowForm(false);
  };

  if (showForm) {
    return (
      <ShippingAddressForm
        editingId={editingId}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        onCancel={() => setShowForm(false)}
      />
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
              key={address.id}
              onClick={() => setSelectedAddressId(address.id)}
              className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedAddressId === address.id ? "border-primary bg-primary/5" : "border-neutral-200 dark:border-neutral-800 hover:border-primary/50"}`}
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
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedAddressId === address.id ? "bg-primary border-primary text-white" : "border-neutral-300 dark:border-neutral-700"}`}
                >
                  {selectedAddressId === address.id && (
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
                    onClick={(e) => handleRemove(address.id, e)}
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
