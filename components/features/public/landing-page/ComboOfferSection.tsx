"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { allRoutes } from "@/config/constant";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import ProductCardH from "../shared/ProductCardH";
import SanitizedContent from "../shared/sanitizeContent";
import { LoadMoreButton } from "./LoadMoreButton";

const ComboOfferSection = ({ comboBannerData, comboProducts }: { comboBannerData: any; comboProducts: any }) => {
  // const isTablet = useMediaQuery(820);
  const isExternal = /^https?:\/\//.test(comboBannerData?.url);
  // if (!comboBannerData?.image) return null;

  const products = comboProducts?.docs ?? [];

  const desktopProducts = products.slice(0, 8);
  // const mobileProducts = products.slice(0, 6);

  // if (products.length === 0 || !comboBannerData) return null;
  // const groupedProducts = chunkProducts(products, 6);
  return (
    <section className="gap100 flex max-xl:flex-col md:gap-5">
      <div className="order-first flex justify-between md:hidden">
        <h2 className="p-text-36 mb-2 font-bold capitalize md:leading-11">Combo Offers</h2>
      </div>
      {products.length > 0 && (
        <>
          {/* {isTablet ? (
            <Carousel
              opts={{
                align: "start",
                containScroll: "trimSnaps",
              }}
              className="w-full max-xl:order-last"
            >
              <CarouselContent className="ml-0 md:-ml-4">
                {groupedProducts.map((group, index) => (
                  <CarouselItem key={index} className="pl-1">
                    <div className="grid grid-cols-3 gap-x-2 gap-y-3">
                      {group.map((product: any) => (
                        <ProductCardH key={product._id} product={product} isComboProduct MobileGridVal={3} />
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : ( */}
          <div className="grid h-max flex-1 grid-cols-2 gap-5 md:gap-x-7.5 md:gap-y-6">
            {desktopProducts.map((product: any) => (
              <ProductCardH key={product._id} product={product} isComboProduct />
            ))}
          </div>

          {/* )} */}
        </>
      )}
      <div className="relative h-max w-full max-w-full overflow-hidden rounded-2xl border bg-[#EEF2F3] p-7.5 max-lg:order-first max-md:hidden md:aspect-403/699 md:h-100 xl:h-max xl:max-w-100">
        {isExternal ? (
          <a href={comboBannerData?.url} target="_blank" rel="noopener noreferrer">
            <ImageWithFallback
              fallbackSrc="/images/shared/combo.png"
              fill
              src={comboBannerData?.image}
              alt="Combo offer banner"
              className="relative z-0 md:object-cover"
            />
          </a>
        ) : (
          <Link href={comboBannerData?.url || allRoutes.comboOffers}>
            <ImageWithFallback
              fallbackSrc="/images/shared/combo.png"
              fill
              src={comboBannerData?.image}
              alt="Combo offer banner"
              className="relative z-0 object-contain md:object-cover"
            />
          </Link>
        )}

        <div className="relative z-10 space-y-4">
          {comboBannerData?.title ? (
            <SanitizedContent
              className="p-text-36 leading-6 font-bold tracking-[0.72px] text-black md:leading-8 lg:leading-12"
              htmlString={comboBannerData?.title as string}
            />
          ) : (
            <h3 className="p-text-36 leading-6 font-bold tracking-[0.72px] text-black md:leading-8 lg:leading-12">
              <span className="text-primary">COMBO OFFER!</span>
              on Every Rider’s Favorite Gear
            </h3>
          )}

          {comboBannerData?.description ? (
            <SanitizedContent
              className="p-text-16 text-dark-gray pb-5 leading-6 md:max-w-69 md:pb-8 lg:pb-10"
              htmlString={comboBannerData?.description as string}
            />
          ) : (
            <p className="p-text-16 text-dark-gray pb-5 leading-6 md:max-w-69 md:pb-8 lg:pb-10">
              Big savings on bundled helmets, gloves, oils & accessories.
            </p>
          )}

          {isExternal ? (
            <a href={comboBannerData?.url} target="_blank" rel="noopener noreferrer">
              <Button className="text-primary hover:border-primary rounded-lg border bg-white capitalize hover:bg-white">
                shop now <ArrowUpRight />
              </Button>
            </a>
          ) : (
            <Link href={comboBannerData?.url || allRoutes.comboOffers}>
              <Button className="text-primary hover:border-primary rounded-lg border bg-white capitalize hover:bg-white">
                shop now <ArrowUpRight />
              </Button>
            </Link>
          )}
        </div>
      </div>
      <LoadMoreButton url={allRoutes.comboOffers} willBeHidden={products.length < 8} extraClassName="md:hidden pt-4" />
    </section>
  );
};

export default ComboOfferSection;
