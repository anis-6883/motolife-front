"use client";

import { Availability } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ScrollToTop from "../shared/ScrollToTop";

const availabilityOptions = [
  { label: "In stock", value: Availability.INSTOCK },
  { label: "Upcoming", value: Availability.UPCOMING },
  { label: "Out of stock", value: Availability.OUTOFSTOCK },
];

export default function AvailabilityFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const [expanded, setExpanded] = useState(true);

  const selectedAvailability = searchParams.get("availability");

  const toggleAvailability = (value: string) => {
    setIsMounted(!isMounted);
    const params = new URLSearchParams(searchParams.toString());

    if (params.get("availability") === value) {
      params.delete("availability");
    } else {
      params.set("availability", value);
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-dark-backround rounded-lg px-4 shadow-sm">
      <ScrollToTop deps={[isMounted]} />
      <button
        onClick={() => setExpanded((e) => !e)}
        className={cn("flex w-full items-center justify-between py-3 text-left", expanded && "border-b")}
      >
        <span className="p-text-16 leading-5 font-semibold text-black">Availability</span>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {expanded && (
        <div className="space-y-2 py-4">
          {availabilityOptions.map((option) => {
            const selected = selectedAvailability === option.value;

            return (
              <button
                key={option.value}
                onClick={() => toggleAvailability(option.value)}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left font-semibold transition-colors",
                  selected ? "bg-foundation-red text-primary" : "hover:bg-gray-100"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
