import { Icons } from "@/components/icons";
import { ShopInfo as ShopInfoType, ShopStats } from "@/types/shop";
import { Verified } from "lucide-react";
import Image from "next/image";

interface ShopInfoProps {
  shop: ShopInfoType;
  stats: ShopStats | null;
}

export default function ShopInfo({ shop, stats }: ShopInfoProps) {
  console.log("ShopInfo render", { shop, stats });
  const statCards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: <Icons.ClockFadingIcon className="text-secondary" />,
      color: "border-l-secondary",
      bg: "bg-secondary/10",
      iconColor: "text-secondary/80",
      valueColor: "text-secondary",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: <Icons.Package className="text-blue-dark" />,
      color: "border-l-blue-dark",
      bg: "bg-blue-dark/10",
      iconColor: "text-blue-dark/80",
      valueColor: "text-blue-dark",
    },
    {
      label: "Total Reviews",
      value: stats?.totalReviews ?? 0,
      icon: <Icons.NoteCheck className="text-green-dark" />,
      color: "border-l-green-dark",
      bg: "bg-green-dark/10",
      iconColor: "text-green-dark/80",
      valueColor: "text-green-dark",
    },
  ];

  return (
    <div className="mt-1 flex flex-wrap items-center gap-4">
      {/* Logo */}
      <div className="-mt-1 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-md">
        {shop?.store?.logoImage ? (
          <Image src={shop.store.logoImage} alt="Logo" width={56} height={56} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span className="px-1 text-center text-xs leading-tight font-bold text-gray-500">
            {shop?.store?.storeName?.slice(0, 2).toUpperCase() ?? "BD"}
          </span>
        )}
      </div>

      {/* Store name + verified badge */}
      <div className="flex min-w-[130px] items-center gap-1.5">
        <span className="text-base font-bold text-gray-900">{shop?.store?.storeName || "—"}</span>
        {shop?.verificationStatus === "verified" && <Verified className="h-4 w-4 text-blue-500" />}
      </div>

      {/* Vertical divider */}
      <div className="hidden h-10 w-px bg-gray-200 sm:block" />

      {/* Stat cards */}
      <div className="grid w-full flex-1 grid-cols-3 gap-5">
        {statCards.map(({ label, value, icon, bg, iconColor, color, valueColor }) => (
          <div key={label} className={`relative overflow-hidden rounded-2xl border border-l-4 bg-white p-5 ${bg} ${color}`}>
            <div className={`mb-4 flex size-15 items-center justify-center rounded-full p-3.5 ${bg} ${iconColor}`}>{icon}</div>
            <div className="flex items-center justify-between">
              <p className="p-text-18 mb-1 font-semibold">{label}</p>
              <p className={`p-text-30 font-bold tracking-tight ${valueColor}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
