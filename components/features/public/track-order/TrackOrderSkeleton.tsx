import { Skeleton } from "@/components/ui/skeleton";

export const TrackOrderSkeleton = () => {
  return (
    <div className="animate-pulse pt-5 md:py-10 xl:py-20">
      {/* Stats Section Skeleton */}
      <div className="grid grid-cols-2 gap-y-4 rounded-lg border border-black/50 py-2 md:py-3 lg:grid-cols-5 2xl:py-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center last:max-lg:col-span-2 ${
              i % 2 === 0 ? "max-md:border-r" : ""
            } ${i !== 4 ? "md:border-r" : ""}`}
          >
            <Skeleton className="mb-2 h-4 w-20 opacity-60" />
            <Skeleton className="h-6 w-24 opacity-80" />
          </div>
        ))}
      </div>

      {/* Status Skeleton */}
      <div className="pt-6 pb-10">
        <div className="mb-8">
          <Skeleton className="mb-2 h-6 w-48" />
        </div>
        <div className="flex items-start justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-1 flex-col items-center">
              <div className="relative flex w-full items-center justify-center">
                {/* Connecting lines */}
                {i !== 4 && <div className="absolute top-1/2 left-1/2 z-0 h-px w-1/2 border-b-2 border-dashed border-gray-200" />}
                {i !== 0 && <div className="absolute top-1/2 -left-1 z-0 h-px w-1/2 border-b-2 border-dashed border-gray-200" />}
                <div className="relative z-10 p-2 md:p-5">
                  <Skeleton className="size-5 rounded-full md:size-9 lg:size-12" />
                </div>
              </div>
              <div className="mt-2 flex flex-col items-center space-y-2">
                <Skeleton className="h-4 w-16 md:w-24" />
                <Skeleton className="h-3 w-12 md:w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 gap-6 pb-10 xl:grid-cols-[1fr_400px] xl:gap-8">
        {/* Product List Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-40" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-lg border border-black/10 p-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-4">
                <Skeleton className="size-20 rounded-md md:size-24" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card Skeleton */}
        <div className="space-y-4">
          <div className="space-y-6 rounded-lg border border-black/10 p-6">
            <Skeleton className="h-7 w-32" />
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between border-t border-black/10 pt-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
