import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageSelector } from "@/components/ui/ImageSelector";
import type { CategoryFormSectionProps } from "@/schemas/categorySchema";

export const MediaCard = ({ control }: CategoryFormSectionProps) => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle>Media</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <ImageSelector
          control={control}
          name="thumbnail"
          label="Category Thumbnail (Optional)"
          multiple={false}
        />
      </div>
    </CardContent>
  </Card>
);
