"use client";

import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { IOrder, PaginationType } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { PaginationSection } from "../../public/shared/PaginationSection";
import ScrollToTop from "../../public/shared/ScrollToTop";
import OrderCardItem from "./OrderCardItem";

type OrderHistoryPageProps = {
  orderData: {
    docs: IOrder[];
    pagination: PaginationType;
  };
};

export default function OrderHistoryPage({ orderData }: OrderHistoryPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);

  const [searchValue, setSearchValue] = useState(searchParams.get("orderId") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ orderId: value || null, page: 1 });
    }, 500);
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  const startIndex = (currentPage - 1) * (orderData?.docs?.length ?? 0);
  const endIndex = currentPage * (orderData?.docs?.length ?? 0);

  return (
    <>
      <ScrollToTop deps={[currentPage]} />
      <h2 className="p-text-24 mb-4 font-semibold md:mb-8">Order History</h2>

      <div className="mb-4 flex items-center rounded-lg border px-3">
        <Icons.search className="text-primary text-xl" />
        <Input
          type="search"
          placeholder="Search by order ID..."
          className="border-0 bg-transparent"
          value={searchValue}
          onChange={handleSearch}
        />
      </div>

      <div className="space-y-6">
        {orderData?.docs?.length > 0 ? (
          orderData.docs.map((order: IOrder) => <OrderCardItem key={order._id} order={order} />)
        ) : (
          <p className="text-gray-500">No orders found.</p>
        )}
      </div>

      {orderData?.pagination?.totalPages > 1 && (
        <div className="pt-10 md:pt-16 lg:pt-20">
          <PaginationSection
            hideleftPortion
            currentPage={currentPage}
            totalItems={orderData.pagination.totalDocs}
            totalPages={orderData.pagination.totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
