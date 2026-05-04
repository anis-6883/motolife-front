"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface LimitedTimeOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DiscountModal = ({ open, onOpenChange }: LimitedTimeOfferModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full overflow-hidden rounded-xl border-0 p-0 sm:max-w-[90vw] md:max-w-2xl lg:max-w-4xl xl:max-w-6xl [&>button:first-of-type]:max-lg:hidden">
        <DialogTitle className="sr-only">Discount Modal</DialogTitle>
        <div className="relative grid w-full lg:aspect-630/302 lg:grid-cols-2">
          <div className="relative flex flex-col items-center justify-center xl:size-full">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80 focus:ring-2 focus:ring-transparent focus:outline-none lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
            <ImageWithFallback
              fallbackSrc="/images/shared/popupBanner1.png"
              src="/images/shared/popupBanner1.png"
              alt="Limited Time Offer"
              fill
              className="relative z-0 object-cover"
              priority
            />
            <div className="relative z-10 mx-auto text-white max-lg:max-w-[90%] max-lg:py-6 lg:size-[90%] xl:size-auto">
              <h2 className="p-text-30 font-bold -tracking-[0.3px]">
                Don’t waste this <br />
                discount!
              </h2>
              <p className="p-text-16 text-center leading-6">Get 20% off for your first order</p>
              <p className="p-text-20 mx-auto mb-10 w-max bg-white px-5 py-3.5 text-center font-semibold text-black">CODE20OFF</p>
              <p className="p-text-16 mb-10 leading-6">Use above code to get 20% off for your first order when checkout</p>
              <Button className="bg-primary hover:bg-primary/80 w-full text-white uppercase md:h-11">GRAB the discount</Button>
            </div>
          </div>
          <div className="pt-3.5 pr-0 pl-3.5 xl:pr-14">
            <h3 className="p-text-24 border-b pr-14 pb-2 font-semibold -tracking-[0.24px]">Recommended Products</h3>
            <div className="custom-scrollbar max-h-90 overflow-y-auto pt-6 xl:max-h-130">
              {/* Dont forget to update it when integrated api */}
              {/* {allProducts.slice(0, 8).map((product, index) => (
                <NavCardV product={product} key={index} />
              ))} */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountModal;
