"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, Store, Trash2 } from "lucide-react";
import { CartFormItem } from "./CartSection";

type CartCardItem = CartFormItem & { index: number };

type CartCardProps = {
  vendorId: string;
  vendorName: string;
  items: CartCardItem[];
  selectedItems: Set<string>;
  selectedVendors: Set<string>;
  onVendorSelect: (vendorId: string, checked: boolean) => void;
  onItemSelect: (itemId: string, vendorId: string, checked: boolean) => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveVendorItems: (vendorId: string) => void;
};

export function CartCard({
  vendorId,
  vendorName,
  items,
  selectedItems,
  selectedVendors,
  onVendorSelect,
  onItemSelect,
  onUpdateQuantity,
  onRemoveVendorItems,
}: CartCardProps) {
  return (
    <div className="rounded-lg border p-4 md:p-6">
      {/* Vendor Header */}
      <div className="mb-4 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Checkbox checked={selectedVendors.has(vendorId)} onCheckedChange={(checked) => onVendorSelect(vendorId, checked as boolean)} />
          <Store className="text-dark-gray h-5 w-5" />
          <span className="p-text-16 text-dark-gray font-semibold">{vendorName}</span>
        </div>

        <button type="button" onClick={() => onRemoveVendorItems(vendorId)} className="text-primary hover:text-primary/80 transition">
          <Trash2 className="size-6" />
        </button>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => {
          const key = `${item.productId}-${item.variantSku}`;
          console.log(item, "item");
          return (
            <div key={item.variantSku} className="relative flex gap-4 max-md:flex-col md:items-center md:gap-10 xl:gap-20">
              {/* Left */}
              <div className="flex flex-1 gap-4 max-md:pl-3 md:items-center">
                <Checkbox
                  className="z-10 max-md:absolute max-md:top-0 max-md:-left-2"
                  checked={selectedItems.has(key)}
                  onCheckedChange={(checked) => onItemSelect(key, vendorId, checked as boolean)}
                />
                <div className="relative size-17 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <ImageWithFallback
                    src={item.thumbnail}
                    fallbackSrc="/images/auth/logo.png"
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="p-text-18 line-clamp-2 font-semibold text-black">{item.name}</h3>
                  <div className="p-text-16 text-dark-gray mt-1 flex flex-wrap gap-2 md:gap-4">
                    <span>
                      Variant: <b>{item.variation.length > 0 ? item.variation : "N/A"}</b>
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile: qty + price row */}
              <div className="flex items-center justify-between md:hidden">
                <div className="flex h-9 items-center rounded-md border">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.index, -1)}
                    className="flex h-9 w-9 items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.index, 1)}
                    className="flex h-9 w-9 items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="p-text-20 w-32 shrink-0 text-right font-semibold text-black tabular-nums">
                  {(item.sellingPrice * item.quantity).toFixed(2)} BDT
                </span>
              </div>

              {/* Desktop: qty */}
              <div className="flex h-9 items-center rounded-md border max-md:hidden">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.index, -1)}
                  className="flex h-9 w-9 items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.index, 1)}
                  className="flex h-9 w-9 items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Desktop: price */}
              <span className="p-text-20 w-52 max-w-52 shrink-0 text-right font-semibold text-black tabular-nums max-md:hidden">
                {(item.sellingPrice * item.quantity).toFixed(2)} BDT
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
