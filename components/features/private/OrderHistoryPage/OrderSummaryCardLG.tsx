"use client";

import { Button } from "@/components/ui/button";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/config/constant";
import { isRefundEligible } from "@/lib/helpers";
import { Dispatch, memo, SetStateAction } from "react";

interface OrderSummary {
  subtotal: number;
  deliveryCharge: number;
  tax?: number;
  couponDiscount: number;
  total: number;
}

interface Props {
  summary: OrderSummary;
  couponCode?: string;
  setRefundModalOpen: Dispatch<SetStateAction<boolean>>;
  status: string;
  hasRefunded?: boolean;
  payment: {
    method: keyof typeof PAYMENT_METHOD;
    status: keyof typeof PAYMENT_STATUS;
    amountPaid: number;
    currency: string;
  };
}

const OrderSummaryCardLG = ({ summary, couponCode, setRefundModalOpen, status, hasRefunded, payment }: Props) => {
  return (
    <div className="space-y-7 rounded-xl bg-[#F4F4F4] px-4 py-5 md:px-5 lg:px-6">
      <div className="mb-6 flex items-center justify-between gap-3 max-md:flex-col">
        <h2 className="p-text-24 font-semibold -tracking-[0.24px]">Order Summary</h2>

        {/* <Button variant="black" className="max-md:w-full">
          Download Invoice
          <Download className="h-4 w-4" />
        </Button> */}
      </div>

      {couponCode && <div className="p-text-16 rounded-sm border bg-white px-4 py-2">{couponCode}</div>}

      <div className="text-dark-gray p-text-16 space-y-3 leading-6">
        <Row label="Subtotal" value={`${summary.subtotal}`} />
        <Row label="Delivery Charge" value={`${summary.deliveryCharge}`} />
        {/* <Row label="TAX (8%)" value={`${summary.tax}`} /> */}

        {summary.couponDiscount > 0 && <Row label="Coupon" value={`-${summary.couponDiscount} BDT`} />}

        <div className="bg-border my-4 h-px w-full" />

        <div className="p-text-16 flex items-center justify-between leading-5 font-semibold text-black">
          <span>Total</span>
          <span className="p-text-20">{summary.total} BDT</span>
        </div>
      </div>
      {isRefundEligible(status, payment.status) && (
        <div className="pt-3 md:pt-5 xl:pt-7.5">
          <Button onClick={() => setRefundModalOpen(true)} variant="black" className="max-md:w-full" disabled={hasRefunded}>
            {hasRefunded ? "Requested for refund" : "Request for refund"}
          </Button>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className="p-text-18 font-normal">{Number(value) === 0 ? "Free" : `${value} BDT`}</span>
  </div>
);

export default memo(OrderSummaryCardLG);
