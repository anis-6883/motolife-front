"use client";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/formatters";
import { getPaginationRange } from "@/lib/helpers";
import { ArrowLeft, ArrowRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  hideleftPortion?: boolean;
};

export function PaginationSection({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  hideleftPortion,
}: PaginationProps) {
  if (totalItems === 0 || totalPages <= 1) return null;

  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex flex-col items-center justify-end border-t sm:flex-row md:gap-2">
      {/* <p className={`text-[10px] font-medium text-gray-500 max-md:order-last md:text-sm ${hideleftPortion ? "hidden" : ""}`}>
        {formatNumber(startIndex + 1)}-{formatNumber(Math.min(endIndex, totalItems))} of {formatNumber(totalItems)} items
      </p> */}

      <div className={`flex items-center ${hideleftPortion ? "w-full flex-1 justify-between gap-1 lg:gap-3" : "gap-2"}`}>
        <Button
          variant="link"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-none text-black hover:no-underline disabled:opacity-50"
        >
          <ArrowLeft className="size-3 md:size-5" />
          <span className="max-lg:hidden">Previous</span>
        </Button>

        {hideleftPortion ? (
          <div>
            {paginationRange.map((item, index) => {
              if (item === "dots") {
                return (
                  <span key={`dots-${index}`} className="px-2 text-gray-400">
                    …
                  </span>
                );
              }

              const page = item as number;
              const isActive = page === currentPage;

              return (
                <Button
                  key={page}
                  variant="link"
                  onClick={() => onPageChange(page)}
                  className={`size-6 rounded-none p-0 hover:no-underline max-md:text-[10px] md:size-10 ${isActive ? "border-t-2 border-black text-black" : "text-gray-500"}`}
                >
                  {formatNumber(page)}
                </Button>
              );
            })}
          </div>
        ) : (
          <>
            {paginationRange.map((item, index) => {
              if (item === "dots") {
                return (
                  <span key={`dots-${index}`} className="px-2 text-gray-400">
                    …
                  </span>
                );
              }

              const page = item as number;
              const isActive = page === currentPage;

              return (
                <Button
                  key={page}
                  variant="link"
                  onClick={() => onPageChange(page)}
                  className={`size-6 rounded-none p-0 hover:no-underline max-md:text-[10px] md:size-10 ${isActive ? "border-t-2 border-black text-black" : "text-gray-500"}`}
                >
                  {formatNumber(page)}
                </Button>
              );
            })}
          </>
        )}

        <Button
          variant="link"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="text-black hover:no-underline disabled:opacity-50"
        >
          <span className="max-lg:hidden">Next</span>
          <ArrowRight className="size-3 md:size-5" />
        </Button>
      </div>
    </div>
  );
}
