"use client";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { vendorDetails } from "./constants";

const vDetailsAry = [
  {
    icon: "Package",
    title: "Product Quantity",
    value: vendorDetails.productQty,
  },
  {
    icon: "MessageQuote",
    title: "Reviews",
    value: vendorDetails.reviews,
  },
];

export default function VendorDetails() {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="bg-dark-backround rounded-lg px-4 shadow-sm">
      <button
        onClick={() => setExpanded((e) => !e)}
        className={cn("flex w-full items-center justify-between py-3 text-left", expanded && "border-b")}
      >
        <span className="p-text-16 leading-5 font-semibold text-black">Vendor Details</span>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {expanded && (
        <div className="space-y-2 py-4">
          {vDetailsAry.map((detailObj, index) => {
            const Icon = Icons[detailObj.icon as keyof typeof Icons];
            return (
              <div
                key={index}
                className={cn(
                  "p-text-16 text-dark-gray flex w-full justify-between rounded-md px-3 py-2 text-left leading-5 font-semibold"
                )}
              >
                <div className="flex gap-4">
                  <Icon />
                  <span>{detailObj.title}</span>
                </div>
                <p className="text-primary">{detailObj.value}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
