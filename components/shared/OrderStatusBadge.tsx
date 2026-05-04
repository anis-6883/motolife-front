const OrderStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "PENDING":
      return <span className="rounded-sm bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 shadow-sm">Pending</span>;
    case "CONFIRMED":
      return <span className="rounded-sm bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 shadow-sm">Confirmed</span>;
    case "PROCESSING":
      return <span className="rounded-sm bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800 shadow-sm">Processing</span>;
    case "SHIPPED":
      return <span className="rounded-sm bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-800 shadow-sm">Shipped</span>;
    case "OUT_FOR_DELIVERY":
      return <span className="rounded-sm bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800 shadow-sm">Out for Delivery</span>;
    case "DELIVERED":
      return <span className="rounded-sm bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 shadow-sm">Delivered</span>;
    case "CANCELLED":
      return <span className="rounded-sm bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 shadow-sm">Cancelled</span>;
    case "RETURNED":
      return <span className="rounded-sm bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 shadow-sm">Returned</span>;
    case "REFUNDED":
      return <span className="rounded-sm bg-teal-100 px-2 py-1 text-xs font-semibold text-teal-800 shadow-sm">Refunded</span>;
    case "FAILED":
      return <span className="rounded-sm bg-red-200 px-2 py-1 text-xs font-semibold text-red-900 shadow-sm">Failed</span>;
    default:
      return <span className="rounded-sm bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm">Unknown</span>;
  }
};

export default OrderStatusBadge;
