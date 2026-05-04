"use client";

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import CategoryCard from "../shared/CategoryCard";

const CategoriesSection = ({ categories = [] }: { categories: ProductCategory[] }) => {
  const [api, setApi] = useState<CarouselApi>();

  // useEffect(() => {
  //   if (!api) return;

  //   const interval = setInterval(() => {
  //     api.scrollNext();
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [api]);

  if (categories.length === 0) return null;

  return (
    <section className="relative overflow-hidden pt-3 md:pt-6">
      <h2 className="p-text-36 mb-2 font-bold capitalize md:leading-11">Categories</h2>
      <Carousel
        setApi={setApi}
        opts={{
          // loop: true,
          align: "start",
          // slidesToScroll: 1,
          // containScroll: "trimSnaps",
          // skipSnaps: false,
        }}
      >
        <CarouselContent className="gap-1 max-md:ml-0 md:gap-6 md:py-3">
          {categories?.map((category, index) => (
            <CarouselItem key={index} className={cn("basis-[30%] pl-0 first:pl-2 first:md:pl-6 lg:basis-[20%] 2xl:basis-[15%]", {})}>
              <Link href={`/product-list?category=${category.name}`}>
                <CategoryCard category={category} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default CategoriesSection;
