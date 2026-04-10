import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { Edit3, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { reviewSchema, type ReviewFormInput } from "@/schemas/reviewSchema";
import { useReview } from "@/hooks/useReview";
import type { Review } from "@/types/reviewType";
import { useAuthStore } from "@/store/useAuthStore";
import { formatReviewDate } from "./reviewUtils";

interface ReviewFormCardProps {
  productId: string;
  ownReview?: Review;
  editingReview?: Review;
  onStartEdit: (review: Review) => void;
  onDeleteOwnReview: (review: Review) => void;
  onCancelEdit: () => void;
}

type ReviewFormValues = ReviewFormInput;

const ReviewFormCard = ({
  productId,
  ownReview,
  editingReview,
  onStartEdit,
  onDeleteOwnReview,
  onCancelEdit,
}: ReviewFormCardProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { createReviewMutation, updateReviewMutation } = useReview();
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      product: productId,
      rating: editingReview?.rating ?? 5,
      comment: editingReview?.comment ?? "",
    },
  });

  const watchedRating = useWatch({
    control: form.control,
    name: "rating",
  });
  const watchedComment = useWatch({
    control: form.control,
    name: "comment",
  });
  const activeRating = hoveredRating || Number(watchedRating || 0);

  useEffect(() => {
    form.reset({
      product: productId,
      rating: editingReview?.rating ?? 5,
      comment: editingReview?.comment ?? "",
    });
  }, [editingReview, form, productId]);

  const isSubmitting =
    createReviewMutation.isPending || updateReviewMutation.isPending;

  const onSubmit = (values: ReviewFormValues) => {
    if (!isAuthenticated) return;

    if (editingReview) {
      updateReviewMutation.mutate(
        {
          id: editingReview._id,
          data: {
            rating: Number(values.rating),
            comment: values.comment,
          },
        },
        {
          onSuccess: () => {
            onCancelEdit();
          },
        },
      );
      return;
    }

    createReviewMutation.mutate({
      product: productId,
      rating: Number(values.rating),
      comment: values.comment,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Edit3 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              Share your experience
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Sign in to rate this product, write a review, and manage your feedback later.
            </p>
            <Button asChild className="mt-4 bg-orange-500 text-white hover:bg-orange-600">
              <Link to="/signin">Sign in to review</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (ownReview && !editingReview) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Your review is already posted
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              You have already reviewed this product
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Rating
                initialValue={ownReview.rating}
                readonly
                size={20}
                fillColor="#f59e0b"
                emptyColor="#d1d5db"
                SVGclassName="inline-block"
              />
              <span className="text-sm text-slate-500">
                Updated {formatReviewDate(ownReview.updatedAt)}
              </span>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {ownReview.comment}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:min-w-[180px] sm:items-stretch">
            <Button
              className="bg-orange-500 text-white hover:bg-orange-600"
              onClick={() => onStartEdit(ownReview)}
            >
              <Pencil className="h-4 w-4" />
              Edit your review
            </Button>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => onDeleteOwnReview(ownReview)}
            >
              Delete review
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {editingReview ? "Editing your review" : "Write a review"}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {editingReview
              ? "Update your rating or comment, then save your changes."
              : "Help other shoppers with an honest rating and a few useful details."}
          </p>
        </div>
        {editingReview && (
          <Button variant="ghost" size="sm" onClick={onCancelEdit}>
            Cancel edit
          </Button>
        )}
      </div>

      <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <input type="hidden" {...form.register("product")} value={productId} />

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-900">Your rating</label>
            <span className="text-sm font-medium text-slate-500">
              {activeRating ? `${activeRating}/5` : "Select a rating"}
            </span>
          </div>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Rating
              initialValue={Number(watchedRating || 0)}
              allowFraction={false}
              size={28}
              transition
              fillColor="#f59e0b"
              emptyColor="#d1d5db"
              onClick={(rate) => {
                form.setValue("rating", rate, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              onPointerMove={(value) => setHoveredRating(Math.round(value))}
              onPointerLeave={() => setHoveredRating(0)}
              SVGclassName="inline-block"
            />
          </div>
          {form.formState.errors.rating && (
            <p className="mt-2 text-sm text-red-600">
              {form.formState.errors.rating.message}
            </p>
          )}
        </div>

        <FormTextarea
          control={form.control}
          name="comment"
          label="Your review"
          placeholder="What stood out? Share fit, quality, durability, or anything another shopper should know."
          rows={5}
          labelRight={
            <span className="text-xs text-slate-500">
              {watchedComment?.length ?? 0}/1000
            </span>
          }
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {editingReview ? "Saving..." : "Submitting..."}
              </>
            ) : editingReview ? (
              "Save changes"
            ) : (
              "Submit review"
            )}
          </Button>
          <p className="text-xs leading-5 text-slate-500">
            Reviews are posted instantly and may be edited later from this section.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ReviewFormCard;
