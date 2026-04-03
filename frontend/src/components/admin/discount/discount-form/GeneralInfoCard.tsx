import { discountTypeOptions } from "@/components/admin/discount/discount-form/constants";
import type { DiscountFormSectionProps } from "@/components/admin/discount/discount-form/types";
import { FormCheckbox } from "@/components/ui/FormCheckbox";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const GeneralInfoCard = ({ control }: DiscountFormSectionProps) => (
  <Card>
    <CardHeader>
      <CardTitle>General Information</CardTitle>
      <CardDescription>
        Define the discount type, value, and whether it should be active.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-5">
      <FormInput
        name="name"
        control={control}
        label="Discount name"
        placeholder="Summer sale"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormSelect
          name="discountType"
          control={control}
          label="Discount type"
          options={discountTypeOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
        />

        <FormInput
          name="value"
          control={control}
          label="Value"
          type="number"
          placeholder="10"
        />
      </div>

      <FormCheckbox
        name="isActive"
        control={control}
        label="Enable this discount immediately"
      />
    </CardContent>
  </Card>
);
