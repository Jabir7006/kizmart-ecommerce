import { MapPin } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { FormInput } from "@/components/ui/FormInput";
import { FormCheckbox } from "@/components/ui/FormCheckbox";
import { Button } from "@/components/ui/button";

interface ShippingAddressFormProps {
  editingId: string | null;
  control: UseFormReturn<any>["control"];
  handleSubmit: UseFormReturn<any>["handleSubmit"];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ShippingAddressForm = ({
  editingId,
  control,
  handleSubmit,
  onSubmit,
  onCancel,
}: ShippingAddressFormProps) => {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col gap-6 p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-medium">
                {editingId ? "Edit Address" : "New Address"}
              </h2>
              <p className="text-sm text-neutral-500">
                Provide shipping details below
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <FormInput
            control={control}
            name="fullName"
            label="Full name"
            placeholder="John Doe"
          />

          <FormInput
            control={control}
            name="phoneNumber"
            label="Phone number"
            type="tel"
            placeholder="01722222222"
          />

          <FormInput
            control={control}
            name="streetAddress"
            label="Street address"
            placeholder="123 Dhanmondi Avenue, Floor 4"
          />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <FormInput
                control={control}
                name="city"
                label="City"
                placeholder="Dhaka"
              />
            </div>
            <div className="lg:col-span-1">
              <FormInput
                control={control}
                name="state"
                label="State"
                placeholder="Dhaka"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <FormInput
                control={control}
                name="postalCode"
                label="Postal code / ZIP"
                placeholder="1205"
              />
            </div>
          </div>

          <FormCheckbox
            control={control}
            name="isDefault"
            label="Save this information for next time (Set as default)"
          />

          <div className="flex justify-end mt-2">
            <Button type="submit" className="px-8">
              Save Address
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
