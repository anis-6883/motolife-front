"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ---------------- Types ---------------- */
// const slides = [
//   {
//     id: 1,
//     image: "/images/carousel/carousel1.png",
//     title: "Your Marketplace for Motorcycle Gear & Essentials",
//     description: "Shop helmets, riding wear, engine oils, accessories from trusted vendors across the country.",
//     bgColor: "#B21619",
//   },
//   {
//     id: 2,
//     image: "/images/carousel/carousel2.png",
//     title: "Your Marketplace for Motorcycle Gear & Essentials",
//     description: "Shop helmets, riding wear, engine oils, accessories from trusted vendors across the country.",
//     bgColor: "#565553",
//   },
//   {
//     id: 3,
//     image: "/images/carousel/carousel3.png",
//     title: "COMBO OFFER! on Every Rider’s Favorite Gear",
//     description: "Big savings on bundled helmets, gloves, oils & accessories.",
//     bgColor: "#EEF2F3",
//   },
//   {
//     id: 4,
//     image: "/images/carousel/carousel4.png",
//     title: "Today’s Best Deals Begin at 500 BDT",
//     description: "Grab premium bike accessories at budget-friendly prices",
//     bgColor: "#1A1A1A",
//   },
// ];

export type HeroAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  buttonProps?: any;
};

export type HeroSlide = {
  _id: string;
  image: string;
  title: string;
  description: string;
  bannerUrl?: string;
  actions?: HeroAction[];
  bgColor?: string;
};

export interface HeroCarouselProps {
  slides?: HeroSlide[];
  autoplayDelay?: number;
  height?: {
    base: string;
    md?: string;
    lg?: string;
  };
  overlayOpacity?: number;
}

export function HeroCarouselSection({
  slides,
  autoplayDelay = 5000,
  height = {
    base: "h-[600px]",
    md: "md:h-[450px]",
    lg: "lg:h-[480px]",
  },
}: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /* Sync slide index */
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const startAutoplay = () => {
    stopAutoplay();
    intervalRef.current = setInterval(() => api?.scrollNext(), autoplayDelay);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [api, autoplayDelay]);

  if (slides?.length === 0) return null;

  return (
    <section className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        className="overflow-hidden rounded-lg"
      >
        <CarouselContent>
          {slides?.map((slide, index) => (
            <CarouselItem
              key={slide._id}
              className={`relative aspect-10/3 overflow-hidden bg-cover bg-no-repeat p-2 md:aspect-1400/450 md:bg-cover md:p-8 lg:p-10 2xl:p-12`}
              // style={{ backgroundColor: slide?.bgColor, backgroundImage: `url(${slide.image})` }}
            >
              <Link href={slide?.bannerUrl || "#"}>
                <div className="absolute inset-0 z-0 size-full">
                  <ImageWithFallback
                    fallbackSrc="/images/carousel/carousel1.png"
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              {/* Content */}
              {/* <div className="relative z-10 flex h-full items-center">
                <div key={current} className="animate-in fade-in slide-in-from-right-2 max-w-lg duration-300 max-md:p-10">
                  <h2
                    className={`overflow-hidden text-base font-bold text-white max-md:line-clamp-1 md:mb-4 md:text-3xl lg:mb-7 lg:text-4xl lg:leading-14 xl:text-5xl`}
                  >
                    {slide.title}
                  </h2>

                  <p className={`overflow-hidden text-xs text-white/90 max-md:line-clamp-2 md:mb-5 md:text-lg lg:mb-10`}>
                    {slide.description}
                  </p>

                  <Button
                    size="sm"
                    className={`hover:border-primary mt-2 rounded-md border border-white bg-white px-8 font-semibold text-black uppercase hover:bg-white hover:text-black max-md:h-6 md:hidden`}
                    asChild
                  >
                    <Link href={slide?.url || "#"}>
                      shop now <ArrowUpRight />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    className={`hover:border-primary rounded-md border border-white bg-white px-8 font-semibold text-black uppercase hover:bg-white hover:text-black max-md:hidden`}
                    asChild
                  >
                    <Link href={slide?.url || "#"}>
                      shop now <ArrowUpRight />
                    </Link>
                  </Button>
                </div>
              </div> */}

              <div className="hidden" style={{ opacity: 0.8, background: slide.bgColor }} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-8 left-5 flex items-center gap-2 max-lg:hidden md:left-8 lg:left-10 2xl:left-12">
          {slides?.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`rounded-full transition-all ${index === current ? "size-2.5 bg-white" : "size-2 bg-white/50 hover:bg-white/75"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}
