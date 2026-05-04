"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ImagePreviewModalProps {
  open: boolean;
  media: {
    type: "image" | "youtube";
    src: string;
    title?: string;
    description?: string;
  } | null;
  onClose: () => void;
}

export function ImagePreviewModal({ open, media, onClose }: ImagePreviewModalProps) {
  if (!media) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 sm:max-w-xl [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{media.type === "youtube" ? media.title || "Video Preview" : "Image Preview"}</DialogTitle>
        </DialogHeader>

        {media.type === "image" ? (
          <ImageWithFallback
            fallbackSrc="/images/auth/logo.png"
            src={media.src}
            alt={media.title || "Media preview"}
            width={1000}
            height={1000}
            className="h-auto w-full object-contain"
          />
        ) : (
          <div className="relative aspect-video w-full bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${media.src}?autoplay=1`}
              title={media.title || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
