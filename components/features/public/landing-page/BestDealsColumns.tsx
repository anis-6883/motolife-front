"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { IProductPublic } from "@/lib/types";
import ProductCardH from "../shared/ProductCardH";
export function BestDealsLeftColumn({ products }: { products: IProductPublic[] }) {
  const isTablet = useMediaQuery(820);
  return (
    <>
      {isTablet ? (
        <></>
      ) : (
        <div className="flex-1">
          <div className="flex h-full flex-col justify-between">
            {products.slice(0, 3).map((product, index) => (
              <ProductCardH product={product} key={index} dir="rtl" />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function BestDealsRightColumn({ products }: { products: IProductPublic[] }) {
  // const isTablet = useMediaQuery(820);

  // const groupedProducts = chunkProducts(products, 6);
  return (
    <>
      {/* {isTablet ? (
        <Carousel
          opts={{
            align: "start",
            containScroll: "trimSnaps",
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0 md:-ml-4">
            {groupedProducts.map((group, index) => (
              <CarouselItem key={index} className="pl-1 md:pl-4">
                <div className="grid grid-cols-3 gap-2">
                  {group.map((product: any) => (
                    <ProductCardH key={product._id} product={product} isComboProduct MobileGridVal={3} />
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : ( */}

      <div className="flex-1">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 md:pt-5 lg:hidden">
          {products.slice(0, 8).map((product, index) => (
            <ProductCardH product={product} key={index} />
          ))}
        </div>
        <div className="flex h-full flex-col justify-between max-lg:hidden">
          {products.slice(3, 6).map((product, index) => (
            <ProductCardH product={product} key={index} />
          ))}
        </div>
      </div>
      {/* )} */}
    </>
  );
}
