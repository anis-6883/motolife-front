"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { OrderStatusTimeline } from "../checkout/OrderStatusTimeline";
import { stepsObj } from "../products/constants";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
}
export type OrderStepDates = {
  confirmed?: string;
  ready?: string;
  shipped?: string;
  delivery?: string;
  delivered?: string;
  cancelled?: string;
};
export function TrackOrderModal({ isOpen, onClose, status }: ShareModalProps) {
  console.log("order status", status);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full border-0 sm:max-w-5xl md:max-w-[90vw] xl:max-w-[80vw] xl:p-7.5 [&>button:first-of-type]:hidden">
        <div className="relative">
          {" "}
          <button onClick={onClose} className="absolute top-0 right-0 z-10 flex-shrink-0">
            <X className="size-6" />
          </button>
          <DialogTitle className="relative z-0">
            {" "}
            <p className="p-text-36 leading-8 font-bold -tracking-[0.72px] capitalize md:leading-12">Track Order</p>
          </DialogTitle>
          <p className="p-text-18 text-dark-gray pt-2 pb-3 md:pt-4 md:pb-7 xl:pt-6 xl:pb-10">
            Current Status : <span className="font-semibold text-black capitalize">{stepsObj[status]?.label || status}</span>
          </p>
          <div className="relative">
            <OrderStatusTimeline status={status} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
