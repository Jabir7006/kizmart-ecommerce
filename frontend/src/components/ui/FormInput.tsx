import type { Control, FieldValues, Path } from "react-hook-form";
import type { ReactNode } from "react";
import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  labelRight?: ReactNode;
}

export const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  autoComplete,
  labelRight,
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor={name} className="text-sm font-medium">
              {label}
            </FieldLabel>
            {labelRight && labelRight}
          </div>
          <Input
            {...field}
            id={name}
            type={type}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className="mt-2"
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} className="mt-1" />
          )}
        </Field>
      )}
    />
  );
};
