import { ORDER_STATUS } from "@/config/constant";

export const ORDER_STATUS_UI: Record<ORDER_STATUS, { label: string; color: string }> = {
  PENDING: {
    label: "Pending",
    color: "text-secondary",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-blue-600",
  },
  PROCESSING: {
    label: "Processing",
    color: "text-indigo-600",
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-purple-600",
  },
  //   OUT_FOR_DELIVERY: {
  //     label: "Out for delivery",
  //     color: "text-orange-600",
  //   },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-600",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-destructive",
  },
  RETURNED: {
    label: "Returned",
    color: "text-destructive",
  },
  REFUNDED: {
    label: "Refunded",
    color: "text-destructive",
  },
  FAILED: {
    label: "Failed",
    color: "text-destructive",
  },
};
