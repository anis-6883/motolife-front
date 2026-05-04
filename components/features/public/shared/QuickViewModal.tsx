"use client";

import { getComboProductBySlug, getProductBySlug } from "@/actions/landing/product-action";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getYoutubeId } from "../../../../lib/helpers";
import { ProductGallery } from "../product-detail/ProductGallery";
import { ProductDetailObj } from "../product-detail/schemas";

import { Skeleton } from "@/components/ui/skeleton";
import { ProductInfoQ } from "../product-detail/ProductInfoQ";

interface ProductQuickViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product_slug: string;
}

type MediaItem =
  | { type: "video"; src: string; thumbnail?: string; title?: string }
  | { type: "image"; src: string; thumbnail?: string; title?: string };

interface ProductThumbnailCarouselProps {
  mediaItems: MediaItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

interface ProductQuickViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product_slug: string;
  isComboProduct?: boolean;
}

export function ProductQuickView({ open, onOpenChange, product_slug, isComboProduct = false }: ProductQuickViewProps) {
  const [product, setProduct] = useState<ProductDetailObj>();
  const [loading, setLoading] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  useEffect(() => {
    if (!open) return; // Only fetch when modal opens

    const getProductDetails = isComboProduct ? getComboProductBySlug : getProductBySlug;

    const fetchProductData = async () => {
      setLoading(true);
      const {
        data: { data: product },
      } = await getProductDetails(product_slug);
      setProduct(product);
      setLoading(false);
    };
    fetchProductData();
  }, [product_slug, open, isComboProduct]);
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl [&>button]:hidden">
          <DialogTitle className="sr-only">{product?.name}</DialogTitle>
          {loading ? (
            <div className="grid gap-7 lg:grid-cols-[1fr_1.3fr]">
              {/* Image */}
              <Skeleton className="h-[360px] w-full rounded-xl" />

              {/* Right Content */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </div>
          ) : product ? (
            <div className="grid md:gap-7 lg:grid-cols-[1fr_1.3fr]">
              <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 z-10 rounded-full bg-white p-2 shadow-lg">
                <X className="size-6" />
              </button>
              <ProductGallery activeIndex={activeMediaIndex} onChange={setActiveMediaIndex} product={product} />
              <ProductInfoQ
                modalCloser={onOpenChange}
                product={product}
                isComboProduct={isComboProduct}
                selectedColorIndex={selectedColorIndex}
                setSelectedColorIndex={setSelectedColorIndex}
                setActiveMediaIndex={setActiveMediaIndex}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
export function ProductThumbnailCarousel({ mediaItems, activeIndex, onSelect }: ProductThumbnailCarouselProps) {
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
  useEffect(() => {
    if (!api) return;

    const current = api.selectedScrollSnap();

    // only scroll if different (prevents loop)
    if (current !== activeIndex) {
      api.scrollTo(activeIndex);
    }
  }, [activeIndex, api]);
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
            <CarouselItem key={index} className="basis-1/5 sm:basis-1/4 md:pl-3">
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
                      src={item.thumbnail || `https://img.youtube.com/vi/${getYoutubeId(item.src)}/hqdefault.jpg`}
                      alt={item.title || "Video thumbnail"}
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
            <ChevronLeft className="mx-auto !size-6" />
          </button>
        </div>

        <div className="absolute inset-y-0 -right-8 flex items-center max-md:hidden">
          <button
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            className="text-primary h-8 w-8 rounded-lg disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next thumbnails"
          >
            <ChevronRight className="mx-auto !size-6" />
          </button>
        </div>
      </Carousel>
    </div>
  );
}
