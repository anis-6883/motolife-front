import { Skeleton } from "@/components/ui/skeleton";

const DetailPageSkeleton = () => {
  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Title */}
      <Skeleton className="h-8 w-1/3" />

      {/* Card */}
      <div className="space-y-4 rounded-lg border p-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Image section */}
      <Skeleton className="h-64 w-full rounded-lg" />

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default DetailPageSkeleton;
