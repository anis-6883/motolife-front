"use client";

import { trackOrderAction } from "@/actions/customer/order-actions";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "@/config/constant";
import { isRefundEligible } from "@/lib/helpers";
import { VendorGroup } from "@/lib/types";
import { PackageSearch } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OrderCancelModal } from "../checkout/OrderCancelModal";
import { OrderStatusTimeline } from "../checkout/OrderStatusTimeline";
import { AllStatuses, stepsObj } from "../products/constants";
import OrderSummaryCard from "./OrderSummaryCard";
import { PaymentBriefStatsSection } from "./PaymentBriefStatsSection";
import ProductListSection from "./ProductListSection";
import { RefundRequestModal } from "./RefundRequestModal";
import TrackOrderHeader from "./TrackOrderHeader";
import { TrackOrderSkeleton } from "./TrackOrderSkeleton";

const TrackOrderPage = () => {
  const searchParams = useSearchParams();
  const orderId = useMemo(() => searchParams.get("orderId"), [searchParams]);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  // const [businessSettings, setBusinessSettings] = useState<any>(null);

  const fetchOrderDetails = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const [
        orderResponse,
        // businessSettings
      ] = await Promise.all([
        trackOrderAction(id),
        // getBusinessSettings("shipping")
      ]);

      if (orderResponse?.data?.status) {
        setOrderData(orderResponse.data?.data);
        // setBusinessSettings(businessSettings?.data?.data?.shipping);
      } else {
        setOrderData(null);
        // setBusinessSettings(null);
      }
    } catch {
      setOrderData(null);
      // setBusinessSettings(null);
      console.error("An error occurred while fetching order details");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setOrderData(null);
      // setBusinessSettings(null);
      setIsLoading(false);
    }
  }, [orderId, fetchOrderDetails]);

  const currentStatus = useMemo(() => {
    const status = orderData?.status;
    if (!status) return "";

    const mapping: Record<string, string> = {
      [ORDER_STATUS.PENDING]: "pending",
      [ORDER_STATUS.CONFIRMED]: "confirmed",
      [ORDER_STATUS.PROCESSING]: "ready",
      [ORDER_STATUS.SHIPPED]: "shipped",
      // [ORDER_STATUS.OUT_FOR_DELIVERY]: "delivery",
      [ORDER_STATUS.DELIVERED]: "delivered",
      [ORDER_STATUS.CANCELLED]: "cancelled",
      [ORDER_STATUS.RETURNED]: "returned",
      [ORDER_STATUS.REFUNDED]: "refunded",
      [ORDER_STATUS.FAILED]: "failed",
    };

    return mapping[status] || status.toLowerCase();
  }, [orderData]);

  const isExcludedStatus = useMemo(() => {
    if (!orderData) return false;
    // Show not found UI for these statuses for now. Add a comment for changing it later if needed.
    return [
      // ORDER_STATUS.PENDING,
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.RETURNED,
      ORDER_STATUS.REFUNDED,
      ORDER_STATUS.FAILED,
    ].includes(orderData.status);
  }, [orderData]);

  const vendorGroups: VendorGroup[] = useMemo(() => {
    if (!orderData?.items) return [];
    const groups: Record<string, VendorGroup> = {};

    orderData.items.forEach((item: any) => {
      const vendorId = item.seller?._id || "unknown";
      const vendorName = item.seller?.store?.storeName || item.seller?.name || "Unknown Seller";
      if (!groups[vendorId]) {
        groups[vendorId] = { vendorId, vendorName, items: [] };
      }
      // Map API item to UI item format
      groups[vendorId].items.push({
        id: item.product,
        name: item.productName,
        image: item.thumbnail,
        price: item.unitPrice,
        quantity: item.quantity,
        color: item.attributes?.find((a: any) => a.name === "Color")?.value || "",
        size: item.attributes?.find((a: any) => a.name === "Size")?.value || "",
        ...item,
      } as any);
    });

    return Object.values(groups);
  }, [orderData]);

  const openCancel = useCallback(() => setOpenCancelModal(true), []);
  const openRefund = useCallback(() => setRefundModalOpen(true), []);

  const paymentBriefData = useMemo(() => {
    if (!orderData) return {};
    return {
      orderId: {
        label: "Order ID",
        value: orderData.orderId,
      },
      orderDate: {
        label: "Order Date",
        value: new Date(orderData.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      },
      estdDelivery: {
        label: "Estimated Delivery",
        value: "2 to 3 working days",
      },
      total: {
        label: "Total",
        value: `${orderData.total} BDT`,
      },
      paymentMethod: {
        label: "Payment Method",
        value: `Cash on Delivery`,
      },
    };
  }, [orderData]) as any;

  const orderSummary = useMemo(() => {
    if (!orderData) return { subtotal: 0, deliveryCharge: 0, tax: 0, couponDiscount: 0, total: 0 };
    return {
      subtotal: orderData.subtotal,
      deliveryCharge: orderData.shippingFee,
      tax: 0, // Not in API
      couponDiscount: orderData.couponDiscount || 0,
      total: orderData.total,
    };
  }, [orderData]);

  return (
    <div>
      <h1
        className={`p-text-36 leading-6 font-bold -tracking-[0.72px] md:leading-8 lg:leading-10 xl:leading-12 ${orderId ? "" : "text-center"}`}
      >
        Track Order
      </h1>
      {orderId && !isExcludedStatus ? (
        <p className="p-text-18 leading-6">Your order has been confirmed. You can now track you order below.</p>
      ) : null}
      <div className={`${orderId ? "md:pt-8 xl:pt-10" : "pb-20 xl:pb-100"}`}>
        {/* Header */}
        <TrackOrderHeader orderId={orderId} />
        {isLoading && orderId ? (
          <TrackOrderSkeleton />
        ) : orderId && orderData && !isExcludedStatus ? (
          <div className="pt-5 md:py-10 xl:py-20">
            <PaymentBriefStatsSection paymentBriefData={paymentBriefData} />
            <p className="p-text-18 text-dark-gray pt-2 pb-3 md:pt-4 md:pb-7 xl:pt-6 xl:pb-10">
              Current Status :{" "}
              <span className="font-semibold text-black capitalize">{stepsObj[currentStatus]?.label || currentStatus}</span>
            </p>
            <div className="relative">
              <OrderStatusTimeline status={currentStatus} />
            </div>
          </div>
        ) : orderId && !isLoading && (!orderData || isExcludedStatus) ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <PackageSearch className="size-20 text-gray-300" strokeWidth={1.5} />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-800">No Order Found</h3>
              <p className="p-text-16 max-w-md text-gray-500">
                We couldn&apos;t find any order with the ID <span className="font-semibold text-black">&quot;{orderId}&quot;</span>. Please
                check the ID and try again.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {orderId && orderData && !isLoading && !isExcludedStatus ? (
        <div className="grid grid-cols-1 gap-6 pb-10 xl:grid-cols-[1fr_400px] xl:gap-8">
          <ProductListSection
            status={currentStatus}
            vendorGroups={vendorGroups}
            isDelivered={currentStatus === AllStatuses.delivered.index}
            onCancel={openCancel}
          />

          <div>
            <div className="sticky top-40 h-max space-y-4">
              <OrderSummaryCard summary={orderSummary} />

              {isRefundEligible(orderData?.status, orderData?.payment?.status) && (
                <Button onClick={openRefund} variant="black" disabled={orderData?.hasRefunded}>
                  {orderData?.hasRefunded ? "Requested for refund" : "Request for refund"}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {orderData && (
        <OrderCancelModal
          open={openCancelModal}
          onOpenChange={setOpenCancelModal}
          orderId={orderData.orderId}
          items={orderData.items}
          orderObjId={orderData._id}
        />
      )}

      {orderData && <RefundRequestModal open={refundModalOpen} onOpenChange={setRefundModalOpen} orderData={orderData} />}
    </div>
  );
};

export default TrackOrderPage;
