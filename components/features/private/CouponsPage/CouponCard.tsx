"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

interface CouponCardProps {
  title: string;
  subtitle?: string;
  amount: number;
  currency?: string;
  voucherCode: string;
  requiredPoints: number;
  validityDays?: number;
  isLocked?: boolean;
  status?: string;
  expired?: string;
  maxAmount?: string;
  orderId?: string;
  appliedOn?: string;
}

export function CouponCard({
  title = "Gift Voucher",
  subtitle = "1 time use coupon",
  amount,
  currency = "Tk.",
  voucherCode,
  requiredPoints,
  validityDays = 5,
  status,
  expired,
  appliedOn,
  maxAmount,
  orderId,
  isLocked = false,
}: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-2.5 max-lg:flex-col lg:gap-4">
      <div className={`relative flex max-lg:w-full ${status === "expired" && "opacity-60"}`}>
        <div className="relative z-10 aspect-56/34 overflow-hidden rounded-l-xl p-1 max-lg:flex-1 md:px-3.5 md:pt-2.5 md:pb-2 lg:h-34 lg:w-56">
          <ImageWithFallback
            className="relative z-0"
            fallbackSrc="/images/shared/redStamp.png"
            src="/images/shared/redStamp.png"
            alt="Left card bg"
            fill
          />
          <div className="relative z-10 flex h-full flex-col justify-between text-white">
            <div className="">
              <p className="p-text-18 font-semibold">{title}</p>
              <p className="text-[7px] lg:text-[9px]">{subtitle}</p>
            </div>
            <div className="">
              <p className="inline-flex items-baseline gap-1 font-bold">
                {" "}
                <span className="text-24 max-lg:text-[10px] lg:leading-12">{currency}</span>
                <span className="p-text-36 max-lg:text-sm lg:leading-11">{amount}</span>
                <span className="p-text-14 font-medium">Cashback</span>
              </p>
            </div>
          </div>
        </div>
        <div className="relative z-0 aspect-43/34 -translate-x-2 overflow-hidden rounded-r-xl max-lg:flex-1 max-lg:p-4 lg:h-34 lg:w-43">
          <ImageWithFallback
            fallbackSrc="/images/shared/whiteStamp.png"
            src="/images/shared/whiteStamp.png"
            alt="Left card bg"
            fill
            className="relative z-0"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 font-bold">
            <p className="p-text-18 text-primary uppercase">cashback</p>
            <div className="mx-2 rounded-lg border p-1 text-center">
              <p className="p-text-14 text-dark-gray font-semibold">Voucher Code</p>
              <p className="p-text-28 from-primary bg-linear-to-r to-[#EB090D] bg-clip-text text-transparent max-lg:text-sm lg:leading-9">
                {voucherCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Info */}
      <div className="flex h-full flex-col gap-2 py-1 text-right max-lg:w-full max-lg:items-end lg:gap-5">
        {status === "available" ? (
          <div className="p-text-16 leading-6 font-semibold">
            <span>Requires </span>
            <span className="text-primary">{requiredPoints} points</span>
          </div>
        ) : status === "applied" ? (
          <div className="p-text-16 leading-6 font-semibold">
            Order{" #"}
            {orderId}
          </div>
        ) : (
          <p className="p-text-16 text-dark-gray leading-6">was valid for orders above ৳{maxAmount}</p>
        )}

        <div className="">
          {status === "available" ? (
            <Button
              onClick={handleCopyCode}
              disabled={isLocked}
              variant="outline"
              className="border-primary text-primary hover:bg-primary px-2! hover:text-white disabled:opacity-50"
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "COPIED!" : "USE CODE"}
            </Button>
          ) : status === "applied" ? (
            <Button
              onClick={handleCopyCode}
              disabled={true}
              className="bg-light-gray/20 px-2! text-black hover:text-black disabled:opacity-100"
            >
              Applied
            </Button>
          ) : (
            <Button
              onClick={handleCopyCode}
              disabled={true}
              className="bg-light-gray/20 text-primary hover:text-primary px-2! disabled:opacity-100"
            >
              Expired
            </Button>
          )}
        </div>

        {status === "expired" ? (
          <p className="p-text-16 leading-5 font-semibold">Expired on {expired}</p>
        ) : (
          <p className={`p-text-14 leading-5 font-medium ${status === "applied" && "text-dark-gray"}`}>
            {status === "available" ? `Valid for ${validityDays} days after unlock` : `Used on ${appliedOn}`}
          </p>
        )}
      </div>
    </div>
  );
}

export const CouponBadgeSM = ({
  couponData,
}: {
  couponData: { title: string; subtitle?: string; amount: number; currency?: string; voucherCode: string; status?: string };
}) => {
  return (
    <div className={`relative flex max-lg:w-full ${couponData.status === "expired" && "opacity-60"}`}>
      <div className="relative z-10 aspect-56/34 overflow-hidden rounded-l-xl p-1 max-lg:flex-1 md:px-3.5 md:pt-2.5 md:pb-2 lg:h-17 lg:w-30">
        <ImageWithFallback
          className="relative z-0"
          fallbackSrc="/images/shared/redStamp.png"
          src="/images/shared/redStamp.png"
          alt="Left card bg"
          fill
        />
        <div className="relative z-10 flex h-full flex-col justify-between text-white">
          <div className="">
            <p className="text-[9px] font-semibold md:text-xs">{couponData.title}</p>
            <p className="text-[5px] lg:text-[7px]">{couponData.subtitle}</p>
          </div>
          <div className="">
            <p className="inline-flex items-baseline font-semibold">
              {" "}
              <span className="text-[5px] lg:text-[7px] lg:leading-12">{couponData.currency}</span>
              <span className="p-text-14 max-lg:text-sm lg:leading-11">{couponData.amount}</span>
              <span className="text-[5px] font-medium lg:text-[7px]">Cashback</span>
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-0 aspect-43/34 -translate-x-2 overflow-hidden rounded-r-xl max-lg:flex-1 max-lg:p-4 lg:h-17 lg:w-22">
        <ImageWithFallback
          fallbackSrc="/images/shared/whiteStamp.png"
          src="/images/shared/whiteStamp.png"
          alt="Left card bg"
          fill
          className="relative z-0"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center font-bold">
          <p className="text-primary text-[7px] uppercase lg:text-[9px]">cashback</p>
          <div className="mx-2 rounded-lg border text-center">
            <p className="text-dark-gray text-[7px] font-semibold">Voucher Code</p>
            <p className="p-text-14 from-primary bg-linear-to-r to-[#EB090D] bg-clip-text text-transparent max-lg:text-sm lg:leading-9">
              {couponData.voucherCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
