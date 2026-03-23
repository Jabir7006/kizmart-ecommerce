import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextarea } from "@/components/ui/FormTextarea";
import type { ProductFormSectionProps } from "@/schemas/productSchema";

export const GeneralInfoCard = ({ control }: ProductFormSectionProps) => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle>General Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormInput
        control={control}
        name="title"
        label="Product Title"
        placeholder="Enter product title..."
      />
      <FormTextarea
        control={control}
        name="shortDescription"
        label="Short Description"
        placeholder="Brief summary of the product..."
        rows={2}
      />
      <FormTextarea
        control={control}
        name="longDescription"
        label="Long Description"
        placeholder="Detailed product description..."
        rows={6}
      />
    </CardContent>
  </Card>
);
