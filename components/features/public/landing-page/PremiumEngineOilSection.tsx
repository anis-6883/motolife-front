import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

import { FlashSale } from "@/components/admin/offers-management/offers/FlashSaleProductForm";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import routes from "@/config/routes";
import Link from "next/link";
import { CountdownCard } from "../shared/CountdownCard";
import PremiumEngineOilRightSideContent from "./PremiumEngineOilRightSideContent";
import { getAllOffersByResource } from "./utils";

export const PremiumEngineOilSection = async () => {
  const response = await getAllOffersByResource("category", { page: 1, limit: 7 });
  const offerData: FlashSale = response?.data?.data ?? {};
  const todayDate = new Date();
  const products = offerData?.items || [];

  if (products.length === 0) return null;
  if (!offerData?._id || new Date(offerData?.endDate) < todayDate) return null;

  return (
    <section className="gap100">
      <div className="flex items-end justify-end pb-3 max-md:flex-col max-md:text-center md:justify-between md:pb-6">
        <h4 className="p-text-36 leading-11 font-bold capitalize">Upgrade Your Ride with Premium Engine Oils</h4>
        <Button variant={"link"} className="text-primary hover:text-primary/80 hover:no-underline" asChild>
          <Link href={routes.publicRoutes.productList}>
            Explore All
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-2 2xl:gap-8">
        {/* <PremiumEngineOilHero offerData={offerData} /> */}
        <div className="relative shrink-0 overflow-hidden rounded-lg max-md:h-120 lg:h-120 lg:w-1/3 xl:w-1/4 2xl:min-h-150 2xl:w-1/5">
          <ImageWithFallback
            src={offerData?.image}
            fallbackSrc="/images/shared/flashSaleBanner.png"
            alt="flash sale image banner"
            fill
            className="object-cover"
          />
          <div className="flex h-full flex-col justify-end">
            <CountdownCard endDate={offerData?.endDate} cardClassName="  p-2" />{" "}
          </div>
        </div>
        {products?.length > 0 && <PremiumEngineOilRightSideContent slug={offerData?.slug} products={products} />}
      </div>
    </section>
  );
};

export function ProductCardHOfferSkeleton() {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-white p-2.5">
      <Skeleton className="relative aspect-132/140 h-35 w-35 shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-auto flex items-baseline gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function PremiumEngineOilSkeleton() {
  return (
    <section className="gap100">
      <div className="flex items-end justify-between pb-3 md:pb-6">
        <Skeleton className="h-10 w-full max-w-lg" />
        <Skeleton className="h-6 w-24 max-md:hidden" />
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-2 2xl:gap-8">
        <Skeleton className="relative shrink-0 rounded-lg max-md:h-120 lg:h-120 lg:w-1/3 xl:w-1/4 2xl:min-h-150 2xl:w-1/5" />
        <div className="flex h-full w-full flex-1 flex-col gap-x-6 gap-y-6 lg:grid lg:grid-cols-2 2xl:gap-x-16">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardHOfferSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
