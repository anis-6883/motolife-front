import { SellerAccountStatus } from "@/config/constant";

export const orderStatusStyles: Record<string, string> = {
  PENDING: "bg-secondary/10 text-secondary border-transparent",
  CONFIRMED: "bg-secondary/10 text-secondary border-transparent",
  PROCESSING: "bg-secondary/10 text-secondary border-transparent",
  SHIPPED: "bg-blue-dark/10 text-blue-dark border-transparent",
  OUT_FOR_DELIVERY: "bg-blue-dark/10 text-blue-dark border-transparent",
  DELIVERED: "bg-green-dark/10 text-green-dark border-transparent",
  CANCELLED: "bg-primary/5 text-primary border-transparent",
  RETURNED: "bg-primary/5 text-primary border-transparent",
  REFUNDED: "bg-primary/5 text-primary border-transparent",
  FAILED: "bg-primary/5 text-primary border-transparent",
};
export const orderStatusTextStyles: Record<string, string> = {
  PENDING: "text-secondary",
  CONFIRMED: "text-secondary",
  PROCESSING: "text-secondary",
  SHIPPED: "text-blue-dark",
  OUT_FOR_DELIVERY: "text-blue-dark",
  DELIVERED: "text-green-dark",
  CANCELLED: "text-primary",
  RETURNED: "text-primary",
  REFUNDED: "text-primary",
  FAILED: "text-primary",
};
export const statusStyles: Record<SellerAccountStatus, string> = {
  [SellerAccountStatus.LIVE]: "bg-gradient-to-b from-green-dark/80 to-green-dark text-white border border-green-dark shadow-inner",
  [SellerAccountStatus.SUSPENDED]: "bg-gradient-to-b from-primary/80 to-primary text-white border border-primary shadow-inner",
  [SellerAccountStatus.INACTIVE]: "bg-gradient-to-b from-gray-400 to-gray-600 text-white border border-gray-500 shadow-inner",
  [SellerAccountStatus.ON_VACATION]: "bg-gradient-to-b from-secondary/80 to-secondary text-white border border-secondary shadow-inner",
};

export const getRefundStatusStyles = (status: string) => {
  const normalizedStatus = status
    ?.replace(/([a-z])([A-Z])/g, "$1_$2") // camelCase → snake_case
    ?.replace(/\s+/g, "_")
    ?.toLowerCase();

  switch (normalizedStatus) {
    case "approved":
    case "refunded":
      return "bg-green-100 text-green-700 border-transparent";

    case "rejected":
      return "bg-red-100 text-red-700 border-transparent";

    case "partially_refunded":
      return "bg-blue-100 text-blue-700 border-transparent";

    case "pending":
    default:
      return "bg-yellow-100 text-yellow-700 border-transparent";
  }
};
