"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ScrollToTop from "../shared/ScrollToTop";

export default function RatingFilter() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [expanded, setExpanded] = useState(true);

  // Get selected ratings from URL
  const selectedRatings = searchParams.get("rating") ? searchParams.get("rating")!.split(",").map(Number) : [];

  const toggleRating = (rating: number) => {
    setIsMounted(!isMounted);
    const params = new URLSearchParams(searchParams.toString());
    let newSelected = [...selectedRatings];

    if (newSelected.includes(rating)) {
      newSelected = newSelected.filter((r) => r !== rating);
    } else {
      newSelected.push(rating);
    }

    if (newSelected.length > 0) {
      params.set("rating", newSelected.join(","));
    } else {
      params.delete("rating");
    }

    // Reset pagination to page 1 on filter change
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
        <span className="p-text-16 leading-5 font-semibold text-black">Ratings</span>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {expanded && (
        <div className="space-y-2 py-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const selected = selectedRatings.includes(rating);

            return (
              <button
                key={rating}
                onClick={() => toggleRating(rating)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 font-semibold transition-colors",
                  selected ? "bg-foundation-red text-primary" : "hover:bg-gray-100"
                )}
              >
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < rating
                          ? selected
                            ? "text-primary fill-primary"
                            : "fill-secondary text-secondary"
                          : selected
                            ? "text-primary"
                            : "text-secondary"
                      )}
                    />
                  ))}
                </div>
                <span>{rating}.0</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
