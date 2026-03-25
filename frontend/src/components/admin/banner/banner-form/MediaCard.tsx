import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageSelector } from '@/components/ui/ImageSelector';
import type { BannerFormSectionProps } from '@/schemas/bannerSchema';

export const MediaCard = ({ control }: BannerFormSectionProps) => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle>Banner Image</CardTitle>
    </CardHeader>
    <CardContent>
      <ImageSelector
        control={control}
        name="image"
        label="Banner Image (Required — 1920×auto recommended)"
        multiple={false}
      />
    </CardContent>
  </Card>
);
