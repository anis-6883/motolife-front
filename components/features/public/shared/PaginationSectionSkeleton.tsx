import { Skeleton } from "@/components/ui/skeleton";

export function PaginationSectionSkeleton({ hideleftPortion }: { hideleftPortion?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-between py-1 sm:flex-row md:gap-2 md:border-t md:py-4">
      {/* Items count skeleton */}
      <Skeleton className={`w-32 max-md:order-last md:h-4 md:h-5 md:w-48 ${hideleftPortion ? "hidden" : ""}`} />

      {/* Pagination Controls Skeleton */}
      <div className={`mt-2 flex items-center gap-2 sm:mt-0 ${hideleftPortion ? "w-full flex-1 justify-between lg:gap-3" : ""}`}>
        {/* Previous Button Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 md:h-5 md:w-5" />
          <Skeleton className="hidden h-5 w-16 lg:block" />
        </div>

        {/* Pages Skeleton */}
        <div className="flex gap-1 md:gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="size-6 rounded-none p-0 max-md:text-[10px] md:size-10" />
          ))}
        </div>

        {/* Next Button Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="hidden h-5 w-12 lg:block" />
          <Skeleton className="h-4 w-4 md:h-5 md:w-5" />
        </div>
      </div>
    </div>
  );
}
