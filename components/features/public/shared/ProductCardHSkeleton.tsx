import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardHSkeleton() {
  return (
    <Card className="group relative grid h-full cursor-pointer overflow-hidden rounded-lg border-0 bg-transparent p-0 transition-shadow">
      <div className="relative flex items-center">
        {/* Left: Image Skeleton */}
        <div className="bg-dark-gray relative aspect-132/140 max-h-35 min-h-35 overflow-hidden rounded-lg xl:h-40 xl:max-h-full xl:w-40">
          <Skeleton className="h-full w-full rounded-none" />
        </div>

        {/* Right: Content Skeleton */}
        <div className="flex flex-1 flex-col justify-between space-y-2 bg-white p-2.5">
          {/* Badge Skeleton */}
          <Skeleton className="h-6 w-24 rounded-full" />

          {/* Title Skeleton */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Rating + Brand Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Price Skeleton */}
          <div className="flex items-baseline gap-2 pt-1">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      </div>
    </Card>
  );
}
