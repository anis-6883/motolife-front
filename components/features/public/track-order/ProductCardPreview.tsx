"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { OrderItemType } from "@/lib/types";
import { Store } from "lucide-react";
import { useState } from "react";

/* Order item shape (matches sampleOrderData.items) */
export type OrderPreviewItem = {
  id: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
};

type ProductCardPreviewProps = {
  vendorName: string;
  items: OrderItemType[];
  isDelivered?: boolean;
};

export function ProductCardPreview({ vendorName, items, isDelivered }: ProductCardPreviewProps) {
  return (
    <div className="rounded-lg border p-4 md:p-6">
      {/* Vendor Header */}
      <div className="mb-4 flex items-center gap-3 border-b pb-4">
        <Store className="text-dark-gray h-5 w-5" />
        <span className="p-text-16 text-dark-gray font-semibold">{vendorName}</span>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <PlainProdCard item={item} key={item.product} isDelivered={isDelivered} />
        ))}
      </div>
    </div>
  );
}

export const PlainProdCard = ({ item, isDelivered = false }: { item: OrderItemType; isDelivered?: boolean }) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex gap-x-4 pb-3 last:pb-0 max-md:flex-col md:items-center md:gap-10 xl:gap-20">
      {/* Left */}
      <div className="flex flex-1 gap-4 md:items-center">
        <div className="relative size-17 shrink-0 overflow-hidden rounded-md bg-gray-100">
          <ImageWithFallback
            src={item.thumbnail}
            fallbackSrc="/images/auth/logo.png"
            alt={item.productName}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <h3 className="p-text-18 line-clamp-2 font-semibold text-black">{item.productName}</h3>

          <div className="p-text-16 text-dark-gray mt-1 flex flex-wrap gap-2 md:gap-4">
            {item.variantSku || item.variation ? (
              <span>
                Variant: <b>{item.variation || item.variantSku}</b>
              </span>
            ) : null}
            {/* <span>
              Size: <b>{item.size}</b>
            </span> */}
            <span>
              Qty: <b>{item.quantity}</b>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile price */}
      <div className="max-md:flex max-md:justify-end md:min-w-20 md:text-right">
        <span className="p-text-20 font-semibold text-black">{item.totalPrice?.toFixed(2)} BDT</span>
      </div>
      {isDelivered ? (
        <Button
          onClick={() => {
            setEditOpen(true);
          }}
          variant={"outline-secondary"}
        >
          Give review
        </Button>
      ) : null}
      {/* <ReviewModal open={editOpen} onClose={() => setEditOpen(false)} /> */}
    </div>
  );
};
