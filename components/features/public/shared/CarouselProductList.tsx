"use client";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import useMediaQuery from "@/hooks/useMediaQuery";
import { chunkProducts } from "@/lib/client-utils";
import { IProductPublic } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LoadMoreButton } from "../landing-page/LoadMoreButton";
import { ProductCardVertical } from "./ProductCardVertical";

type CarouselProductListProps = {
  title: string;
  products: IProductPublic[];
  viewAllURL?: string;
};

export function CarouselProductListSection({ title, products, viewAllURL }: CarouselProductListProps) {
  const [api, setApi] = useState<CarouselApi>();

  // useEffect(() => {
  //   if (!api) return;

  //   const interval = setInterval(() => {
  //     api.scrollNext();
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [api]);

  const isMobile = useMediaQuery(768);
  const groupedProducts = chunkProducts(products, 6);
  if (products.length === 0) return null;
  return (
    <section className="gap100 bg-white">
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-2 2xl:gap-8">
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="p-text-36 pb-2 font-bold capitalize md:pb-6 md:leading-11">{title}</p>
              <div className={cn("flex justify-end gap-3 max-md:hidden", products.length < 5 ? "hidden" : "")}>
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
              {/* {products.length > 4 ? (
                <Link href={`${viewAllURL}`} className="text-primary text-xs underline md:hidden">
                  View All
                </Link>
              ) : null} */}
            </div>
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                // loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="ml-0 md:-ml-4">
                {isMobile
                  ? null
                  : products.map((product, index) => (
                      <CarouselItem key={index} className="lg:1/3 basis-1/3 pl-1 md:basis-3/8 md:pl-5 xl:basis-1/4 2xl:basis-1/5">
                        <ProductCardVertical MobileGridVal={3} product={product as any} />
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <div className="grid grid-cols-2 gap-5 md:hidden">
                {products && products?.length > 0 ? (
                  products?.map((product, index) => <ProductCardVertical key={index} product={product as any} />)
                ) : (
                  <p>No products available</p>
                )}
              </div>
              {/* <CarouselContent className="ml-0 md:-ml-4">
                {products.map((product, index) => (
                  <CarouselItem key={index} className="lg:1/3 basis-1/3 pl-1 md:basis-3/8 md:pl-5 xl:basis-1/4 2xl:basis-1/5">
                    <ProductCardVertical MobileGridVal={3} product={product as any} />
                  </CarouselItem>
                ))}
              </CarouselContent> */}
            </Carousel>
            {viewAllURL ? <LoadMoreButton url={viewAllURL} willBeHidden={products.length < 5} extraClassName="md:hidden pt-4" /> : null}
            {products.length > 4 ? (
              <div className="flex justify-center pt-2 max-md:hidden md:pt-6">
                <Button
                  className={`hover:border-primary h-8 rounded-md border border-black bg-white px-8 font-semibold text-black uppercase transition-colors duration-500 hover:bg-black hover:text-white md:h-10`}
                  asChild
                >
                  <Link href={`${viewAllURL}`}>
                    Explore More <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
