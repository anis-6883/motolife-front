"use client";

import { updateCustomer } from "@/actions/admin/customer-management/customer-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useFormSheet } from "@/context/FormSheetContext";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { CustomerDetailsSheet } from "./CustomerDetailsSheet";
import { WishlistModal } from "./WishlistModal";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CustomerStatus = "active" | "partially_banned" | "banned";
export type TAdress = {
  _id: string;
  title: string;
  address: string;
  district: string;
  thana: string;
  area: string;
  zipCode: string;
}[];
export type TPayment = {
  methodType: string;
  isDefault: boolean;
  _id: string;
  phone: number;
}[];
export interface CustomerProfile {
  _id: string;
  name: string;
  phone: string;
  email: string;
  image?: string;
  status: CustomerStatus;
  addressCount: number;
  paymentMethods: TPayment;
  addresses: TAdress;
  paymentMethodCount: number;
  wishlistCount: number;
  totalPoints: number;
  availablePoints: number;
}

interface CustomerProfileCardProps {
  customer: CustomerProfile;
  wishlist?: any[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<CustomerStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-emerald-500 text-white",
  },
  partially_banned: {
    label: "Partially Banned",
    className: "bg-gray-400 text-white",
  },
  banned: {
    label: "Banned",
    className: "bg-red-500 text-white",
  },
};

/** Formats large numbers: 1020000 → "1.02 M", 10200 → "10.2 K" */
const formatPoints = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)} M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)} K`;
  return value.toString();
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatBox({ value, label, buttonLabel, onClick }: { value: number; label: string; buttonLabel: string; onClick?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3">
      <span className="text-2xl font-bold text-blue-500">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
      <Button type="button" size="sm" onClick={onClick} className="rounded-full bg-gray-900 px-4 text-xs text-white hover:bg-gray-700">
        {buttonLabel}
      </Button>
    </div>
  );
}

function PointsBox({ value, label, colorClass, bgClass }: { value: number; label: string; colorClass: string; bgClass: string }) {
  return (
    <div className={`${bgClass} flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-4 py-3`}>
      <span className={`text-2xl font-bold ${colorClass}`}>{formatPoints(value)}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CustomerProfileCard({ customer, wishlist = [] }: CustomerProfileCardProps) {
  const statusStyle = statusConfig[customer.status];
  const otherStatuses = (Object.keys(statusConfig) as CustomerStatus[]).filter((s) => s !== customer.status);
  const [type, setType] = useState<"address" | "payment" | "wishlist">("address");
  const { isOpen, closeSheet, openSheet } = useFormSheet();
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const onViewAddress = () => {
    setType("address");
    openSheet();
  };
  const onViewPayment = () => {
    setType("payment");
    openSheet();
  };
  const onViewWishlist = () => {
    setType("wishlist");
    openSheet();
  };
  return (
    <div className="flex w-full items-stretch gap-3">
      {/* ── Profile Info Card ── */}
      <CustomerDetailsSheet closeSheet={closeSheet} isOpen={isOpen} customerProfile={customer} type={type} />
      <div className="flex min-w-0 flex-[2] items-center gap-4 rounded-xl border bg-gray-50 px-5 py-4">
        {/* Avatar */}
        <Avatar className="h-16 w-16 shrink-0 border-2 border-white shadow-sm">
          <AvatarImage src={customer.image} className="object-cover" />
          <AvatarFallback className="bg-gray-200 text-lg font-semibold text-gray-500">{getInitials(customer.name)}</AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>

            {/* Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`${statusStyle?.className} flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium transition-opacity hover:opacity-90`}
                >
                  {statusStyle?.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-32">
                {otherStatuses.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={async () => {
                      const response = await updateCustomer(customer._id, { accountStatus: s });
                      if (!response.data.error as any) {
                        toast.success("Status update successful");
                      } else {
                        toast.error(response.data.error);
                      }
                    }}
                    className="capitalize"
                  >
                    {statusConfig[s].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm text-gray-500">{customer.phone}</p>
          <p className="text-sm text-gray-500">{customer.email}</p>
        </div>
      </div>

      {/* ── Stat Boxes ── */}
      <StatBox value={customer.addressCount} label="Address Saved" buttonLabel="View Address" onClick={() => onViewAddress()} />
      {/* <StatBox value={customer.paymentMethodCount} label="Payment Methods" buttonLabel="View Methods" onClick={() => onViewPayment?.()} /> */}
      <StatBox value={wishlist?.length || 0} label="Wishlist Products" buttonLabel="View Wishlist" onClick={() => setWishlistOpen(true)} />

      {/* ── Points Boxes ── */}
      {/* <div className="flex flex-col gap-2">
        <PointsBox value={customer.totalPoints} label="Total Points" colorClass="text-blue-500" bgClass="bg-blue-50" />
        <PointsBox value={customer.availablePoints} label="Available Points" colorClass="text-green-500" bgClass="bg-green-50" />
      </div> */}

      <WishlistModal isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} wishlist={wishlist} />
    </div>
  );
}
