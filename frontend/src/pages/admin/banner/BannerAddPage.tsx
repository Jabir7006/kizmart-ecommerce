import { useNavigate } from 'react-router-dom';
import { useBanner } from '@/hooks/useBanner';
import BannerForm from '@/components/admin/banner/BannerForm';
import type { BannerFormOutput } from '@/schemas/bannerSchema';

const BannerAddPage = () => {
  const navigate = useNavigate();
  const { createBannerMutation } = useBanner();

  const onSubmit = async (data: BannerFormOutput) => {
    try {
      await createBannerMutation.mutateAsync(data);
      navigate('/admin/banners');
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Add New Banner</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a banner image (1920×auto recommended for best quality).
        </p>
      </div>
      <BannerForm
        onSubmit={onSubmit}
        isPending={createBannerMutation.isPending}
        onCancel={() => navigate(-1)}
        submitLabel="Save Banner"
      />
    </div>
  );
};

export default BannerAddPage;
