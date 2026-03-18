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
        "flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border bg-card p-4",
        className,
      )}
    >
      {showImage && <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        {Array.from({ length: descriptionLines }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-3"
            style={{ width: `${70 - i * 15}%` }}
          />
        ))}
      </div>

      {showMeta && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      )}
    </div>
  );
};

export default ListItemSkeleton;
