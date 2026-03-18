import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ListItemSkeletonProps {
  showImage?: boolean;
  descriptionLines?: number;
  showMeta?: boolean;
  className?: string;
}

const ListItemSkeleton = ({
  showImage = true,
  descriptionLines = 1,
  showMeta = true,
  className,
}: ListItemSkeletonProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-card px-4 py-3",
        className,
      )}
    >
      {showImage && <Skeleton className="h-12 w-12 shrink-0 rounded-lg sm:h-14 sm:w-14" />}

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-32 sm:w-40" />
        {Array.from({ length: descriptionLines }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-24 sm:w-32" />
        ))}
      </div>

      {showMeta && (
        <div className="ml-auto flex shrink-0 flex-col items-end gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
      )}
    </div>
  );
};

export default ListItemSkeleton;
