"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface YouTubeVideoModalProps {
  videoId?: string;
  title?: string;
  description?: string;
  triggerLabel?: string;
  onClose?: () => void;
}

export function YouTubeVideoModal({
  videoId = "dQw4w9WgXcQ",
  title = "Video Player",
  description = "Watch the video below",
  onClose,
}: YouTubeVideoModalProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="absolute inset-0 flex items-center justify-center">
        <div className="bg-primary/70 flex aspect-video h-10 items-center justify-center rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="25" viewBox="0 0 23 25" fill="none">
            <path
              d="M0.875 2.87581C0.874857 2.39194 1.00239 1.9166 1.24472 1.49778C1.48704 1.07896 1.83559 0.731489 2.25516 0.49046C2.67473 0.249431 3.15046 0.123373 3.63434 0.125016C4.11821 0.126658 4.59308 0.255943 5.011 0.499815L21.5069 10.1221C21.9232 10.3636 22.2688 10.7102 22.5092 11.1272C22.7495 11.5442 22.8763 12.0169 22.8767 12.4983C22.8771 12.9796 22.7512 13.4525 22.5115 13.8699C22.2719 14.2873 21.9269 14.6345 21.511 14.8768L5.011 24.5018C4.59308 24.7457 4.11821 24.875 3.63434 24.8766C3.15046 24.8783 2.67473 24.7522 2.25516 24.5112C1.83559 24.2701 1.48704 23.9227 1.24472 23.5039C1.00239 23.085 0.874857 22.6097 0.875 22.1258V2.87581Z"
              fill="white"
            />
          </svg>
        </div>
      </button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="z-1001 mx-auto w-full gap-0 overflow-hidden rounded-md border-0 p-0 max-lg:w-[95vw] md:max-w-6xl md:p-2 lg:p-4 [&>button]:hidden">
          <div className="hidden">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
          </div>

          <div className="relative aspect-video w-full rounded-md bg-black">
            <iframe
              className="absolute inset-0 h-full w-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
