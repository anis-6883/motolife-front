"use client";

import { IPagination } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PaginationSection } from "../shared/PaginationSection";

export default function ProductPagination({ pagination }: { pagination: IPagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);

  useEffect(() => {
    const pageInUrl = Number(searchParams.get("page")) || 1;
    if (pageInUrl !== currentPage) {
      setCurrentPage(pageInUrl);
    }
  }, [searchParams, currentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      const safePage = Math.max(1, Math.min(pagination.totalPages, page));
      setCurrentPage(safePage);

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", safePage.toString());

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, pagination.totalPages]
  );

  const startIndex = (currentPage - 1) * pagination.limit;
  const endIndex = Math.min(currentPage * pagination.limit, pagination.totalDocs);

  return (
    <div className="pt-10 md:pt-16 lg:pt-20">
      <PaginationSection
        currentPage={currentPage}
        totalItems={pagination.totalDocs}
        totalPages={pagination.totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
