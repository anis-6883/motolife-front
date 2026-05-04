"use client";

import { updateOrderById } from "@/actions/order-management/order-actions";
import { Icons } from "@/components/icons";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ORDER_ACTIVITY_LOG_TYPE, ORDER_STATUS, ORDER_STATUS_OPTIONS } from "@/config/constant";
import routes from "@/config/routes";
import { formatDate } from "@/lib/client-utils";
import { IAdminUserList, IOrderAddress, IOrderDetail } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ActivityLogs from "../../shared/ActivityLogs";
import { orderStatusStyles, orderStatusTextStyles } from "../../user-management/vendor/detail/StyleVariants";
import SellerCard from "./SellerCard";
import SpecialDiscountModal from "./SpecialDiscountModal";

export function AddressBlock({ data }: { data: IOrderAddress }) {
  return (
    <div className="space-y-2.5">
      {[
        { label: "Name", value: data?.fullName },
        { label: "Phone", value: data?.phone },
        { label: "Email", value: data?.email },
        { label: "District", value: data?.district },
        { label: "Thana", value: data?.thana },
        { label: "Area", value: data?.area },
        { label: "Address", value: data?.address },
      ].map(({ label, value }) => {
        if (!value || value === "undefined") return null;
        return (
          <div key={label} className="p-text-16 flex items-start gap-2">
            <span className="text-dark-gray w-16 shrink-0 pt-0.5 lg:w-20 2xl:w-41">{label}</span>
            <span className="leading-5 font-semibold">: {value}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetails({
  orderData,
  adminList,
  vendorId,
}: {
  orderData: IOrderDetail;
  vendorId?: string;

  adminList: IAdminUserList;
}) {
  const [orderStatus, setOrderStatus] = useState(orderData?.status);
  const [assignedTo, setAssignedTo] = useState(orderData?.assignedTo);

  const [statusLoading, setStatusLoading] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const order = orderData;

  return (
    <>
      <div className="flex gap-5 text-black max-xl:flex-col">
        {/* Left Sidebar */}
        <div className="grid w-full shrink-0 gap-4 md:grid-cols-2 xl:w-72 xl:grid-cols-1 2xl:w-115">
          <div className="rounded-lg border border-gray-100 bg-white p-5">
            <h3 className="p-text-20 mb-4 border-b pb-2.5 font-semibold">Order &amp; Shipping Info</h3>

            <p className="p-text-16 mb-2 leading-5 font-semibold">Order Status</p>
            <div className="relative mb-4">
              <Select
                value={orderStatus}
                disabled={statusLoading}
                onValueChange={async (val) => {
                  if (!val || val === orderStatus) return;
                  try {
                    setStatusLoading(true);

                    const response = await updateOrderById(order?._id, {
                      status: val as ORDER_STATUS,
                    });

                    if (response?.data) {
                      setOrderStatus(val as ORDER_STATUS);
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
                  {ORDER_STATUS_OPTIONS.map((status, index) => (
                    <SelectItem key={index} value={status.value} className="text-sm text-gray-700">
                      <div className="flex w-full items-center justify-between">{status.label.replace(/_/g, " ")}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="p-text-16 mb-2 leading-5 font-semibold">Assigned To</p>
            <div className="relative mb-4">
              <Select
                value={assignedTo}
                disabled={statusLoading}
                onValueChange={async (val) => {
                  if (!val || val === assignedTo) return;

                  try {
                    setStatusLoading(true);

                    const response = await updateOrderById(order?._id, {
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
            {/* <p className="p-text-16 mb-2 leading-5 font-semibold">Shipping Method</p>
            <div className="relative mb-4">
              <Select
                value={shippingMethodOptions[0].value}
                onValueChange={(val) => {
                  if (val) {
                    setOrderStatus(val);
                  }
                }}
              >
                <SelectTrigger className="flex w-full items-center justify-between rounded-sm border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 hover:border-gray-300">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>

                <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg">
                  {shippingMethodOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value} className="text-sm text-gray-700">
                      <div className="flex w-full items-center justify-between">{status.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            <p className="p-text-16 text-dark-gray mb-2 leading-6">Shipping Partner</p>
            <div className="flex items-center gap-2">
              <Icons.SeteadFastIcon className="size-7.5!" />
              <span className="p-text-18 font-semibld">Steadfast</span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-5">
            <h3 className="p-text-20 mb-4 border-b pb-2.5 font-semibold">Shipping Address</h3>
            <AddressBlock data={order?.shippingAddress} />
          </div>

          {/* Billing Address */}
          <div className="rounded-lg border border-gray-100 bg-white p-5">
            <h3 className="p-text-20 mb-4 border-b pb-2.5 font-semibold">Billing Address</h3>
            <AddressBlock data={order?.billingAddress} />
          </div>

          {/* Customer Info */}
          <div className="rounded-lg border border-gray-100 bg-white p-5">
            <h3 className="p-text-20 mb-4 border-b pb-2.5 font-semibold">Customer Info</h3>
            <div className="space-y-2.5">
              {[
                { label: "Name", value: order?.customer?.fullName },
                { label: "Total Order", value: order?.customer?.totalOrders },
                { label: "Phone", value: order?.customer?.phone },
                { label: "Email", value: order?.customer?.email },
              ].map(({ label, value }) => (
                <div key={label} className="p-text-16 flex items-start gap-2">
                  <span className="text-dark-gray w-16 shrink-0 pt-0.5 lg:w-20 2xl:w-41">{label}</span>
                  <span className="leading-5 font-semibold">: {value}</span>
                </div>
              ))}
            </div>
          </div>
          {!vendorId ? (
            <div className="rounded-lg border border-gray-100 bg-white p-5">
              <h3 className="p-text-20 mb-4 border-b pb-2.5 font-semibold">Seller Info</h3>
              {order?.sellers.map((seller, index) => (
                <SellerCard key={index} seller={seller} />
              ))}
            </div>
          ) : null}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4 max-xl:order-first">
          {/* Order Header */}
          <div className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-5 flex items-start justify-between gap-y-3 max-lg:flex-col">
              <div className="font-semibold">
                <h2 className="p-text-24 -tracking-[0.24px]">Order #{order?.orderId}</h2>
                <p className="p-text-16 text-light-gray mt-2.5">{formatDate(order?.createdAt)}</p>
              </div>
              <div className="flex gap-3 max-md:w-full max-md:flex-col">
                {vendorId && (
                  <Link className="max-md:w-full" href={`${routes.privateRoutes.admin.orders.view(order._id)}`}>
                    <Button variant={"outline-black"} className="rounded-full max-md:w-full">
                      <Eye size={14} />
                      View Main Order
                    </Button>
                  </Link>
                )}
                {/* <Button variant={"black"} className="rounded-full max-md:w-full">
                  <Download size={14} />
                  Download Invoice
                </Button> */}
              </div>
            </div>
            <div className="py-3 md:py-8 lg:py-10">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-gray-400">:</span>
                <span
                  className={cn(
                    "p-text-14 inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-semibold",
                    orderStatusStyles[order?.status]
                  )}
                >
                  {order?.status.replace(/_/g, " ")}
                </span>
              </div>

              <div className="flex items-center gap-3 capitalize">
                <span className="text-sm text-gray-500">Payment Method</span>
                <span className="text-gray-400">:</span>
                {order?.payment.method.toLowerCase().replace(/_/g, " ")}
              </div>

              <div className="flex items-center gap-3 capitalize">
                <span className="text-sm text-gray-500">Payment Status</span>:
                <span className={cn("bg-transparent", orderStatusTextStyles[order?.payment.status])}>
                  {order?.payment.status.toLowerCase().replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Products Table */}
            <div className="scrollbar-none max-w-full overflow-hidden overflow-x-scroll rounded-xl border border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["SL", "Product Details", "Vendor", "Qty", "Selling Price", "Discount Price", "Total Price"].map((h) => (
                      <th
                        key={h}
                        className={`p-text-16 px-2 py-3 font-semibold text-gray-500 lg:px-4 ${h === "SL" ? "w-10 text-center" : h === "Qty" ? "text-center" : h === "Product Details" ? "text-left" : h === "Vendor" ? "text-left" : "text-right"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order?.items.map((item, idx) => (
                    <tr key={item.product + idx} className="capitalize transition-colors hover:bg-gray-50/50">
                      <td className="px-2 py-3.5 text-center lg:px-4">{idx + 1}</td>
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
                      <td className="px-2 py-3.5 lg:px-4">{item.seller.name}</td>
                      <td className="px-2 py-3.5 text-center lg:px-4">
                        <span className="bg-light-gray/20 rounded-sm px-2 py-1">{item.quantity}</span>
                      </td>
                      <td className="px-2 py-3.5 text-right lg:px-4">{item.sellingPrice?.toFixed(2)}</td>
                      <td className="px-2 py-3.5 text-right lg:px-4">{item.discountPrice?.toFixed(2)}</td>
                      <td className="px-2 py-3.5 text-right lg:px-4">{item.totalPrice?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-4 flex justify-end">
              <div className="p-text-16 w-64 space-y-2.5 font-semibold lg:w-110 xl:space-y-4">
                {[
                  { label: "Subtotal", value: `${order?.subtotal.toFixed(2)} BDT`, muted: true },
                  { label: "Delivery Charge", value: `${order?.shippingFee.toFixed(2)} BDT`, muted: true },
                  { label: "Coupon Discount", value: `${order?.discount.toFixed(2)} BDT`, muted: true },
                  { label: "TAX", value: `${order?.tax.toFixed(2)} BDT`, muted: true },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-light-gray">{label}</span>
                    <span className="text-dark-gray">{value}</span>
                  </div>
                ))}
                {order?.specialDiscount && order?.specialDiscount?.discountValue > 0 && (
                  <div className="border-primary flex justify-between border p-1 text-sm">
                    <span className="text-light-gray">Special Discount</span>
                    <span className="text-dark-gray">
                      -
                      {order.specialDiscount.discountType === "flat"
                        ? order.specialDiscount.discountValue.toFixed(2)
                        : (
                            ((order.subtotal + order.shippingFee + order.tax - order.discount) * order.specialDiscount.discountValue) /
                            100
                          ).toFixed(2)}{" "}
                      BDT
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2.5 text-black xl:pt-4">
                  <span>Total</span>
                  <span>{order?.total.toFixed(2)} BDT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Discount */}
          <div className="rounded-lg border border-gray-100 bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="p-text-20 font-semibold">Special Discount for Customer</h3>
              <Switch checked={Number(order?.specialDiscount?.discountValue) > 0} onCheckedChange={() => setIsDiscountModalOpen(true)} />
            </div>
            <p className="p-text-18 text-dark-gray font-medium">Apply a manual discount after order confirmation if needed.</p>

            {order?.specialDiscount && order.specialDiscount.discountValue > 0 && (
              <div className="mt-6 space-y-2">
                <p className="p-text-16 font-semibold">
                  Applied Discount:{" "}
                  <span className="text-primary">
                    {order.specialDiscount.discountType === "flat"
                      ? `${order.specialDiscount.discountValue.toFixed(2)} BDT`
                      : `${order.specialDiscount.discountValue}%`}
                  </span>
                </p>
                {order.specialDiscount.reason && (
                  <>
                    <p className="p-text-16 font-semibold">Reason for discount</p>
                    <div className="p-text-16 text-dark-gray w-full rounded-lg border border-gray-100 bg-white p-4 focus:outline-none">
                      {order.specialDiscount.reason}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Customer Note */}
          {/* {order?.customerNote && (
            <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <StickyNote size={13} className="text-amber-600" />
              </div>
              <div>
                <p className="mb-0.5 text-sm font-semibold text-amber-800">Customer Note</p>
                <p className="text-sm text-amber-700">{order?.customerNote}</p>
              </div>
            </div>
          )} */}
        </div>
      </div>

      <ActivityLogs resourceId={order._id} resourceType={ORDER_ACTIVITY_LOG_TYPE.ORDER} />
      <SpecialDiscountModal open={isDiscountModalOpen} onClose={() => setIsDiscountModalOpen(false)} orderData={order} />
    </>
  );
}
