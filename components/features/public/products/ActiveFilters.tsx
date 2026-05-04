"use client";

import { getProductBrands } from "@/actions/landing/product-brand-actions";
import { getMainCategories } from "@/actions/landing/product-category-actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Brand, ProductCategory, ProductListVariant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { RotateCcw, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FilterSidebar } from "./FilterSidebar";
import ProductSort from "./ProductSort";
import SearchProduct from "./SearchProduct";

type ProductsToolbarProps = {
  variant?: ProductListVariant;
  sectionTitle?: string;
};

export function ActiveFilters({ variant = "products", sectionTitle = "Product List" }: ProductsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [categoriesList, setCategoriesList] = useState<ProductCategory[]>([]);

  // Initialize selected values from URL
  const selectedCategory = searchParams.get("category");
  const selectedSubCategory = searchParams.get("subCategory");
  const fromPrice = searchParams.get("fromPrice");
  const toPrice = searchParams.get("toPrice");
  const selectedBrands = searchParams.get("brand") ? searchParams.get("brand")!.split(",") : [];
  const selectedAvailability = searchParams.get("availability") ? searchParams.get("availability")!.split(",") : [];
  const selectedRatings = searchParams.get("rating") ? searchParams.get("rating")!.split(",") : [];

  // Fetch brands to display proper labels for brand IDs
  useEffect(() => {
    const fetchBrands = async () => {
      const res = await getProductBrands();
      if (res?.data) {
        setBrandsList(res?.data?.data || []);
      }
    };
    if (selectedBrands.length > 0 && brandsList.length === 0) {
      fetchBrands();
    }
  }, [selectedBrands.length, brandsList.length]);

  // Fetch categories to find parent if subCategory is selected
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getMainCategories();
      if (res?.data) {
        setCategoriesList(res?.data?.data || []);
      }
    };
    if (selectedSubCategory && categoriesList.length === 0) {
      fetchCategories();
    }
  }, [selectedSubCategory, categoriesList.length]);

  const parentCategory = selectedSubCategory
    ? categoriesList.find((cat) => cat.subCategories?.some((sub) => sub.name === selectedSubCategory))?.name
    : null;

  /* ---------- Build chips from filters ---------- */
  const chips = [
    // Category chip
    selectedCategory || parentCategory
      ? {
          id: "category",
          label: `Category: ${selectedCategory || parentCategory}`,
        }
      : null,

    // Subcategory chip
    selectedSubCategory
      ? {
          id: "subCategory",
          label: `Subcategory: ${selectedSubCategory}`,
        }
      : null,

    // Price chip
    fromPrice || toPrice
      ? {
          id: "price",
          label: `Price: ${fromPrice ?? "0"} – ${toPrice ?? "∞"}`,
        }
      : null,

    // Brands
    ...selectedBrands.map((b) => ({
      id: `brand-${b}`,
      label: `Brand: ${brandsList.find((br) => br._id === b)?.name || "..."}`,
    })),

    // Availability
    ...selectedAvailability.map((a) => ({
      id: `availability-${a}`,
      label: a,
    })),

    // Ratings
    ...selectedRatings.map((r) => ({
      id: `rating-${r}`,
      label: `${r}★`,
    })),
  ].filter(Boolean) as { id: string; label: string }[];

  /* ---------- Remove single filter ---------- */
  const removeFilter = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (id === "category") {
      params.delete("category");
      params.delete("subCategory");
    } else if (id === "subCategory") {
      params.delete("subCategory");
    } else if (id === "price") {
      params.delete("fromPrice");
      params.delete("toPrice");
    } else if (id.startsWith("brand-")) {
      const brandId = id.replace("brand-", "");
      let bg = params.get("brand") ? params.get("brand")!.split(",") : [];
      bg = bg.filter((b) => b !== brandId);
      if (bg.length > 0) {
        params.set("brand", bg.join(","));
      } else {
        params.delete("brand");
      }
    } else if (id.startsWith("availability-")) {
      const avail = id.replace("availability-", "");
      let bg = params.get("availability") ? params.get("availability")!.split(",") : [];
      bg = bg.filter((a) => a !== avail);
      if (bg.length > 0) {
        params.set("availability", bg.join(","));
      } else {
        params.delete("availability");
      }
    } else if (id.startsWith("rating-")) {
      const rating = id.replace("rating-", "");
      let bg = params.get("rating") ? params.get("rating")!.split(",") : [];
      bg = bg.filter((r) => r !== rating);
      if (bg.length > 0) {
        params.set("rating", bg.join(","));
      } else {
        params.delete("rating");
      }
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  /* ---------- Clear all ---------- */
  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("subCategory");
    params.delete("fromPrice");
    params.delete("toPrice");
    params.delete("brand");
    params.delete("availability");
    params.delete("rating");

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-3">
      {/* Top Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Mobile Filter Button */}
        <div className="flex items-end justify-between pt-2 lg:hidden">
          <h2 className="p-text-36 font-bold capitalize md:pt-6 lg:pt-7.5">{sectionTitle}</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Icons.filterIcon />
                Filters
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 rounded-r-4xl! p-0 [&>button:first-of-type]:hidden">
              <SheetHeader className="border-b px-4 py-3">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>

              <div className="h-full overflow-y-auto p-4">
                <div className="mb-4 flex w-full justify-center gap-2">
                  <ProductSort />
                </div>
                <FilterSidebar variant={variant} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <SearchProduct />

        {/* Sort Controls */}
        <div className="max-lg:hidden">
          <ProductSort />
        </div>
      </div>

      {/* Active Filters */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Active Filters :</span>

          {chips.map((f) => (
            <button
              key={f.id}
              onClick={() => removeFilter(f.id)}
              className={cn("flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm", "transition hover:bg-gray-300")}
            >
              {f.label}
              <X className="h-3 w-3" />
            </button>
          ))}

          <Button variant="ghost" onClick={clearAll} className="flex items-center gap-2 text-red-600 hover:text-red-700">
            Clear All
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
