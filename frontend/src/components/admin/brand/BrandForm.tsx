import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  editBrandSchema,
  type BrandEditFormInput,
  type BrandEditFormOutput,
} from "@/schemas/brandSchema";

import { Button } from "@/components/ui/button";
import { GeneralInfoCard } from "@/components/admin/brand/brand-form/GeneralInfoCard";
import { MediaCard } from "@/components/admin/brand/brand-form/MediaCard";

const EMPTY_DEFAULTS: BrandEditFormInput = {
  title: "",
  logo: undefined as any,
};

interface BrandFormProps {
  initialData?: Partial<BrandEditFormInput>;
  onSubmit: (data: BrandEditFormOutput) => void | Promise<void>;
  isPending?: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

const BrandForm = ({
  initialData,
  onSubmit,
  isPending = false,
  onCancel,
  submitLabel = "Save Brand",
}: BrandFormProps) => {
  const { control, handleSubmit } = useForm<
    BrandEditFormInput,
    any,
    BrandEditFormOutput
  >({
    resolver: zodResolver(editBrandSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...initialData },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GeneralInfoCard control={control} />
        </div>
        <div className="space-y-6">
          <MediaCard control={control} />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-32">
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default BrandForm;
