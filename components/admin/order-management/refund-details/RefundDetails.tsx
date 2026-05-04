"use client";

import { updateRefundById } from "@/actions/order-management/order-actions";
import { MediaPreviewModal, ReviewMedia } from "@/components/features/public/product-detail/ReviewsTab";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_ACTIVITY_LOG_TYPE, REFUND_ITEM_STATUS, REFUND_STATUS } from "@/config/constant";
import routes from "@/config/routes";
import formatDateToDateString from "@/lib/client-utils";
import { IAdminUserList } from "@/lib/types";
import { Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ActivityLogs from "../../shared/ActivityLogs";
import { SingeListElement } from "../../shared/ProductDetailsAdmin";
import { getRefundStatusStyles } from "../../user-management/vendor/detail/StyleVariants";
import SellerCard from "../order-details/SellerCard";
import { RefundDoc, RefundItem } from "../schema";
import RefundManagementModal from "./RefundApprovalModal";
import RefundPaymentDetailsModal from "./RefundPaymentDetailsModal";

export default function RefundDetails({ refundData, adminList }: { refundData: RefundDoc; adminList: IAdminUserList }) {
  // const [orderStatus, setOrderStatus] = useState(refundData?.status);
  // // const [assignedTo, setAssignedTo] = useState(refundData?.assignedTo);

  // const [statusLoading, setStatusLoading] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState<ReviewMedia | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"approve" | "reject">("approve");
  const [actionType, setActionType] = useState<"refundAll" | "refundPartial" | "rejectAll" | "rejectPartial">("refundAll");
  const [assignedTo, setAssignedTo] = useState(refundData?.assignedTo);

  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RefundItem | null>(null);
  const [paymentDetailsModalOpen, setPaymentDetailsModalOpen] = useState(false);

  const handleRefundAll = () => {
    setActionType("refundAll");
    setModalMode("approve");
    setSelectedItem(null);
    setRefundModalOpen(true);
  };

  const handleRefundPartial = (item: RefundItem) => {
    setActionType("refundPartial");
    setModalMode("approve");
    setSelectedItem(item);
    setRefundModalOpen(true);
  };

  const handleRejectAll = () => {
    setActionType("rejectAll");
    setModalMode("reject");
    setSelectedItem(null);
    setRefundModalOpen(true);
  };

  const handleRejectPartial = (item: RefundItem) => {
    setActionType("rejectPartial");
    setModalMode("reject");
    setSelectedItem(item);
    setRefundModalOpen(true);
  };

  return (
    <>
      <div className="flex gap-5 text-black max-xl:flex-col">
        {/* Left Sidebar */}
        <div className="grid w-full shrink-0 gap-4 md:grid-cols-2 xl:w-72 xl:grid-cols-1 2xl:w-115">
          <div className="flex flex-col rounded-lg border border-gray-100 bg-white p-5">
            <h3 className="p-text-20 mb-4 border-b pb-2.5 font-semibold">Refund Summary</h3>
            <p className="p-text-16 mb-2 leading-5 font-semibold">Assigned To</p>
            <div className="relative mb-4">
              <Select
                value={assignedTo}
                disabled={statusLoading}
                onValueChange={async (val) => {
                  if (!val || val === assignedTo) return;

                  try {
                    setStatusLoading(true);

                    const response = await updateRefundById(refundData?._id, {
                      assignedTo: val,
                    });

                    if (response?.data) {
                      setAssignedTo(val);
                    }
                  } finally {
                    setStatusLoading(false);
                  }
                }}
              >
                <SelectTrigger className="flex w-full items-center justify-between rounded-sm border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 hover:border-gray-300">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>

                <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg">
                  {adminList?.data.map((admin, index) => (
                    <SelectItem key={index} value={admin._id} className="text-sm text-gray-700">
                      {admin?.name ? (
                        <ImageWithFallback
                          fallbackSrc={"/images/placeholders/userPlaceholder.jpg"}
                          src={admin?.image}
                          alt={admin?.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      ) : null}{" "}
                      <div className="flex w-full items-center justify-between">{admin.name}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2 lg:pb-10">
              <SingeListElement label="Refund ID" value={refundData?.refundId} />
              <SingeListElement label="Refund Request Date" value={formatDateToDateString(refundData?.createdAt)} />
              <SingeListElement
                label="Refund Status"
                value={
                  <span
                    className={`p-text-14 inline-flex items-center rounded-md border px-3 py-1 font-semibold uppercase ${getRefundStatusStyles(refundData?.status)}`}
                  >
                    {refundData?.status.replace(/_/g, " ")}
                  </span>
                }
              />
              <SingeListElement label="Order ID" value={refundData?.order?.orderId} />
              <SingeListElement
                label="Refund Method"
                value={
                  refundData?.refundMethod?.methodType ? (
                    <div className="flex flex-1 items-center justify-between">
                      <span>{refundData?.refundMethod?.methodType}</span>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-blue-500 capitalize"
                        onClick={() => setPaymentDetailsModalOpen(true)}
                      >
                        View Details
                      </Button>
                    </div>
                  ) : (
                    "N/A"
                  )
                }
              />
            </div>
            <Link className="w-full" href={`${routes.privateRoutes.admin.orders.view(refundData?.order?._id)}`}>
              <Button variant={"outline-black"} className="w-full rounded-full">
                <Store size={14} />
                View Order Details
              </Button>
            </Link>
          </div>
          {/* Refund Reason */}
          <div className="space-y-3 rounded-lg border border-gray-100 bg-white p-5 md:space-y-5">
            <h3 className="p-text-20 border-b pb-2.5 font-semibold">Refund Reason by Customer</h3>
            <div className="bg-foundation-red w-full rounded-lg p-2">
              <p className="p-text-16 leading-5 font-semibold">{refundData?.refundReason}</p>
            </div>
            <p className="p-text-16 leading-6">{refundData?.details}</p>
            <div className="flex flex-wrap gap-2">
              {refundData?.images?.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedMedia({ src: item, type: "image" });
                    setModalOpen(true);
                  }}
                  className="group relative size-16 cursor-pointer overflow-hidden rounded-lg border md:size-12.5"
                >
                  <ImageWithFallback src={item} fallbackSrc="/images/auth/logo.png" alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          {/* Customer Info */}
          <div className="rounded-lg border border-gray-100 bg-white p-5">
            <h3 className="p-text-20 mb-4 border-b pb-2.5 font-semibold">Customer Info</h3>
            <div className="space-y-2.5">
              {[
                { label: "Name", value: refundData?.customer?.fullName },
                { label: "Total Order", value: refundData?.customer?.totalOrders },
                { label: "Phone", value: refundData?.customer?.phone },
                { label: "Email", value: refundData?.customer?.email },
              ].map(({ label, value }) => (
                <div key={label} className="p-text-16 flex items-start gap-2">
                  <span className="text-dark-gray w-16 shrink-0 pt-0.5 lg:w-20 2xl:w-41">{label}</span>
                  <span className="leading-5 font-semibold">: {value ?? "N/A"}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Seller Info */}
          {refundData?.order?.sellers ? (
            Array.isArray(refundData?.order?.sellers) ? (
              <div className="rounded-lg border border-gray-100 bg-white p-5">
                <h3 className="p-text-20 mb-4 border-b pb-2.5 font-semibold">Seller Info</h3>
                {refundData?.order?.sellers?.map((seller, index) => (
                  <SellerCard key={index} seller={seller} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-100 bg-white p-5">
                <h3 className="p-text-20 mb-4 border-b pb-2.5 font-semibold">Seller Info</h3>
                <SellerCard seller={refundData?.order?.sellers} />
              </div>
            )
          ) : null}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4 max-xl:order-first">
          <div className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-5 flex items-start justify-between gap-y-3 max-lg:flex-col">
              <h2 className="p-text-24 -tracking-[0.24px]">Product Details</h2>
              <div className="flex gap-2.5">
                <Button
                  variant={"outline-primary"}
                  className="rounded-full"
                  onClick={handleRejectAll}
                  disabled={refundData.status !== REFUND_STATUS.PENDING}
                >
                  Reject All
                </Button>
                <Button
                  variant={"black"}
                  className="rounded-full"
                  onClick={handleRefundAll}
                  disabled={refundData.status === REFUND_STATUS.REFUNDED}
                >
                  Refund All
                </Button>
              </div>
            </div>
            <div className="scrollbar-none max-w-full overflow-hidden overflow-x-scroll rounded-xl border border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Product Details", "Vendor", "Qty", "Total Price", "Status", "Action"].map((h) => (
                      <th key={h} className={`p-text-16 px-2 py-3 text-center font-semibold text-gray-500 lg:px-4`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {refundData?.items?.map((item) => (
                    <tr key={item?.product} className="capitalize transition-colors hover:bg-gray-50/50">
                      <td className="px-2 py-3.5 lg:px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                            <ImageWithFallback
                              fallbackSrc="/images/auth/logo.png"
                              src={item.thumbnail}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="leading-tight">{item.productName}</p>
                            <p className="p-text-14 text-light-gray mt-0.5 font-medium">Unit Price: {item.unitPrice}.00 BDT</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3.5 lg:px-4">{item?.seller?.store?.storeName || "Motolife"}</td>
                      <td className="px-2 py-3.5 text-center lg:px-4">
                        <span className="bg-light-gray/20 rounded-sm px-2 py-1">{item.quantity}</span>
                      </td>
                      <td className="px-2 py-3.5 text-right lg:px-4">{item?.totalPrice?.toFixed(2)}</td>
                      <td className="px-2 py-3.5 text-right lg:px-4">
                        <span
                          className={`p-text-14 inline-flex items-center rounded-md border px-3 py-1 font-semibold uppercase ${getRefundStatusStyles(item?.status)}`}
                        >
                          {item?.status?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-2 py-3.5 text-right lg:px-4">
                        <div className="flex gap-2.5">
                          <Button
                            disabled={item.status !== REFUND_ITEM_STATUS.PENDING}
                            variant={"black"}
                            onClick={() => handleRefundPartial(item)}
                          >
                            Refund
                          </Button>
                          <Button
                            disabled={item.status !== REFUND_ITEM_STATUS.PENDING}
                            variant={"outline-primary"}
                            onClick={() => handleRejectPartial(item)}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="p-text-16 w-64 space-y-2.5 font-semibold lg:w-110 xl:space-y-4">
                {[
                  { label: "Subtotal", value: `${refundData?.totalAmount?.toFixed(2)} BDT`, muted: true },
                  //   { label: "Coupon Discount", value: `${(refundData?.discount ?? 0)?.toFixed(2)} BDT`, muted: true },
                  //   { label: "Total Discount", value: `${(refundData?.totalDiscount ?? 0)?.toFixed(2)} BDT`, muted: true },
                  { label: "TAX", value: `${(refundData?.tax ?? 0)?.toFixed(2)} BDT`, muted: true },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-light-gray">{label}</span>
                    <span className="text-dark-gray">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-gray-200 pt-2.5 text-black xl:pt-4">
                  <span>Total Refundable Amount</span>
                  <span>{refundData?.totalAmount?.toFixed(2)} BDT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MediaPreviewModal open={modalOpen} media={selectedMedia} onClose={() => setModalOpen(false)} />
      {refundModalOpen && (
        <RefundManagementModal
          open={refundModalOpen}
          mode={modalMode}
          actionType={actionType}
          selectedItem={selectedItem}
          refundId={refundData.refundId}
          refund_Id={refundData._id}
          onOpenChange={setRefundModalOpen}
        />
      )}
      <RefundPaymentDetailsModal open={paymentDetailsModalOpen} onOpenChange={setPaymentDetailsModalOpen} refundData={refundData} />
      <ActivityLogs resourceId={refundData._id} resourceType={ORDER_ACTIVITY_LOG_TYPE.REFUND} />
    </>
  );
}
