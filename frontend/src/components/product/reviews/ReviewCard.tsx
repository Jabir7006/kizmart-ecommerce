import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Rating } from "react-simple-star-rating";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Review } from "@/types/reviewType";
import {
  formatReviewDate,
  getInitials,
  getUserName,
} from "./reviewUtils";

interface ReviewCardProps {
  review: Review;
  isOwnReview: boolean;
  isDeleting: boolean;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
}

const ReviewCard = ({
  review,
  isOwnReview,
  isDeleting,
  onEdit,
  onDelete,
}: ReviewCardProps) => {
  const reviewerName = getUserName(review);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar size="lg" className="ring-2 ring-orange-100">
          <AvatarFallback className="bg-orange-100 font-semibold text-orange-700">
            {getInitials(reviewerName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-slate-900">{reviewerName}</h4>
                {isOwnReview && (
                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700">
                    Your review
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Rating
                  initialValue={review.rating}
                  readonly
                  size={18}
                  fillColor="#f59e0b"
                  emptyColor="#e5e7eb"
                  SVGclassName="inline-block"
                />
                <span className="text-sm text-slate-500">
                  {formatReviewDate(review.updatedAt || review.createdAt)}
                </span>
              </div>
            </div>

            {isOwnReview && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-slate-700"
                  onClick={() => onEdit(review)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={isDeleting}
                  onClick={() => onDelete(review)}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </Button>
              </div>
            )}
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {review.comment}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;
