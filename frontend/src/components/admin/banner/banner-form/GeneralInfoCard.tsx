import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import type { BannerFormSectionProps } from "@/schemas/bannerSchema";

const typeOptions = [
  { value: "banner", label: "Banner" },
  { value: "promo", label: "Promo" },
  { value: "offer", label: "Offer" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const GeneralInfoCard = ({ control }: BannerFormSectionProps) => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle>General Info</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormInput
        control={control}
        name="link"
        label="Destination URL"
        placeholder="https://example.com/sale"
      />
      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          control={control}
          name="type"
          label="Type"
          options={typeOptions}
        />
        <FormSelect
          control={control}
          name="status"
          label="Status"
          options={statusOptions}
        />
      </div>
      <FormInput
        control={control}
        name="displayOrder"
        label="Display Order"
        type="number"
        placeholder="0"
      />
    </CardContent>
  </Card>
);
