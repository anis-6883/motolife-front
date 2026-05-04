"use client";

import { Package, PackageCheck, PackageSearch, PackageX } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderStats {
  totalOrder: number;
  ongoing: number;
  complete: number;
  cancelled: number;
}

interface OrderStatsBannerProps {
  stats: OrderStats;
}

// ─── Stat Config ──────────────────────────────────────────────────────────────

const statConfig = [
  {
    key: "totalOrder" as const,
    label: "Total Order",
    icon: Package,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    valueColor: "text-yellow-500",
  },
  {
    key: "ongoing" as const,
    label: "Ongoing",
    icon: PackageSearch,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-400",
    valueColor: "text-blue-500",
  },
  {
    key: "complete" as const,
    label: "Complete",
    icon: PackageCheck,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    valueColor: "text-green-600",
  },
  {
    key: "cancelled" as const,
    label: "Cancelled",
    icon: PackageX,
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
    valueColor: "text-red-500",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderStatsBanner({ stats }: OrderStatsBannerProps) {
  return (
    <div className="flex w-full items-center rounded-xl border bg-white px-2 py-4">
      {statConfig.map((stat, index) => {
        const Icon = stat.icon;
        const value = stats[stat.key];
        const isLast = index === statConfig.length - 1;

        return (
          <div key={stat.key} className="flex flex-1 items-center">
            {/* Stat Item */}
            <div className="flex flex-1 items-start gap-3 px-4">
              {/* Icon */}
              <div className={`${stat.iconBg} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl`}>
                <Icon className={`${stat.iconColor} h-5 w-5`} strokeWidth={1.5} />
              </div>

              {/* Label + Value */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                <span className={`text-xl font-bold ${stat.valueColor}`}>{value}</span>
              </div>
            </div>

            {/* Divider */}
            {!isLast && <div className="h-10 w-px shrink-0 bg-gray-200" />}
          </div>
        );
      })}
    </div>
  );
}
