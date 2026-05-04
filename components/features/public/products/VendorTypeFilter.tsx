"use client";

import { FiltersState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { vendorTypesAry } from "./constants";

export default function VendorTypeFilter() {
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

  const toggleVendorType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      vendorTypes: prev.vendorTypes.includes(type) ? prev.vendorTypes.filter((t) => t !== type) : [...prev.vendorTypes, type],
    }));
  };

  return (
    <div className="bg-dark-backround rounded-lg px-4 shadow-sm">
      <button
        onClick={() => setExpanded((e) => !e)}
        className={`mb-2 flex w-full items-center justify-between py-3 text-left ${expanded && "border-b"}`}
      >
        <span className="font-semibold text-black">Vendor Type</span>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {expanded && (
        <div className="space-y-2 pb-4">
          {vendorTypesAry.map((type) => {
            const selected = filters.vendorTypes.includes(type);

            return (
              <button
                key={type}
                onClick={() => toggleVendorType(type)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left font-semibold",
                  selected ? "bg-foundation-red text-primary" : "hover:bg-gray-100"
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
