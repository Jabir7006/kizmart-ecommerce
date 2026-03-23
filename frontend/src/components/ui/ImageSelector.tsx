import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface ImageSelectorProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  multiple?: boolean;
}

export const ImageSelector = <T extends FieldValues>({
  name,
  control,
  label,
  multiple = false,
}: ImageSelectorProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState }) => {
        // Safe check for value being an array or single file
        const files: File[] = multiple
          ? Array.isArray(value)
            ? value
            : []
          : value
            ? [value as File]
            : [];

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0) {
            if (multiple) {
              const newFiles = Array.from(e.target.files);
              onChange([...files, ...newFiles]);
            } else {
              onChange(e.target.files[0]);
            }
          }
          // Reset value to allow selecting same file again if removed
          e.target.value = "";
        };

        const removeFile = (indexToRemove: number) => {
          if (multiple) {
            const newFiles = files.filter((_, i) => i !== indexToRemove);
            onChange(newFiles);
          } else {
            onChange(undefined);
          }
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-sm font-medium mb-2">
              {label}
            </FieldLabel>

            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
                fieldState.invalid
                  ? "border-destructive/50 dark:border-destructive/50"
                  : "border-neutral-300 dark:border-neutral-700",
              )}
            >
              <input
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title=""
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <svg
                  className="w-8 h-8 text-neutral-400"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  <span className="text-primary hover:underline font-semibold">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </div>
                <p className="text-xs text-neutral-500">SVG, PNG, JPG or GIF</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {files.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="relative group overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 aspect-square"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 transition-colors"
                        title="Remove image"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} className="mt-1" />
            )}
          </Field>
        );
      }}
    />
  );
};
