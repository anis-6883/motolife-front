"use client";

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ReactNode, useState } from "react";

interface TwoItemCarouselProps {
  items: ReactNode[];
  className?: string;
  autoplayDelay?: number; // optional
}

export default function TwoItemCarousel({ items, className = "", autoplayDelay = 4000 }: TwoItemCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  // group items into pairs
  // const slides: ReactNode[][] = [];
  // // for (let i = 0; i < items.length; i += 2) {
  // //   slides.push(items.slice(i, i + 2));
  // // }

  /* ---------- Autoplay ---------- */
  // useEffect(() => {
  //   if (!api) return;

  //   const interval = setInterval(() => {
  //     api.scrollNext();
  //   }, autoplayDelay);

  //   return () => clearInterval(interval);
  // }, [api, autoplayDelay]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        // loop: true,
      }}
      className={`w-full ${className}`}
    >
      <CarouselContent className="ml-0 md:-ml-4">
        {items.map((item, index) => (
          <CarouselItem key={index} className="basis-1/3 pl-1 md:pl-4">
            <div className="flex h-full flex-col gap-4">{item}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
