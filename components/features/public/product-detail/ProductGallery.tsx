"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { useState } from "react";
import { getYouTubeEmbedUrl } from "../../../../lib/helpers";
import { ProductThumbnailCarousel } from "../shared/QuickViewModal";
import { MediaPreviewModal, ReviewMedia } from "./ReviewsTab";

type MediaItem = { type: "image" | "video"; src: string; thumbnail?: string; title?: string };
type ProductMedia = {
  thumbnail?: string;
  images?: string[];
  videoLinks?: { url: string; thumbnail?: string; title?: string }[];
  colorWiseImages?: { color: string; image: string }[];
};
export function ProductGallery({
  product,
  activeIndex,
  onChange,
}: {
  product: ProductMedia;
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  // const [activeIndex, setActiveIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<ReviewMedia | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const mediaItems: MediaItem[] = [
    ...(product.thumbnail ? [{ type: "image" as const, src: product.thumbnail }] : []),
    ...(product.colorWiseImages?.map((c) => ({
      type: "image" as const,
      src: c.image,
      color: c.color, // 👈 important for mapping
    })) ?? []),
    ...(product.videoLinks?.length
      ? product.videoLinks.map((video) => ({
          type: "video" as const,
          src: getYouTubeEmbedUrl(video.url)!,
          thumbnail: video.thumbnail,
          title: video.title,
        }))
      : []),
    ...(product.images?.map((img) => ({
      type: "image" as const,
      src: img,
    })) ?? []),
  ];

  const active = mediaItems[activeIndex];
  return (
    <div className="space-y-4 max-md:pt-1">
      <div className="group relative aspect-video max-h-[80vh] w-full overflow-hidden rounded-2xl border shadow-none md:aspect-video lg:aspect-square">
        {active?.type === "image" ? (
          <ImageWithFallback
            onClick={() => {
              setSelectedMedia({ src: active.src, type: "image" });
              setModalOpen(true);
            }}
            key={active.src}
            fallbackSrc={"/images/auth/logo.png"}
            src={active.src}
            alt=""
            fill
            className="cursor-pointer border-none object-cover shadow-none outline-none"
          />
        ) : (
          <iframe
            src={active?.src}
            title="Product video"
            className="h-full w-full rounded-2xl"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      <ProductThumbnailCarousel mediaItems={mediaItems} activeIndex={activeIndex} onSelect={onChange} />
      <MediaPreviewModal open={modalOpen} media={selectedMedia} onClose={() => setModalOpen(false)} />
    </div>
  );
}
