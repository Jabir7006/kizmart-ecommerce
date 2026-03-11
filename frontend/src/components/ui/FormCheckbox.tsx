import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

export const FormCheckbox = <T extends FieldValues>({
  name,
  control,
  label,
}: FormCheckboxProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id={name}
              className="rounded border-neutral-300 text-primary w-4 h-4 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-800"
              checked={value || false}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              aria-invalid={fieldState.invalid}
            />
            <Label htmlFor={name} className="text-sm font-normal text-neutral-500 hover:cursor-pointer">
              {label}
            </Label>
          </div>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} className="mt-1" />
          )}
        </Field>
      )}
    />
  );
};
