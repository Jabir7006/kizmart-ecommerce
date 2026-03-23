import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageSelector } from "@/components/ui/ImageSelector";
import type { ProductFormSectionProps } from "@/schemas/productSchema";

export const MediaCard = ({ control }: ProductFormSectionProps) => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle>Media</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <ImageSelector
          control={control}
          name="thumbnail"
          label="Product Thumbnail (Required)"
          multiple={false}
        />
      </div>
      <div>
        <ImageSelector
          control={control}
          name="gallery"
          label="Image Gallery (Optional)"
          multiple={true}
        />
      </div>
    </CardContent>
  </Card>
);
