"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface StatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  title: string;
  h3Text: string;
  description: ReactNode;
  icon: ReactNode;
}

export function ResponseStatusModal({ open, onOpenChange, title, orderId, description, icon }: StatusModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4 rounded-2xl! p-4 sm:max-w-[90vw] md:max-w-md lg:max-w-xl xl:px-12 [&>button]:hidden">
        <DialogHeader className="">
          <div className="flex justify-center">
            <div className="my-0 flex justify-center overflow-hidden">{icon}</div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="absolute top-4 right-4 rounded-full p-1 transition hover:bg-gray-100"
          >
            <X className="size-6! text-black" />
          </button>
          <DialogTitle>
            <p className="p-text-30 text-center font-bold text-black">{title}</p>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 md:space-y-10">
          <p className="p-text-16 text-center leading-6 text-[#777]">
            Order ID: <span className="font-semibold text-black">#{orderId}</span>
          </p>

          {description}
          <div className="flex justify-center gap-4">
            <Button
              variant="black"
              className="rounded-sm [@media(min-width:1600px)]:h-11 [@media(min-width:1600px)]:px-20!"
              onClick={() => onOpenChange(false)}
            >
              Go to home
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
