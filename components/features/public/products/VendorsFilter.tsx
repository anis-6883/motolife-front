"use client";

import { FiltersState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { vendorsAry } from "./constants";

export default function VendorsFilter() {
  const [expanded, setExpanded] = useState(true);

  const [filters, setFilters] = useState<FiltersState>({
    brands: [],
    availability: [],
    ratings: [],
    vendors: [],
    vendorTypes: [],
    price: {
      min: undefined,
      max: undefined,
    },
    category: undefined,
    sortBy: "popular",
    priceSort: "low",
  });

  const toggleVendor = (vendor: string) => {
    setFilters((prev) => ({
      ...prev,
      vendors: prev.vendors.includes(vendor) ? prev.vendors.filter((v) => v !== vendor) : [...prev.vendors, vendor],
    }));
  };

  return (
    <div className="bg-dark-backround rounded-lg px-4 shadow-sm">
      <button
        onClick={() => setExpanded((e) => !e)}
        className={`mb-2 flex w-full items-center justify-between py-3 text-left ${expanded && "border-b"}`}
      >
        <span className="font-semibold text-black">Vendors</span>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {expanded && (
        <div className="space-y-2 pb-4">
          {vendorsAry.map((vendor) => {
            const selected = filters.vendors.includes(vendor);

            return (
              <button
                key={vendor}
                onClick={() => toggleVendor(vendor)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left font-semibold",
                  selected ? "bg-foundation-red text-primary" : "hover:bg-gray-100"
                )}
              >
                {vendor}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
