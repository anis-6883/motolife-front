"use client";

import { CarouselApi } from "@/components/ui/carousel";
import useMediaQuery from "@/hooks/useMediaQuery";
import { chunkProducts } from "@/lib/client-utils";
import { IProductPublic } from "@/lib/types";
import { useEffect, useState } from "react";
import { ProductCardVertical } from "../shared/ProductCardVertical";

export default function ProductGrid({ products }: { products: IProductPublic[] }) {
  const [api, setApi] = useState<CarouselApi>();
  // useEffect(() => {
  //   if (!api) return;

  //   const interval = setInterval(() => {
  //     api.scrollNext();
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [api]);
  useEffect(() => {
    const endTime = new Date("2023-12-31T23:59:59").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isTablet = useMediaQuery(820);

  const groupedProducts = chunkProducts(products, 6);
  const isAvgLaptop = useMediaQuery(1280);

  return (
    <>
      {/* {isTablet ? (
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            // loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0 md:-ml-4">
            {products.map((product) => (
              <CarouselItem key={product._id} className="basis-1/3 pl-1 md:basis-3/8 md:pl-5">
                <ProductCardVertical product={product} MobileGridVal={3} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : ( */}
      {/* {isTablet ? (
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0 md:-ml-4">
            {groupedProducts.map((group, index) => (
              <CarouselItem key={index} className="pl-1 md:pl-4">
                <div className="grid grid-cols-3 gap-2">
                  {group.map((product) => (
                    <ProductCardVertical key={product._id} product={product} MobileGridVal={3} />
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : ( */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-3 xl:grid-cols-5">
        {products.slice(0, isAvgLaptop ? 8 : 10).map((product) => (
          <ProductCardVertical product={product} key={product._id} />
        ))}
      </div>
      {/* )} */}
    </>
  );
}
