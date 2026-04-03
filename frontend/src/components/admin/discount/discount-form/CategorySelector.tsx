import type { CategorySelectorProps } from "@/components/admin/discount/discount-form/types";

export const CategorySelector = ({
  categories,
  selectedIds,
  onToggle,
}: CategorySelectorProps) => (
  <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border p-3">
    {categories.length > 0 ? (
      categories.map((category) => (
        <label
          key={category._id}
          className="flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{category.title}</p>
            <p className="text-xs text-muted-foreground">/{category.slug}</p>
          </div>
          <input
            type="checkbox"
            checked={selectedIds.includes(category._id)}
            onChange={() => onToggle(category._id)}
            className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary/20"
          />
        </label>
      ))
    ) : (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No categories available.
      </p>
    )}
  </div>
);
