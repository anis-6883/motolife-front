"use client";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IFlashSaleItem } from "@/lib/types";
import ProductCardHOffer from "../shared/ProductCardHOffer";
import TwoItemCarousel from "../shared/TwoItemCarousel";

export default function PremiumEngineOilRightSideContent({ products, slug }: { products: IFlashSaleItem[]; slug: string }) {
  const isTablet = useMediaQuery(820);
  return (
    <>
      {isTablet ? (
        <TwoItemCarousel
          items={products.slice(0, 6).map((product, index) => (
            <ProductCardHOffer key={index} product={product} slug={slug} />
          ))}
        />
      ) : (
        <div className="flex h-full w-full flex-1 flex-col gap-x-6 gap-y-6 lg:grid lg:auto-rows-fr lg:grid-cols-2 2xl:gap-x-16">
          {products.slice(0, 6).map((product, index) => (
            <div key={index} className="h-full">
              <ProductCardHOffer product={product} slug={slug} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
