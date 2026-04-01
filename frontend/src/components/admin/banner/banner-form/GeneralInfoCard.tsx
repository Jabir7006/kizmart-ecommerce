import { useWatch } from "react-hook-form";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import type { BannerFormSectionProps } from "@/schemas/bannerSchema";

const typeOptions = [
  { value: "banner", label: "Banner (Hero Slider)" },
  { value: "promo", label: "Promo (Exclusive Collections)" },
  { value: "offer", label: "Offer (Unlimited Offers)" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const SIZE_HINTS: Record<string, { size: string; ratio: string; note: string }> = {
  banner: {
    size: "1920 × 640 px",
    ratio: "3:1 (21:7)",
    note: "Displayed as a full-width hero slider. Wide, short landscape.",
  },
  promo: {
    size: "1200 × 675 px",
    ratio: "16:9",
    note: "Shown in the Exclusive Collections row (3 cards wide on desktop).",
  },
  offer: {
    size: "800 × 600 px",
    ratio: "4:3",
    note: "Shown in the Unlimited Offers row (3 cards wide on desktop).",
  },
};

const TypeSizeHint = ({ control }: BannerFormSectionProps) => {
  const type = useWatch({ control, name: "type" }) as string;
  const hint = SIZE_HINTS[type];
  if (!hint) return null;

  return (
    <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <div className="space-y-0.5">
        <p className="font-semibold">
          Recommended: {hint.size} &mdash; {hint.ratio}
        </p>
        <p className="text-blue-600/80 dark:text-blue-400/80">{hint.note}</p>
      </div>
    </div>
  );
};

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
      {/* Reactive size hint — updates as the admin changes Type */}
      <TypeSizeHint control={control} />
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

