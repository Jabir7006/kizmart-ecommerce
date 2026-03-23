import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = "Select an option",
  disabled,
}: FormSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name} className="flex text-sm font-medium">
            {label}
          </FieldLabel>
          <select
            {...field}
            id={name}
            disabled={disabled || field.disabled}
            aria-invalid={fieldState.invalid}
            className={cn(
              "mt-2 h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
            )}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="text-black dark:bg-neutral-900 dark:text-white">
                {option.label}
              </option>
            ))}
          </select>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} className="mt-1" />
          )}
        </Field>
      )}
    />
  );
};
