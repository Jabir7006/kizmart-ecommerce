import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/FormInput";
import type { CategoryFormSectionProps } from "@/schemas/categorySchema";

export const GeneralInfoCard = ({ control }: CategoryFormSectionProps) => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle>General Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormInput
        control={control}
        name="title"
        label="Category Title"
        placeholder="Enter category title..."
      />
    </CardContent>
  </Card>
);
