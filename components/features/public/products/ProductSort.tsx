"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

enum ProductSortFields {
  PRICE = "price",
  CREATED_AT = "createdAt",
  RATING = "rating",
  TOTAL_SOLD = "quantitySold",
  DISCOUNT_PRICE = "discountPrice",
}

enum SortOrder {
  DESC = "desc",
  ASC = "asc",
}

const SORT_OPTIONS = [
  { value: ProductSortFields.PRICE, label: "Price: Low to high", order: SortOrder.ASC },
  { value: ProductSortFields.PRICE, label: "Price: High to low", order: SortOrder.DESC },
  { value: ProductSortFields.TOTAL_SOLD, label: "Popular", order: SortOrder.DESC },
  { value: ProductSortFields.CREATED_AT, label: "Newest", order: SortOrder.DESC },
  { value: ProductSortFields.RATING, label: "Top Rated", order: SortOrder.DESC },
  { value: ProductSortFields.DISCOUNT_PRICE, label: "Best Discount", order: SortOrder.DESC },
];

export default function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current values from URL or defaults
  const currentSortBy = searchParams.get("sortBy") || ProductSortFields.CREATED_AT;
  const currentSortOrder = searchParams.get("sortOrder") || SortOrder.DESC;

  // Combine sortBy and sortOrder to create a unique value for the select
  const currentSelectValue = `${currentSortBy}:${currentSortOrder}`;

  const handleSortChange = useCallback(
    (value: string) => {
      const [sortBy, sortOrder] = value.split(":");
      const params = new URLSearchParams(searchParams.toString());

      if (sortBy && sortOrder) {
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
      } else {
        params.delete("sortBy");
        params.delete("sortOrder");
      }

      // Reset page to 1 whenever sort changes
      params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <Select value={currentSelectValue} onValueChange={handleSortChange}>
      <SelectTrigger className="w-full flex-1 rounded-lg border-0 bg-gray-100 data-[size=default]:h-10 md:w-55">
        <div className="flex flex-1 justify-between">
          <span className="mr-1 text-gray-500 max-md:hidden">Sort By</span>
          <SelectValue />
        </div>
      </SelectTrigger>

      <SelectContent>
        {SORT_OPTIONS.map((option) => {
          const combinedValue = `${option.value}:${option.order}`;
          return (
            <SelectItem key={combinedValue} value={combinedValue}>
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
