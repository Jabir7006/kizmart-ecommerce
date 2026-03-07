import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white border border-gray-50">
      <Skeleton className="relative aspect-square w-full rounded-none" />
      <div className="p-2">
        <div className="min-h-[2.5em] flex flex-col justify-center gap-1.5 mt-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
