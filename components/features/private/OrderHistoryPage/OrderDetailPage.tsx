"use client";

import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/config/constant";
import { IOrderDetail } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Store, TriangleAlert } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { OrderCancelModal } from "../../public/checkout/OrderCancelModal";
import { AllStatuses } from "../../public/products/constants";
import { PaymentBriefStatsSection } from "../../public/track-order/PaymentBriefStatsSection";
import { PlainProdCard } from "../../public/track-order/ProductCardPreview";
import { TrackOrderModal } from "../../public/track-order/TrackOrderModal";
import { ORDER_STATUS_UI } from "./DesignVars";
import OrderSummaryCardLG from "./OrderSummaryCardLG";

type Props = {
  order: IOrderDetail;
};

const OrderDetailPage = ({ order }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const openCancel = useCallback(() => setOpenCancelModal(true), []);
  console.log(order.status, "order status");
  // group by vendor
  const vendorGroups = useMemo(() => {
    const groups: Record<string, any> = {};

    order.items.forEach((item: any) => {
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
  const statusColor =
    order.status === AllStatuses.cancel.index
      ? "text-primary"
      : order.status === AllStatuses.delivered.index
        ? "text-green-dark"
        : "text-blue-dark";

  const paymentBriefData = useMemo(() => {
    if (!order) return {};
    return {
      orderId: {
        label: "Order ID",
        value: order.orderId,
      },
      orderDate: {
        label: "Order Date",
        value: new Date(order.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      },
      estdDelivery: {
        label: "Estimated Delivery",
        value: "2 to 3 working days",
        // value: businessSettings?.shippingTimeText || "Not Found",
      },
      total: {
        label: "Total",
        value: `${order.total} BDT`,
      },
      paymentMethod: {
        label: "Payment Method",
        value: `Cash on Delivery`,
      },
    };
  }, [order]) as any;
  const blockedStatuses = [
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.RETURNED,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.FAILED,
  ];
  return (
    <div className="space-y-3 md:space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <h2 className="p-text-24 mb-4 font-semibold">Order Details</h2>
          <Button variant="black" onClick={() => setIsModalOpen(true)}>
            Track order
          </Button>
        </div>

        <p className={cn(ORDER_STATUS_UI[order.status].color, "p-text-18 font-semibold -tracking-[0.18px]")}>
          {ORDER_STATUS_UI[order.status].label}
        </p>
      </div>
      <PaymentBriefStatsSection paymentBriefData={paymentBriefData} />
      <OrderSummaryCardLG
        summary={{
          subtotal: order.subtotal,
          deliveryCharge: order?.shippingFee,
          couponDiscount: order.discount,
          total: order.total,
        }}
        setRefundModalOpen={setRefundModalOpen}
        status={order.status}
        hasRefunded={order.hasRefunded}
        payment={order.payment}
      />
      <div className="space-y-2 md:space-y-2.5">
        {vendorGroups.map((vendor: any) => {
          return (
            <div key={vendor.vendorName} className="mb-4 rounded-lg border p-2 md:p-5">
              <div className="mb-3 flex items-center gap-2 border-b pb-2">
                <Store size={16} />
                <span className="text-muted-foreground font-semibold">{vendor.vendorName}</span>
              </div>

              <div className="space-y-3">
                {vendor.items.map((item: any) => (
                  <PlainProdCard key={item.id} item={item} isDelivered={order.status === AllStatuses.delivered.index} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {blockedStatuses.includes(order.status) ? null : (
        <Button variant="outline-primary" onClick={openCancel}>
          <TriangleAlert />
          cancel order
        </Button>
      )}

      <OrderCancelModal
        open={openCancelModal}
        onOpenChange={setOpenCancelModal}
        orderId={order.orderId}
        items={order.items}
        orderObjId={order._id}
      />
      <TrackOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} status={order.status.toLowerCase()} />
      {/* <RefundRequestModal
        open={refundModalOpen}
        onOpenChange={setRefundModalOpen}
        onSubmit={handleRefundSubmit}
        orderData={sampleOrderData}
      /> */}
    </div>
  );
};

export default OrderDetailPage;
