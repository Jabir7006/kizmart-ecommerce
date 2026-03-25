import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBanner, useSingleBanner } from '@/hooks/useBanner';
import BannerForm from '@/components/admin/banner/BannerForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { BannerFormOutput } from '@/schemas/bannerSchema';

const BannerEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateBannerMutation } = useBanner();
  const { data: banner, isLoading, isError } = useSingleBanner(id ?? '');

  const onSubmit = async (data: BannerFormOutput) => {
    if (!banner?._id) return;
    try {
      await updateBannerMutation.mutateAsync({ id: banner._id, data });
      navigate('/admin/banners');
    } catch {
      // Error handled by hook
    }
  };

  // Stable reference — only changes when banner data changes
  const initialData = useMemo(
    () =>
      banner
        ? {
            image: banner.image as any,
            link: banner.link,
            type: banner.type,
            status: banner.status,
            displayOrder: banner.displayOrder,
            startDate: banner.startDate
              ? new Date(banner.startDate).toISOString().split('T')[0]
              : '',
            endDate: banner.endDate
              ? new Date(banner.endDate).toISOString().split('T')[0]
              : '',
          }
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [banner?._id],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size={32} className="text-primary" />
      </div>
    );
  }

  if (isError || !banner) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-destructive">Banner not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Edit Banner</h1>
        <p className="text-sm text-muted-foreground mt-1 capitalize">
          {banner.type} · Order #{banner.displayOrder}
        </p>
      </div>
      <BannerForm
        key={banner._id}
        initialData={initialData}
        onSubmit={onSubmit}
        isPending={updateBannerMutation.isPending}
        onCancel={() => navigate(-1)}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default BannerEditPage;
