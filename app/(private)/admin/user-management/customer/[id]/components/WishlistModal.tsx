"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: any[];
}

export function WishlistModal({ isOpen, onClose, wishlist }: WishlistModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-xl sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Customer Wishlist</DialogTitle>
        </DialogHeader>

        <div className="grid max-h-100 grid-cols-2 gap-6 overflow-y-auto pr-2">
          {wishlist?.map((item, i) => (
            <div key={i} className="flex gap-3">
              <img src={item?.productDetails?.thumbnail} alt="" className="h-20 w-20 rounded-lg border object-cover" />

              <div className="space-y-1">
                <p className="text-sm font-semibold">{item?.productDetails?.name}</p>
                {item?.productDetails?.rating && <p className="text-xs text-gray-500">⭐ {item?.productDetails?.rating}</p>}
                <p className="text-sm font-bold">{item?.productDetails?.sellingPrice} BDT</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
