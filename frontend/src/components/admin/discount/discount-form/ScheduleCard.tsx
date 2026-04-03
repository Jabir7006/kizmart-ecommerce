import type { DiscountFormSectionProps } from "@/components/admin/discount/discount-form/types";
import { FormInput } from "@/components/ui/FormInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ScheduleCard = ({ control }: DiscountFormSectionProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Schedule</CardTitle>
      <CardDescription>
        Control when the discount becomes available and when it ends.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-5">
      <FormInput
        name="startDate"
        control={control}
        label="Start date"
        type="date"
      />
      <FormInput name="endDate" control={control} label="End date" type="date" />
    </CardContent>
  </Card>
);
