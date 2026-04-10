import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";
import {
  useInfiniteProductReviews,
  useMyProductReview,
  useReview,
} from "@/hooks/useReview";
import type { Product } from "@/types/productType";
import type { Review } from "@/types/reviewType";
import { useAuthStore } from "@/store/useAuthStore";
import ReviewCard from "@/components/product/reviews/ReviewCard";
import ReviewFormCard from "@/components/product/reviews/ReviewFormCard";
import ReviewListSkeleton from "@/components/product/reviews/ReviewListSkeleton";
import ReviewSummary from "@/components/product/reviews/ReviewSummary";
import { getUserId } from "@/components/product/reviews/reviewUtils";

interface ProductReviewsSectionProps {
  product: Product;
}

const ProductReviewsContent = ({ product }: ProductReviewsSectionProps) => {
  const user = useAuthStore((state) => state.user);
  const [editingReview, setEditingReview] = useState<Review | undefined>();
  const [reviewToDelete, setReviewToDelete] = useState<Review | undefined>();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProductReviews(product._id, { sortBy: "newest" });
  const myReviewQuery = useMyProductReview(product._id, !!user?._id);
  const { deleteReviewMutation } = useReview();

  const reviews = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );
  const ownReview = myReviewQuery.data ?? undefined;
  const activeEditingReview = useMemo(
    () =>
      editingReview
        ? ownReview?._id === editingReview._id
          ? ownReview
          : editingReview
        : undefined,
    [editingReview, ownReview],
  );

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteReviewMutation.mutateAsync(reviewToDelete._id);

      if (activeEditingReview?._id === reviewToDelete._id) {
        setEditingReview(undefined);
      }

      setReviewToDelete(undefined);
    } catch {
      // Mutation error handling is centralized in the hook.
    }
  };

  return (
    <div className="space-y-8">
      <ReviewSummary product={product} />

      <ReviewFormCard
        productId={product._id}
        ownReview={ownReview}
        editingReview={activeEditingReview}
        onStartEdit={setEditingReview}
        onDeleteOwnReview={(review) => setReviewToDelete(review)}
        onCancelEdit={() => setEditingReview(undefined)}
      />

      <div>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              Latest reviews
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Showing {Math.min(reviews.length, product.numReviews || 0)} of{" "}
              {product.numReviews || 0} reviews
            </p>
          </div>
        </div>

        {isLoading && <ReviewListSkeleton />}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm text-red-700">
              We couldn&apos;t load the reviews right now.
            </p>
            <Button
              variant="outline"
              className="mt-3 border-red-200 bg-white text-red-700 hover:bg-red-100"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !isError && reviews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <Star className="mx-auto h-8 w-8 text-slate-400" />
            <h4 className="mt-3 text-lg font-semibold text-slate-900">
              No reviews yet
            </h4>
            <p className="mt-2 text-sm text-slate-600">
              Be the first to share your experience with this product.
            </p>
          </div>
        )}

        {!isLoading && !isError && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review) => {
              const isOwnReview = !!user?._id && getUserId(review) === user._id;

              return (
                <ReviewCard
                  key={review._id}
                  review={review}
                  isOwnReview={isOwnReview}
                  isDeleting={
                    deleteReviewMutation.isPending &&
                    deleteReviewMutation.variables === review._id
                  }
                  onEdit={(selectedReview) => setEditingReview(selectedReview)}
                  onDelete={(selectedReview) =>
                    setReviewToDelete(selectedReview)
                  }
                />
              );
            })}
          </div>
        )}

        {!isLoading && !isError && hasNextPage && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="min-w-40 border-slate-200 bg-white hover:bg-slate-50"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "View More"
              )}
            </Button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!reviewToDelete}
        onOpenChange={(open) => {
          if (!open) setReviewToDelete(undefined);
        }}
        title="Delete your review?"
        description="This will permanently remove your rating and comment from this product."
        confirmLabel="Delete review"
        cancelLabel="Keep review"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        loading={deleteReviewMutation.isPending}
      />
    </div>
  );
};

const ProductReviewsSection = ({ product }: ProductReviewsSectionProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "240px 0px",
        threshold: 0.05,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <section
      ref={containerRef}
      id="reviews"
      className="mt-16 lg:mt-24 pt-12 border-t border-gray-100 scroll-mt-24"
    >
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">
            Ratings & Reviews
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            What shoppers are saying
          </h2>
        </div>
      </div>

      {shouldLoad ? (
        <ProductReviewsContent product={product} />
      ) : (
        <div
          className={cn(
            "rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm",
            "min-h-[320px]",
          )}
        >
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Lazy loaded
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">
              Reviews appear when you reach this section
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              We delay fetching reviews until this block enters the viewport to
              keep the product page fast and focused.
            </p>
          </div>
          <div className="mt-8">
            <ReviewListSkeleton />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductReviewsSection;
