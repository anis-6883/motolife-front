"use client";

import { getMainCategories } from "@/actions/landing/product-category-actions";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ScrollToTop from "../shared/ScrollToTop";

export default function CategoryFilter() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [expanded, setExpanded] = useState(true);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedCategory = searchParams.get("category");
  const selectedSubCategory = searchParams.get("subCategory");

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const res = await getMainCategories();
      if (res?.data) {
        setCategories(res?.data?.data || []);
      } else {
        setCategories([]);
      }
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (name: string) => {
    setIsMounted(!isMounted);
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("category") === name) {
      params.delete("category");
    } else {
      params.set("category", name);
      params.delete("subCategory");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSubCategorySelect = (name: string) => {
    setIsMounted(!isMounted);
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("subCategory") === name) {
      params.delete("subCategory");
    } else {
      params.set("subCategory", name);
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearCategories = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("subCategory");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-dark-backround rounded-lg px-4 shadow-sm">
      <ScrollToTop deps={[isMounted]} />
      <button
        onClick={() => setExpanded((e) => !e)}
        className={cn("mb-2 flex w-full items-center justify-between py-3 text-left", expanded && "border-b")}
      >
        <span className="p-text-16 leading-5 font-semibold text-black">Categories</span>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {expanded && (
        <div className="space-y-3 pt-2 pb-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
              </div>
            ))
          ) : categories.length > 0 ? (
            <>
              <Button
                variant="link"
                onClick={handleClearCategories}
                className={cn(
                  "hover:text-primary block w-full py-2 capitalize hover:no-underline",
                  !selectedCategory && !selectedSubCategory ? "border-primary bg-foundation-red text-primary border-l" : "text-dark-gray"
                )}
              >
                <p className="p-text-16 flex-1 text-left font-semibold">All Categories</p>
              </Button>
              {categories.map((category) => (
                <MobileCategoryItem
                  key={category._id}
                  category={category}
                  level={0}
                  selectedCategoryName={selectedCategory}
                  selectedSubCategoryName={selectedSubCategory}
                  onCategorySelect={handleCategorySelect}
                  onSubCategorySelect={handleSubCategorySelect}
                />
              ))}
            </>
          ) : (
            <p className="py-2 text-center text-sm text-gray-500">No categories found</p>
          )}
        </div>
      )}
    </div>
  );
}

type MobileCategoryItemProps = {
  category: ProductCategory;
  level?: number;
  onCategorySelect: (name: string) => void;
  onSubCategorySelect: (name: string) => void;
  selectedCategoryName?: string | null;
  selectedSubCategoryName?: string | null;
};

export function MobileCategoryItem({
  category,
  onCategorySelect,
  onSubCategorySelect,
  level = 0,
  selectedCategoryName,
  selectedSubCategoryName,
}: MobileCategoryItemProps) {
  const isParentOfSelected = category.subCategories?.some((sub) => sub.name === selectedSubCategoryName);

  const [isOpen, setIsOpen] = useState(selectedCategoryName === category.name || isParentOfSelected || false);

  const hasChildren = category.subCategories && category.subCategories.length > 0;

  // Sync open state when selection changes externally or on load
  useEffect(() => {
    if (selectedCategoryName === category.name || isParentOfSelected) {
      setIsOpen(true);
    }
  }, [selectedCategoryName, selectedSubCategoryName, category.name, isParentOfSelected]);

  const isSelected =
    level === 0 ? selectedCategoryName === category.name && !selectedSubCategoryName : selectedSubCategoryName === category.name;

  if (!hasChildren) {
    return (
      <Button
        variant="link"
        onClick={() => {
          if (level === 0) {
            onCategorySelect(category.name);
          } else {
            onSubCategorySelect(category.name);
          }
        }}
        className={cn(
          "hover:text-primary text-dark-gray block w-full py-2 capitalize hover:no-underline",
          level > 0 && "pl-8",
          isSelected && "border-primary bg-foundation-red text-primary border-l"
        )}
      >
        <p className="p-text-16 flex-1 text-left font-semibold">{category.name}</p>
      </Button>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        onClick={() => {
          if (level === 0) {
            onCategorySelect(category.name);
          }
        }}
        className={cn(
          "hover:text-primary flex w-full items-center justify-between rounded-md bg-transparent py-2",
          level > 0 ? "pl-8" : "pl-4",
          isOpen ? "text-primary" : "text-dark-gray",
          isSelected && level === 0 && "border-primary bg-foundation-red text-primary border-l"
        )}
      >
        <span className="p-text-16 font-semibold">{category.name}</span>
        <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-1">
        {(category.subCategories || []).map((sub) => (
          <MobileCategoryItem
            key={sub._id}
            category={sub}
            level={level + 1}
            onCategorySelect={onCategorySelect}
            onSubCategorySelect={onSubCategorySelect}
            selectedCategoryName={selectedCategoryName}
            selectedSubCategoryName={selectedSubCategoryName}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
