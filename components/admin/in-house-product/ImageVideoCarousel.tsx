import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { getYoutubeId } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

type MediaItem = { type: "image" | "video"; src: string };

interface ImageVideoCarouselProps {
  mediaItems: MediaItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ImageVideoCarousel({ mediaItems, activeIndex, onSelect }: ImageVideoCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateState = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());

      const index = api.selectedScrollSnap();
      onSelect(index);
    };

    updateState();
    api.on("select", updateState);

    return () => {
      api.off("select", updateState);
    };
  }, [api, onSelect]);

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          slidesToScroll: 1,
          dragFree: true,
          containScroll: "keepSnaps",
        }}
        className="w-full md:mx-auto md:w-[80%]"
      >
        <CarouselContent className="md:-ml-3">
          {mediaItems.map((item, index) => (
            <CarouselItem key={index} className="basis-2/5 sm:basis-1/4 md:pl-3">
              <Button
                onClick={() => {
                  api?.scrollTo(index);
                  onSelect(index);
                }}
                className={cn(
                  "relative aspect-square h-auto w-full cursor-pointer overflow-hidden rounded-md border bg-gray-100 p-0 transition-all hover:bg-transparent hover:opacity-100",
                  activeIndex === index ? "border-primary" : "border-transparent hover:border-gray-300"
                )}
              >
                {item.type === "video" ? (
                  <>
                    <ImageWithFallback
                      fallbackSrc="/images/auth/logo.png"
                      src={`https://img.youtube.com/vi/${getYoutubeId(item.src)}/hqdefault.jpg`}
                      alt="Video thumbnail"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play className="size-6 text-white" />
                    </div>
                  </>
                ) : (
                  <ImageWithFallback
                    fallbackSrc="/images/auth/logo.png"
                    src={item.src}
                    alt="Product thumbnail"
                    fill
                    className="object-cover"
                  />
                )}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Controls */}
        <div className="absolute inset-y-0 -left-8 hidden items-center md:flex">
          <button
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            className="text-primary h-8 w-8 rounded-lg disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous thumbnails"
          >
            <ChevronLeft className="mx-auto size-6" />
          </button>
        </div>

        <div className="absolute inset-y-0 -right-8 flex items-center max-md:hidden">
          <button
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            className="text-primary h-8 w-8 rounded-lg disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next thumbnails"
          >
            <ChevronRight className="mx-auto size-6" />
          </button>
        </div>
      </Carousel>
    </div>
  );
}
