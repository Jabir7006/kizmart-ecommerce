import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, Plus } from 'lucide-react';
import { AdminListTemplate } from '@/components/ui/AdminListTemplate';
import ConfirmModal from '@/components/ui/ConfirmModal';
import AdminBannerListItem from '@/components/admin/banner/AdminBannerListItem';
import ListItemSkeleton from '@/components/ui/ListItemSkeleton';
import { Button } from '@/components/ui/button';
import { useBanner } from '@/hooks/useBanner';
import type { Banner } from '@/types/bannerType';

const BannerListPage = () => {
  const { banners, bannersQuery, deleteBannerMutation } = useBanner();
  const { isLoading, isError, error, refetch } = bannersQuery;

  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return;
    try {
      await deleteBannerMutation.mutateAsync(bannerToDelete._id);
    } catch {
      // Error handled by hook
    } finally {
      setBannerToDelete(null);
    }
  };

  const filteredBanners = banners.filter((b: Banner) =>
    b.link.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const emptyTitle = searchQuery ? `No results for "${searchQuery}"` : 'No banners found';
  const emptyDescription = searchQuery
    ? 'Try a different search term.'
    : 'Add your first banner to get started.';

  return (
    <AdminListTemplate
      title="Banners"
      description="Manage your store's promotional banners"
      headerAction={
        <Button asChild size="sm">
          <Link to="/admin/banners/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Banner
          </Link>
        </Button>
      }
      searchValue={searchQuery}
      onSearch={setSearchQuery}
      searchPlaceholder="Search by link or type…"
      isLoading={isLoading}
      isError={isError}
      error={error as Error}
      onRetry={() => refetch()}
      isEmpty={filteredBanners.length === 0}
      emptyIcon={<ImageIcon className="h-8 w-8 text-muted-foreground/50" />}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyAction={
        !searchQuery ? (
          <Button asChild size="sm">
            <Link to="/admin/banners/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Banner
            </Link>
          </Button>
        ) : undefined
      }
      items={filteredBanners}
      renderItem={(banner: Banner) => (
        <AdminBannerListItem
          key={banner._id}
          banner={banner}
          onDelete={setBannerToDelete}
        />
      )}
      renderSkeleton={() => (
        <>
          {Array.from({ length: 4 }).map((_, i) => (
            <ListItemSkeleton key={i} showImage descriptionLines={2} />
          ))}
        </>
      )}
    >
      <ConfirmModal
        open={!!bannerToDelete}
        onOpenChange={(open) => !open && setBannerToDelete(null)}
        title="Delete Banner"
        description={`Are you sure you want to delete this ${bannerToDelete?.type} banner? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </AdminListTemplate>
  );
};

export default BannerListPage;
