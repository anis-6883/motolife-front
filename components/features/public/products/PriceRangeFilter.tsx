"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PriceRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [expanded, setExpanded] = useState(true);

  // Initialize from URL search params
  const [minPrice, setMinPrice] = useState(searchParams.get("fromPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("toPrice") || "");

  // Sync internal state with URL changes (e.g., when filters are cleared elsewhere)
  useEffect(() => {
    setMinPrice(searchParams.get("fromPrice") || "");
    setMaxPrice(searchParams.get("toPrice") || "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentFrom = searchParams.get("fromPrice") || "";
      const currentTo = searchParams.get("toPrice") || "";

      // Avoid unnecessary updates if local values match current URL params
      if (minPrice === currentFrom && maxPrice === currentTo) return;

      const params = new URLSearchParams(searchParams.toString());

      if (minPrice) {
        params.set("fromPrice", minPrice);
      } else {
        params.delete("fromPrice");
      }

      if (maxPrice) {
        params.set("toPrice", maxPrice);
      } else {
        params.delete("toPrice");
      }

      // Reset pagination to page 1 on filter change
      params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [minPrice, maxPrice, pathname, router, searchParams]);

  return (
    <div className="bg-dark-backround rounded-lg px-4 shadow-sm">
      <button
        onClick={() => setExpanded((e) => !e)}
        className={cn("flex w-full items-center justify-between py-3 text-left", expanded && "border-b")}
      >
        <span className="p-text-16 leading-5 font-semibold text-black">Price Range</span>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {expanded && (
        <div className="flex gap-2 py-3">
          <Input
            type="number"
            placeholder="Min"
            className="h-8 flex-1 text-xs"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            className="h-8 flex-1 text-xs"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
