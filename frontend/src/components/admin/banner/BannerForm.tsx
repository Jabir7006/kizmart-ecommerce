import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  editBannerSchema,
  type BannerFormInput,
  type BannerFormOutput,
} from '@/schemas/bannerSchema';
import { Button } from '@/components/ui/button';
import { MediaCard } from './banner-form/MediaCard';
import { GeneralInfoCard } from './banner-form/GeneralInfoCard';
import { ScheduleCard } from './banner-form/ScheduleCard';

const EMPTY_DEFAULTS: BannerFormInput = {
  image: undefined as any,
  link: '',
  type: 'banner',
  status: 'active',
  displayOrder: 0,
  startDate: '',
  endDate: '',
};

interface BannerFormProps {
  initialData?: Partial<BannerFormInput>;
  onSubmit: (data: BannerFormOutput) => void | Promise<void>;
  isPending?: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

const BannerForm = ({
  initialData,
  onSubmit,
  isPending = false,
  onCancel,
  submitLabel = 'Save Banner',
}: BannerFormProps) => {
  const { control, handleSubmit, reset } = useForm<
    BannerFormInput,
    any,
    BannerFormOutput
  >({
    resolver: zodResolver(editBannerSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...initialData },
  });

  useEffect(() => {
    if (initialData) {
      reset({ ...EMPTY_DEFAULTS, ...initialData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialData)]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: image + general info */}
        <div className="lg:col-span-2 space-y-6">
          <MediaCard control={control} />
          <GeneralInfoCard control={control} />
        </div>
        {/* Right: schedule */}
        <div className="space-y-6">
          <ScheduleCard control={control} />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-32">
          {isPending ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default BannerForm;
