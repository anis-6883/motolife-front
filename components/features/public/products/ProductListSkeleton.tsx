import { ProductListVariant } from "@/lib/types";
import { PaginationSectionSkeleton } from "../shared/PaginationSectionSkeleton";
import { ProductCardVerticalSkeleton } from "../shared/ProductCardVerticalSkeleton";

export default function ProductListSkeleton({ variant = "products" }: { variant?: ProductListVariant }) {
  const items = Array.from({ length: 12 }, (_, i) => i);

  return (
    <>
      {variant === "seller-profile" ? (
        <div className="grid-cols-2 gap-4 space-y-4 pt-4 md:grid md:pt-6 lg:pt-7.5 xl:grid-cols-3">
          {items.map((i) => (
            <ProductCardVerticalSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 pt-4 md:grid-cols-3 md:gap-4 md:pt-6 lg:pt-7.5 2xl:grid-cols-4">
          {items.map((i) => (
            <ProductCardVerticalSkeleton key={i} />
          ))}
        </div>
      )}
      {/* Pagination Section Skeleton */}
      <div className="pt-4 md:pt-16 lg:pt-20">
        <PaginationSectionSkeleton />
      </div>
    </>
  );
}
