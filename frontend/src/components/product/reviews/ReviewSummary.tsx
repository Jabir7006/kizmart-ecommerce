import { MessageSquare } from "lucide-react";
import { Rating } from "react-simple-star-rating";
import type { Product } from "@/types/productType";

const ReviewSummary = ({ product }: { product: Product }) => {
  const averageRating = product.ratings ?? 0;
  const totalReviews = product.numReviews ?? 0;

  return (
    <div className="grid gap-3 sm:gap-5 rounded-xl sm:rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-3 sm:p-6 shadow-sm md:grid-cols-[220px_1fr] md:p-8">
      {/* Rating card */}
      <div className="rounded-lg sm:rounded-2xl bg-white/90 p-3 sm:p-5 shadow-sm ring-1 ring-orange-100">
        <p className="text-[10px] sm:text-sm font-medium sm:font-semibold uppercase tracking-wider sm:tracking-[0.2em] text-orange-600">
          Customer Rating
        </p>
        <div className="mt-1.5 sm:mt-4 flex items-end gap-1.5 sm:gap-2">
          <span className="text-3xl sm:text-5xl font-semibold sm:font-bold tracking-tight text-slate-900">
            {averageRating.toFixed(1)}
          </span>
          <span className="pb-0.5 sm:pb-1 text-[10px] sm:text-sm font-medium text-slate-500">/ 5</span>
        </div>
        <div className="mt-1.5 sm:mt-3">
          <Rating
            initialValue={averageRating}
            readonly
            allowFraction
            size={18}
            SVGclassName="inline-block"
            fillColor="#f59e0b"
            emptyColor="#e5e7eb"
          />
        </div>
        <p className="mt-1.5 sm:mt-3 text-[10px] sm:text-sm text-slate-600">
          Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Feedback info card */}
      <div className="flex flex-col justify-between rounded-lg sm:rounded-2xl border border-dashed border-orange-200 bg-white/70 p-3 sm:p-5">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-2xl bg-orange-100 text-orange-600">
            <MessageSquare className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-xl font-medium sm:font-semibold text-slate-900">Real buyer feedback</h3>
            <p className="text-[10px] sm:text-sm text-slate-600 leading-snug sm:leading-normal">
              Ratings update automatically as customers share their experience.
            </p>
          </div>
        </div>

        <div className="mt-3 sm:mt-6 grid grid-cols-3 gap-1.5 sm:gap-3">
          <div className="rounded-lg sm:rounded-2xl bg-slate-50 p-2 sm:p-4">
            <p className="text-[8px] sm:text-xs font-medium sm:font-semibold uppercase tracking-wider sm:tracking-[0.2em] text-slate-500 leading-tight">
              Average
            </p>
            <p className="mt-0.5 sm:mt-2 text-lg sm:text-2xl font-semibold sm:font-bold text-slate-900">
              {averageRating.toFixed(1)}
            </p>
          </div>
          <div className="rounded-lg sm:rounded-2xl bg-slate-50 p-2 sm:p-4">
            <p className="text-[8px] sm:text-xs font-medium sm:font-semibold uppercase tracking-wider sm:tracking-[0.2em] text-slate-500 leading-tight">
              Reviews
            </p>
            <p className="mt-0.5 sm:mt-2 text-lg sm:text-2xl font-semibold sm:font-bold text-slate-900">{totalReviews}</p>
          </div>
          <div className="rounded-lg sm:rounded-2xl bg-slate-50 p-2 sm:p-4">
            <p className="text-[8px] sm:text-xs font-medium sm:font-semibold uppercase tracking-wider sm:tracking-[0.2em] text-slate-500 leading-tight">
              Rating
            </p>
            <p className="mt-0.5 sm:mt-2 text-lg sm:text-2xl font-semibold sm:font-bold text-slate-900">
              {averageRating >= 4 ? "High" : averageRating >= 3 ? "Mixed" : "Low"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
