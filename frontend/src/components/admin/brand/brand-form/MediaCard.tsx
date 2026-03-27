import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageSelector } from "@/components/ui/ImageSelector";
import type { BrandFormSectionProps } from "@/schemas/brandSchema";

export const MediaCard = ({ control }: BrandFormSectionProps) => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle>Media</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <ImageSelector
          control={control}
          name="logo"
          label="Brand Logo (Optional)"
          multiple={false}
        />
      </div>
    </CardContent>
  </Card>
);
