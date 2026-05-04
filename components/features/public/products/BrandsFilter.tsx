"use client";

import { getProductBrands } from "@/actions/landing/product-brand-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Brand } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ScrollToTop from "../shared/ScrollToTop";

export default function BrandsFilter() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [expanded, setExpanded] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get selected brand IDs from URL
  const selectedBrandIds = searchParams.get("brand") ? searchParams.get("brand")!.split(",") : [];

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      const res = await getProductBrands();
      if (res?.data) {
        setBrands(res?.data?.data || []);
      } else {
        setBrands([]);
      }
      setIsLoading(false);
    };

    fetchBrands();
  }, []);

  const toggleBrand = (brandId: string) => {
    setIsMounted(!isMounted);
    const params = new URLSearchParams(searchParams.toString());
    let newSelectedBrandIds = [...selectedBrandIds];

    if (newSelectedBrandIds.includes(brandId)) {
      newSelectedBrandIds = newSelectedBrandIds.filter((id) => id !== brandId);
    } else {
      newSelectedBrandIds.push(brandId);
    }

    if (newSelectedBrandIds.length > 0) {
      params.set("brand", newSelectedBrandIds.join(","));
    } else {
      params.delete("brand");
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
        <span className="p-text-16 leading-5 font-semibold text-black">Brands</span>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {expanded && (
        <div className="space-y-2 py-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-md bg-gray-300" />)
          ) : brands.length > 0 ? (
            brands.map((brand) => {
              const selected = selectedBrandIds.includes(brand._id);

              return (
                <button
                  key={brand._id}
                  onClick={() => toggleBrand(brand._id)}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-left font-semibold transition-colors",
                    selected ? "bg-foundation-red text-primary" : "hover:bg-gray-100"
                  )}
                >
                  {brand.name}
                </button>
              );
            })
          ) : (
            <p className="py-2 text-center text-sm text-gray-500">No brands found</p>
          )}
        </div>
      )}
    </div>
  );
}
