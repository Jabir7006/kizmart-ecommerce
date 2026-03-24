import { useRef } from "react";
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

/** Discriminate between an existing saved image and a newly selected File */
function isExistingImage(
  value: unknown,
): value is { publicId: string; secureUrl: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "secureUrl" in value &&
    typeof (value as any).secureUrl === "string"
  );
}

function getPreviewUrl(item: File | { secureUrl: string }): string {
  return item instanceof File ? URL.createObjectURL(item) : item.secureUrl;
}

export const ImageSelector = <T extends FieldValues>({
  name,
  control,
  label,
  multiple = false,
}: ImageSelectorProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState }) => {
        // Normalise to an array for uniform rendering
        const items: (File | { publicId: string; secureUrl: string })[] =
          multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0) {
            if (multiple) {
              const newFiles = Array.from(e.target.files);
              onChange([...items, ...newFiles]);
            } else {
              onChange(e.target.files[0]);
            }
          }
          e.target.value = "";
        };

        const removeItem = (
          e: React.MouseEvent<HTMLButtonElement>,
          indexToRemove: number,
        ) => {
          // Prevent the click bubbling up to the drop zone or anything else
          e.preventDefault();
          e.stopPropagation();
          if (multiple) {
            onChange(items.filter((_, i) => i !== indexToRemove));
          } else {
            onChange(null);
          }
        };

        const openFilePicker = () => {
          fileInputRef.current?.click();
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-sm font-medium mb-2">
              {label}
            </FieldLabel>

            {/* Drop zone — clicking this opens the file picker */}
            <div
              role="button"
              tabIndex={0}
              onClick={openFilePicker}
              onKeyDown={(e) => e.key === "Enter" && openFilePicker()}
              className={cn(
                "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
                fieldState.invalid
                  ? "border-destructive/50 dark:border-destructive/50"
                  : "border-neutral-300 dark:border-neutral-700",
              )}
            >
              {/* Hidden file input — triggered programmatically */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileChange}
                className="sr-only"
              />

              <div className="flex flex-col items-center justify-center space-y-2">
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
                    {items.length > 0 && !multiple
                      ? "Click to replace"
                      : "Click to upload"}
                  </span>{" "}
                  or drag and drop
                </div>
                <p className="text-xs text-neutral-500">SVG, PNG, JPG or GIF</p>
              </div>
            </div>

            {/* Preview grid — completely separate from the drop zone */}
            {items.length > 0 && (
              <div
                className={cn(
                  "mt-4 grid gap-4",
                  multiple
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-2",
                )}
              >
                {items.map((item, idx) => {
                  const previewUrl = getPreviewUrl(item);
                  const key = isExistingImage(item)
                    ? item.publicId
                    : `file-${idx}-${(item as File).name}`;

                  return (
                    <div
                      key={key}
                      className="relative group overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 aspect-square"
                    >
                      <img
                        src={previewUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {isExistingImage(item) && (
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                          saved
                        </div>
                      )}
                      {/* Remove button — always visible, no hover required */}
                      <button
                        type="button"
                        onClick={(e) => removeItem(e, idx)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90 transition-colors z-10 shadow-md"
                        title="Remove image"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
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
