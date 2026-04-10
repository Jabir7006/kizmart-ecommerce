import { MessageSquare } from "lucide-react";
import { Rating } from "react-simple-star-rating";
import type { Product } from "@/types/productType";

const ReviewSummary = ({ product }: { product: Product }) => {
  const averageRating = product.ratings ?? 0;
  const totalReviews = product.numReviews ?? 0;

  return (
    <div className="grid gap-5 rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-sm md:grid-cols-[220px_1fr] md:p-8">
      <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-orange-100">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          Customer Rating
        </p>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-5xl font-bold tracking-tight text-slate-900">
            {averageRating.toFixed(1)}
          </span>
          <span className="pb-1 text-sm font-medium text-slate-500">/ 5</span>
        </div>
        <div className="mt-3">
          <Rating
            initialValue={averageRating}
            readonly
            allowFraction
            size={24}
            SVGclassName="inline-block"
            fillColor="#f59e0b"
            emptyColor="#e5e7eb"
          />
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-dashed border-orange-200 bg-white/70 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Real buyer feedback</h3>
            <p className="text-sm text-slate-600">
              Ratings are updated automatically as customers share their experience.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Average
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {averageRating.toFixed(1)}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Total Reviews
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalReviews}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Recommendation
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {averageRating >= 4 ? "High" : averageRating >= 3 ? "Mixed" : "Low"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
