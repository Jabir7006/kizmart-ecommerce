import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormCheckbox } from "@/components/ui/FormCheckbox";
import type { ProductFormSectionProps } from "@/schemas/productSchema";
import { useCategory } from "@/hooks/useCategory";
import { useBrand } from "@/hooks/useBrand";

export const SidebarCards = ({ control }: ProductFormSectionProps) => {
  const { categories, categoriesQuery } = useCategory();
  const { brands, brandsQuery } = useBrand();

  const isCategoriesLoading = categoriesQuery.isLoading;
  const isBrandsLoading = brandsQuery.isLoading;

  const categoryOptions = categories.map((cat: any) => ({
    label: cat.title,
    value: cat._id,
  }));

  const brandOptions = brands.map((brand: any) => ({
    label: brand.title,
    value: brand._id,
  }));

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            control={control}
            name="status"
            label="Status"
            options={[
              { label: "Draft", value: "draft" },
              { label: "Active", value: "active" },
              { label: "Archived", value: "archived" },
            ]}
          />
          <FormSelect
            control={control}
            name="category"
            label="Category"
            options={categoryOptions}
            disabled={isCategoriesLoading}
          />
          <FormSelect
            control={control}
            name="brand"
            label="Brand (Optional)"
            options={brandOptions}
            disabled={isBrandsLoading}
          />
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <FormCheckbox
            control={control}
            name="isFeatured"
            label="Feature this product on homepage"
          />
        </CardContent>
      </Card>
    </div>
  );
};
