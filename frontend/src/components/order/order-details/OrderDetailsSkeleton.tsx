import { Skeleton } from "@/components/ui/skeleton";

const OrderDetailsSkeleton = () => (
  <div className="mx-auto max-w-5xl px-4 py-8">
    <Skeleton className="h-8 w-64 mb-2" />
    <Skeleton className="h-5 w-48 mb-8" />
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export default OrderDetailsSkeleton;
