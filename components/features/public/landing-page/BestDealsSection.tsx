import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { allRoutes, RESOURCE_TYPE } from "@/config/constant";
import { IProductPublic } from "@/lib/types";
import Link from "next/link";
import { ProductCardHSkeleton } from "../shared/ProductCardHSkeleton";
import { BestDealsLeftColumn, BestDealsRightColumn } from "./BestDealsColumns";
import { LoadMoreButton } from "./LoadMoreButton";
import { getAllOffersByResource } from "./utils";

export async function BestDealsSection() {
  const response = await getAllOffersByResource(RESOURCE_TYPE.TODAYS_DEAL, { page: 1, limit: 6 });
  const products: IProductPublic[] = response?.data?.data?.items || [];

  if (products.length === 0) {
    return null;
  }
  return (
    <section className="gap100 relative flex gap-x-5 max-lg:flex-col lg:flex-wrap xl:flex-auto">
      <div className="flex justify-between">
        <p className="p-text-36 pb-2 font-bold uppercase md:hidden md:pb-6 md:leading-11">
          {response?.data?.data?.title ?? "Today’s Best Deals Begin at 500 BDT"}
        </p>
        {/* {products.length > 4 ? (
          <Link
            href={`${allRoutes.products}/best-deals/${response?.data?.data?.slug}`}
            className="text-primary text-xs underline md:hidden"
          >
            View All
          </Link>
        ) : null} */}
      </div>
      <BestDealsLeftColumn products={products} />
      <Link
        href={`${allRoutes.products}/best-deals/${response?.data?.data?.slug}`}
        className="relative aspect-453/522 h-max w-full overflow-hidden rounded-2xl bg-black text-white max-xl:order-first max-md:hidden md:max-h-60 lg:aspect-video lg:w-screen xl:aspect-square xl:size-130 xl:max-h-full xl:w-full xl:max-w-114 xl:min-w-[40%]"
      >
        <div className="relative z-30 max-w-sm pt-7.5 pl-10">
          <h4 className="p-text-36 leading-6 font-bold -tracking-[0.72px] md:leading-12">
            {response?.data?.data?.title ?? "Today’s Best Deals Begin at 500 BDT"}
          </h4>
          <p className="p-text-16 text-light-gray leading-5.5">
            {response?.data?.data?.description ?? "Grab premium bike accessories at budget-friendly prices"}
          </p>
        </div>
        <div className="absolute inset-0 z-20 bg-black/50 lg:hidden" />
        <div className="absolute inset-0 size-full">
          <ImageWithFallback
            fallbackSrc="/images/carousel/carousel4.png"
            className="relative z-10 object-contain md:object-cover"
            src={response?.data?.data?.image}
            alt="Best Deals"
            fill
            style={{
              objectPosition: "bottom right",
            }}
          />
        </div>
      </Link>

      <BestDealsRightColumn products={products} />
      <LoadMoreButton
        url={`${allRoutes.products}/best-deals/${response?.data?.data?.slug}`}
        willBeHidden={products.length < 8}
        extraClassName="md:hidden pt-4"
      />
    </section>
  );
}

export function BestDealsSkeleton() {
  return (
    <section className="gap100 flex gap-x-5 gap-y-6 max-lg:flex-col lg:flex-wrap xl:flex-auto">
      {/* Left Column */}
      <div className="flex h-fit flex-1 flex-col gap-y-6 max-md:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProductCardHSkeleton key={i} />
        ))}
      </div>

      {/* Middle Banner */}
      <div className="relative aspect-453/522 h-max w-full overflow-hidden rounded-2xl bg-gray-100 max-xl:order-first md:max-h-60 lg:aspect-video lg:w-screen xl:aspect-453/522 xl:max-h-full xl:w-full xl:max-w-114">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Right Column */}
      <div className="flex h-fit flex-1 flex-col gap-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProductCardHSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
