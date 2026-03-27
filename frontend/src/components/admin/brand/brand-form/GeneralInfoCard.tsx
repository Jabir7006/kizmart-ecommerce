import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/FormInput";
import type { BrandFormSectionProps } from "@/schemas/brandSchema";

export const GeneralInfoCard = ({ control }: BrandFormSectionProps) => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle>General Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormInput
        control={control}
        name="title"
        label="Brand Title"
        placeholder="Enter brand title..."
      />
    </CardContent>
  </Card>
);
