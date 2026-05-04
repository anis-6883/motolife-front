"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { CountdownCard } from "./CountdownCard";

interface LimitedTimeOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LimitedTimeOfferModal = ({ open, onOpenChange }: LimitedTimeOfferModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full overflow-hidden rounded-xl border-0 p-0 sm:max-w-2xl [&>button:first-of-type]:hidden">
        <DialogTitle className="sr-only">Limited Time offer Modal</DialogTitle>
        <div className="relative aspect-630/302 w-full">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80 focus:ring-2 focus:ring-transparent focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
          <ImageWithFallback
            fallbackSrc="/images/shared/popupBanner2.png"
            src="/images/shared/popupBanner2.png"
            alt="Limited Time Offer"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="bg-background p-6 text-center">
          <h2 className="p-text-40 leading-8 font-bold md:leading-10 lg:leading-15">Limited Time Offer!</h2>

          <p className="p-text-18 font-semibold -tracking-[0.18px]">Sale ends soon so check out now</p>
          <div className="flex justify-center">
            <CountdownCard endDate={"2026-04-07T23:59:59.000Z"} className="md:max-w-[80%]" />
          </div>

          {/* CTA */}
          <Button className="h-11 w-full border-none bg-black text-white outline-none hover:bg-black/70">
            <p className="p-text-15 uppercase">Shop Now</p>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LimitedTimeOfferModal;
