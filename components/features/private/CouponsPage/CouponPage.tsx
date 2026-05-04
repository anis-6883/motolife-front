"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SampleCoupons } from "../../public/products/constants";
import { CouponCard } from "./CouponCard";

export function CouponList() {
  const [selectedStatus, setSelectedStatus] = useState("available");

  const statuses = ["available", "applied", "expired"];

  const filteredCoupons = selectedStatus === "All" ? SampleCoupons : SampleCoupons.filter((c) => c.status === selectedStatus);
  const filterContent: Record<string, { title: string; description: string }> = {
    available: {
      title: "Available Coupons",
      description: "Coupons that are ready to use at checkout",
    },
    applied: {
      title: "Used Coupons",
      description: "Coupons already applied to completed orders",
    },
    expired: {
      title: "Used Coupons",
      description: "Coupons that are no longer valid",
    },
  };

  return (
    <div>
      <h2 className="p-text-24 mb-4 font-semibold md:mb-8">Coupons</h2>

      {/* Status Filters */}
      <div className="scrollbar-none mb-6 flex gap-3 overflow-x-scroll">
        {statuses.map((status) => (
          <Button
            key={status}
            type="button"
            variant="outline-black"
            onClick={() => {
              setSelectedStatus(status);
            }}
            className={`transition 2xl:px-10 ${
              selectedStatus === status || (!selectedStatus && status === "All")
                ? "bg-primary border-primary hover:bg-primary/80 text-white"
                : "border-black/50 text-black/50"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>
      <div>
        <p className="p-text-18 font-semibold">{filterContent[selectedStatus]?.title}</p>
        <p className="p-text-14 pt-2.5 pb-2">{filterContent[selectedStatus]?.description}</p>
      </div>
      <div className="divide-y overflow-hidden rounded-lg md:border md:px-2.5">
        {filteredCoupons.map((coupon, index) => (
          <CouponCard key={index} {...coupon} />
        ))}
      </div>
    </div>
  );
}
