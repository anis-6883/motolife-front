import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardVerticalSkeleton() {
  return (
    <Card className="group relative max-w-full gap-0 overflow-hidden border bg-white py-0 shadow-none md:h-full">
      {/* Image Area Skeleton */}
      <div className="relative h-20 w-full overflow-hidden bg-gray-100 md:h-70">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      {/* Content Area Skeleton */}
      <div className="relative flex flex-col justify-between space-y-1 bg-white p-1 md:space-y-1.5 md:p-4">
        {/* Seller Info Skeleton */}
        <Skeleton className="h-2 w-1/2 md:h-4" />

        {/* Product Title Skeleton */}
        <div className="space-y-1 py-1">
          <Skeleton className="h-2 w-full md:h-4" />
          <Skeleton className="h-2 w-4/5 md:h-4" />
        </div>

        {/* Price Skeleton */}
        <div className="flex items-baseline gap-2 pt-1 max-md:hidden">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-2 w-16 md:h-4" />
        </div>

        {/* Bottom Actions Skeleton */}
        <div className="flex items-center justify-between md:pt-2">
          <div className="flex w-full justify-end">
            <Skeleton className="h-3 w-10 md:h-10" />
          </div>
        </div>
      </div>
    </Card>
  );
}
