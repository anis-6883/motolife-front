"use client";

import { Button } from "@/components/ui/button";
import { isRefundEligible } from "@/lib/helpers";
import { IOrder, OrderItemType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, ChevronDown, ChevronUp, Copy, Package, Store } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { PlainProdCard } from "../../public/track-order/ProductCardPreview";
import { RefundRequestModal } from "../../public/track-order/RefundRequestModal";
import { ORDER_STATUS_UI } from "./DesignVars";

type Props = {
  order: IOrder;
};

export default function OrderCardItem({ order }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  const openRefund = useCallback(() => setRefundModalOpen(true), []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(order.orderId);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  // group by vendor
  const vendorGroups = useMemo(() => {
    const groups: Record<string, any> = {};

    order.items.forEach((item: OrderItemType) => {
      if (!groups[item.seller._id]) {
        groups[item.seller._id] = {
          vendorName: item.seller.name,
          items: [],
        };
      }
      groups[item.seller._id].items.push(item);
    });

    return Object.values(groups);
  }, [order]);

  const allItems = useMemo(() => vendorGroups.flatMap((v: any) => v.items), [vendorGroups]);

  const visibleIds = new Set((showAll ? allItems : allItems.slice(0, 3)).map((i: any) => i.variantSku));

  return (
    <>
      <div className="rounded-lg border p-4 md:p-6">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between border-b md:pb-4">
          <div className="text-dark-gray p-text-18 flex font-semibold max-md:flex-col max-md:text-xs max-md:leading-tight md:items-center md:gap-3">
            <div className="flex items-center gap-1 md:gap-3">
              <Package size={18} />
              <p className="flex items-center gap-1">
                Order No #{order.orderId}{" "}
                <button
                  onClick={handleCopy}
                  className={cn(
                    "ml-1 flex items-center justify-center rounded-md p-1 transition-all duration-200",
                    copied ? "bg-green-100 text-green-600" : "hover:bg-muted text-muted-foreground hover:text-black"
                  )}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </p>
            </div>
            <div className="bg-muted h-4 w-px max-md:hidden" />
            <p className={cn(ORDER_STATUS_UI[order.status].color, "capitalize")}>{ORDER_STATUS_UI[order.status].label}</p>
          </div>
          <Link href={`/orders/${order.orderId}`}>
            <Button variant={"link"} className="text-black hover:no-underline">
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        {/* VENDORS */}
        {vendorGroups.map((vendor: any) => {
          const visible = vendor.items.filter((i: any) => visibleIds.has(i.variantSku));

          if (!visible.length) return null;

          return (
            <div key={vendor.vendorId} className="mb-4">
              <div className="mb-3 flex items-center gap-2 border-b pb-2">
                <Store size={16} />
                <span className="text-muted-foreground font-semibold">Moto Life</span>
              </div>

              <div className="space-y-3">
                {visible.map((item: any) => (
                  <PlainProdCard key={item.variantSku} item={item} />
                ))}
              </div>
            </div>
          );
        })}

        {/* SHOW MORE */}
        {allItems.length > 3 && (
          <div className="mt-2.5 flex border-t-2 border-dashed">
            <Button variant="link" className={cn("text-blue-dark px-0! hover:no-underline")} onClick={() => setShowAll((p) => !p)}>
              {showAll ? "Show less" : `${allItems.length - 3} products more`}
              {showAll ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        )}

        {isRefundEligible(order?.status, order?.payment?.status) && (
          <Button onClick={openRefund} variant="black" disabled={order.hasRefunded}>
            {order?.hasRefunded ? "Requested for refund" : "Request for refund"}
          </Button>
        )}
      </div>

      {order && <RefundRequestModal open={refundModalOpen} onOpenChange={setRefundModalOpen} orderData={order} />}
    </>
  );
}
