"use client";

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState } from "react";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { allRoutes } from "@/config/constant";
import { IFlashSale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CountdownCard } from "../shared/CountdownCard";
import { ProductCardVertical } from "../shared/ProductCardVertical";
import { LoadMoreButton } from "./LoadMoreButton";

export function FlashSaleSection({ flashSaleData }: { flashSaleData: IFlashSale }) {
  const [api, setApi] = useState<CarouselApi>();
  // useEffect(() => {
  //   if (!api) return;

  //   const interval = setInterval(() => {
  //     api.scrollNext();
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [api]);

  if (!flashSaleData?.items || flashSaleData?.items?.length === 0) {
    return null;
  }
  return (
    <section className="gap100 bg-white">
      <div className="">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-2 2xl:gap-8">
          <Link
            href={`${allRoutes.products}/offers/${flashSaleData?.slug}`}
            className="relative shrink-0 overflow-hidden rounded-lg max-md:hidden lg:w-1/3 xl:w-1/4 2xl:w-1/5"
          >
            <ImageWithFallback
              src={flashSaleData?.image}
              fallbackSrc="/images/shared/flashSaleBanner.png"
              alt="flash sale image banner"
              fill
              className="object-cover"
            />
            <div className="flex h-full flex-col justify-end pb-6">
              <CountdownCard
                endDate={flashSaleData?.endDate}
                // initialTime={{ days: 10, hours: 8, minutes: 46, seconds: 46 }}
                cardClassName="  p-2"
              />{" "}
            </div>
          </Link>

          {/* Right - Product Carousel */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-start justify-between">
              <h2 className="p-text-36 font-bold capitalize md:pb-6 md:leading-11">{flashSaleData.title ?? "flash sale"}</h2>
              <CountdownCard
                endDate={flashSaleData?.endDate}
                // initialTime={{ days: 10, hours: 8, minutes: 46, seconds: 46 }}
                cardClassName="p-3 bg-transparent shadow-none border border-primary rounded-sm mb-2"
                className="md:hidden"
              />
              <div className={cn("flex justify-end gap-3 max-md:hidden", flashSaleData?.items?.length < 5 ? "hidden" : "")}>
                <button
                  onClick={() => api?.scrollPrev()}
                  className="bg-light-gray/10 hover:border-primary rounded-full border p-3 text-black shadow transition-colors duration-500 hover:bg-black hover:text-white"
                  aria-label="Previous"
                >
                  <ArrowLeft className="size-5" />
                </button>

                <button
                  onClick={() => api?.scrollNext()}
                  className="bg-light-gray/10 hover:border-primary rounded-full border p-3 text-black shadow transition-colors duration-500 hover:bg-black hover:text-white"
                  aria-label="Next"
                >
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>
            <div className="max-md:hidden">
              {flashSaleData?.items && flashSaleData?.items?.length > 0 ? (
                <Carousel
                  setApi={setApi}
                  opts={{
                    align: "start",
                    // loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="ml-0 gap-1 md:gap-2">
                    {flashSaleData?.items?.map((product, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-1/2 pl-0 first:pl-1 md:basis-3/5 md:pl-5 first:md:pl-0 lg:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
                      >
                        <ProductCardVertical MobileGridVal={2} product={product as any} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              ) : (
                <p>No products available</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-5 md:hidden">
              {flashSaleData?.items && flashSaleData?.items?.length > 0 ? (
                flashSaleData?.items?.map((product, index) => (
                  <ProductCardVertical key={index} MobileGridVal={2} product={product as any} />
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
          <LoadMoreButton url={`${allRoutes.products}/offers/${flashSaleData?.slug}`} willBeHidden={flashSaleData?.items?.length < 8} />
        </div>
      </div>
    </section>
  );
}
