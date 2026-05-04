"use client";

import { requestRestock } from "@/actions/landing/product-action";
import { Icons } from "@/components/icons";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CartItem } from "@/store/cart/Cart-types";
import { Loader2, X } from "lucide-react";
import { useState } from "react";

export function RequestRestockModal({
  open,
  onClose,
  item,
  modalCloser,
}: {
  open: boolean;
  onClose: () => void;

  item: CartItem;
  modalCloser?: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    const res = await requestRestock(item.productId, item.variantSku && item.variantSku);
    if (res.data) {
      Toast.success(res.data.message);
      onClose();
      modalCloser?.(false);
    } else {
      Toast.error(res.data.message);
    }
    setLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4 p-4 sm:max-w-sm md:max-w-2xl [&>button:first-of-type]:hidden">
        <div className="relative">
          <button onClick={onClose} className="absolute top-4 right-4 flex-shrink-0">
            <X className="size-6" />
          </button>
          <DialogHeader className="sr-only">
            <DialogTitle>Request to Restock</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center">
            <div className="bg-dark-gray/10 my-0 overflow-hidden rounded-full p-3.5">
              <Icons.Restock className="size-11" />
            </div>
          </div>

          {/* Texts */}
          <div className="space-y-3 text-center md:space-y-5 lg:space-y-7.5 lg:px-6">
            <h3 className="p-text-30 font-bold text-black">Request to Restock</h3>
            <p className="p-text-18 leading-6 text-[#777]">
              It looks like this item is sold out. Submit your request now. We’ll notify you as soon as it’s available again, so you don’t
              miss out.
            </p>
            <div className="bg-dark-gray/10 flex items-center justify-between gap-2.5 rounded-lg p-2.5 text-black max-md:flex-col">
              <div className="relative aspect-square size-11 rounded-lg">
                <ImageWithFallback fallbackSrc="/images/auth/logo.png" src={item?.thumbnail} fill alt="Product Image" />
              </div>
              <p className="p-text-16 leading-6">{item?.name}</p>
              {item?.attributes?.slice(0, 2).map((attr) => (
                <p key={attr.name} className="p-text-16 leading-6 capitalize">
                  <span className="text-dark-gray font-semibold">{attr.name}:</span> {attr.value}
                </p>
              ))}
              <p className="p-text-16 leading-6">
                <span className="text-dark-gray font-semibold">Price:</span> {item?.sellingPrice} BDT
              </p>
            </div>
            {/* Actions */}
            <div className="mx-auto flex justify-center gap-4 xl:max-w-[80%]">
              <Button variant="outline" className="flex-1 rounded-sm xl:h-11" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={loading}
                className="flex-1 rounded-sm border border-black bg-black text-white hover:bg-white hover:text-black xl:h-11"
                onClick={handleConfirm}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}Submit request
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
