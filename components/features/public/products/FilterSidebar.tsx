import { Icons } from "@/components/icons";
import { ProductListVariant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import AvailabilityFilter from "./AvailabilityFilter";
import BrandsFilter from "./BrandsFilter";
import CategoryFilter from "./CategoryFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import RatingFilter from "./RatingFilter";
import VendorDetails from "./VendorDetails";
import VendorsFilter from "./VendorsFilter";
import VendorTypeFilter from "./VendorTypeFilter";

interface FilterSidebarProps {
  className?: string;
  variant?: ProductListVariant;
}

export function FilterSidebar({ className, variant = "products" }: FilterSidebarProps) {
  return (
    <div className={cn("w-full space-y-4 md:w-60 xl:w-78", className)}>
      {!(variant === "seller-profile") && (
        <div className="bg-dark-backround flex items-center gap-2 rounded-lg px-4 py-3 shadow-sm max-md:hidden">
          <Icons.filterIcon />
          <span className="p-text-18 font-semibold text-black">Filters</span>
          <div className="flex flex-1 justify-end">
            <ChevronDown />
          </div>
        </div>
      )}

      {variant === "seller-profile" && <VendorDetails />}
      {!(variant === "seller-profile") && <PriceRangeFilter />}
      {!(variant === "combo-offers") && <CategoryFilter />}
      <RatingFilter />
      {!(variant === "combo-offers") && <BrandsFilter />}
      <AvailabilityFilter />
      {variant === "seller-profile" && <VendorsFilter />}
      {variant === "seller-profile" && <VendorTypeFilter />}
    </div>
  );
}
