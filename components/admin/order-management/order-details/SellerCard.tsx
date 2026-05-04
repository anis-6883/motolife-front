"use client";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { IOrderSeller } from "@/lib/types";
import { BadgeCheck, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SellerCard({ seller }: { seller: IOrderSeller }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-all">
      {/* Header */}
      <div onClick={() => setOpen(!open)} className="flex cursor-pointer items-center justify-between p-5">
        <div className="flex gap-5">
          <div className="border-primary relative size-10 overflow-hidden rounded-full border lg:size-17.5">
            <ImageWithFallback src="/images/auth/logo.png" fallbackSrc="/images/auth/logo.png" alt="" fill />
          </div>
          <div>
            <div className="p-text-16 text-dark-gray flex items-center gap-1">
              <h3 className="text-lg font-semibold">{seller?.store?.storeName}</h3>
              <BadgeCheck className="fill-blue-dark size-5! text-white" />
            </div>
            <p className="text-sm text-gray-500">{seller?.store?.address}</p>
          </div>
        </div>

        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown Content */}
      {open && (
        <div className="space-y-2.5 border-t px-5 pt-3 pb-5">
          {[
            { label: "Order Served", value: seller?.totalOrders },
            { label: "Phone", value: seller?.phone },
            { label: "Address", value: seller?.store?.address },
          ].map(({ label, value }) => (
            <div key={label} className="p-text-16 text-dark-gray flex items-start gap-2 text-sm leading-6">
              <span className="w-28 shrink-0">{label}</span>
              <span className="font-semibold">: {value || "-"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
