"use client";

import { memo } from "react";

interface OrderSummary {
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  couponDiscount: number;
  total: number;
}

interface Props {
  summary: OrderSummary;
  couponCode?: string;
}

const OrderSummaryCard = ({ summary, couponCode }: Props) => {
  return (
    <div className="space-y-7 rounded-xl bg-[#F4F4F4] px-4 py-5 md:px-5 md:py-6 lg:px-6 lg:py-7">
      <h2 className="p-text-24 mb-6 font-semibold -tracking-[0.24px]">Order Summary</h2>

      {couponCode && <div className="p-text-16 rounded-sm border bg-white px-4 py-2">{couponCode}</div>}

      <div className="text-dark-gray p-text-16 space-y-3 pb-4">
        <Row label="Subtotal" value={`${summary.subtotal} BDT`} />
        <Row label="Delivery Charge" value={`${summary.deliveryCharge} BDT`} />
        {/* <Row label="TAX (8%)" value={`${summary.tax} BDT`} /> */}

        {/* {summary.couponDiscount > 0 && <Row label="Coupon" value={`-${summary.couponDiscount} BDT`} />} */}

        <div className="bg-border my-4 h-px w-full" />

        <div className="flex items-center justify-between font-semibold text-black">
          <span>Total</span>
          <span>{summary.total} BDT</span>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default memo(OrderSummaryCard);
