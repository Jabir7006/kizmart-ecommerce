import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/FormInput";
import type { ProductFormSectionProps } from "@/schemas/productSchema";

export const PricingCard = ({ control }: ProductFormSectionProps) => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle>Pricing & Inventory</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormInput
        control={control}
        name="price"
        type="number"
        label="Price"
        placeholder="0.00"
      />
      <FormInput
        control={control}
        name="quantity"
        type="number"
        label="Quantity"
        placeholder="0"
      />
    </CardContent>
  </Card>
);
