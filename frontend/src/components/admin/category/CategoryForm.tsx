
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  editCategorySchema,
  type CategoryEditFormInput,
  type CategoryEditFormOutput,
} from "@/schemas/categorySchema";

import { Button } from "@/components/ui/button";
import { GeneralInfoCard } from "@/components/admin/category/category-form/GeneralInfoCard";
import { MediaCard } from "@/components/admin/category/category-form/MediaCard";

const EMPTY_DEFAULTS: CategoryEditFormInput = {
  title: "",
  thumbnail: undefined as any,
};

interface CategoryFormProps {
  /** Pre-populated values for edit mode. Omit for create mode. */
  initialData?: Partial<CategoryEditFormInput>;
  onSubmit: (data: CategoryEditFormOutput) => void | Promise<void>;
  isPending?: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

/**
 * Shared form used by both CategoryAddPage and CategoryEditPage.
 * Accepts initialData to pre-fill fields in edit mode.
 */
const CategoryForm = ({
  initialData,
  onSubmit,
  isPending = false,
  onCancel,
  submitLabel = "Save Category",
}: CategoryFormProps) => {
  const { control, handleSubmit } = useForm<
    CategoryEditFormInput,
    any,
    CategoryEditFormOutput
  >({
    resolver: zodResolver(editCategorySchema),
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

export default CategoryForm;
