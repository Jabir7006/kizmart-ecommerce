import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FormInput } from "@/components/ui/FormInput";
import type { BannerFormSectionProps } from "@/schemas/bannerSchema";

export const ScheduleCard = ({ control }: BannerFormSectionProps) => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle>Schedule</CardTitle>
      <CardDescription>Optional date range for this banner.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormInput
        control={control}
        name="startDate"
        label="Start Date"
        type="date"
      />
      <FormInput
        control={control}
        name="endDate"
        label="End Date"
        type="date"
      />
    </CardContent>
  </Card>
);
