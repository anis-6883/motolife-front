"use client";

import { updateOrderById } from "@/actions/order-management/order-actions";
import SellerCard from "@/components/admin/order-management/order-details/SellerCard";
import SpecialDiscountModal from "@/components/admin/order-management/order-details/SpecialDiscountModal";
import ActivityLogs from "@/components/admin/shared/ActivityLogs";
import { Icons } from "@/components/icons";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ORDER_ACTIVITY_LOG_TYPE, ORDER_STATUS } from "@/config/constant";
import { IAdminUserList, IOrderDetail } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pencil, Save, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Address {
  title?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  thana?: string;
  area?: string;
  district?: string;
  zipCode?: string;
}

interface PaymentInfo {
  method?: string;
  status?: string;
  amountPaid?: number;
  currency?: string;
}

interface Seller {
  _id?: string;
  name?: string;
  store?: { storeName?: string; logoImage?: string };
}

interface OrderItem {
  _id?: string;
  productName?: string;
  thumbnail?: string;
  quantity?: number;
  unitPrice?: number;
  sellingPrice?: number;
  discountPrice?: number;
  totalPrice?: number;
  seller?: Seller;
  sku?: string;
}

interface Customer {
  _id?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  addresses?: Address[];
}

interface Order {
  _id?: string;
  orderId?: string;
  customer?: Customer;
  items?: OrderItem | OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  payment?: PaymentInfo;
  subtotal?: number;
  shippingFee?: number;
  tax?: number;
  discount?: number;
  total?: number;
  status?: string;
  customerNote?: string;
  totalItems?: number;
  totalQuantity?: number;
  sellers?: Seller[];
  createdAt?: string;
  updatedAt?: string;
  specialDiscount?: {
    discountType: "flat" | "percentage";
    discountValue: number;
    reason?: string;
  };
}

interface OrderDetailsClientProps {
  order: IOrderDetail; // Add the updateCustomer hook as prop
  adminList: IAdminUserList;
  vendorId?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const statusBadgeClass: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  RETURNED: "bg-gray-100 text-gray-700 border-gray-200",
};

const paymentStatusBadgeClass: Record<string, string> = {
  PAID: "bg-green-100 text-green-700 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  FAILED: "bg-red-100 text-red-700 border-red-200",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCurrency(amount?: number, currency = "BDT") {
  if (amount === undefined || amount === null) return `0.00 ${currency}`;
  return `${Number(amount).toFixed(2)} ${currency}`;
}

function toTitleCase(str?: string) {
  if (!str) return "—";
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  onEdit,
  isEditing,
  onSave,
  onCancel,
}: {
  title: string;
  onEdit?: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="flex items-center justify-between pb-2">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={onSave}
              className="flex items-center gap-1 text-xs text-green-500 transition-colors hover:text-green-700"
            >
              <Save className="h-3 w-3" />
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1 text-xs text-red-500 transition-colors hover:text-red-700"
            >
              <X className="h-3 w-3" />
              Cancel
            </button>
          </>
        ) : (
          onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1 text-xs text-blue-500 transition-colors hover:text-blue-700"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          )
        )}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  isEditing,
  fieldName,
  onChange,
}: {
  label: string;
  value?: string | null;
  isEditing?: boolean;
  fieldName?: string;
  onChange?: (field: string, value: string) => void;
}) {
  return (
    <div className="flex gap-2 text-sm leading-relaxed">
      <span className="w-20 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-700">:</span>
      {isEditing && fieldName ? (
        <Input
          defaultValue={value || ""}
          onChange={(e) => onChange?.(fieldName, e.target.value)}
          className="h-7 w-full max-w-[250px] text-sm"
        />
      ) : (
        <span className="text-gray-900">{value || "N/A"}</span>
      )}
    </div>
  );
}

function AddressBlock({
  title,
  address,
  onEdit,
  onSave,
  onCancel,
  isEditing,
  onAddressChange,
}: {
  title: string;
  address?: Address;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
  onAddressChange?: (field: string, value: string) => void;
}) {
  return (
    <div>
      <SectionHeader title={title} onEdit={onEdit} isEditing={isEditing} onSave={onSave} onCancel={onCancel} />

      <Separator className="mb-3" />

      <div className="flex flex-col gap-1.5">
        {[
          { label: "Name", value: address?.fullName, fieldName: "fullName" },
          { label: "Phone", value: address?.phone, fieldName: "phone" },
          { label: "Email", value: address?.email, fieldName: "email" },
          { label: "District", value: address?.district, fieldName: "district" },
          { label: "Thana", value: address?.thana, fieldName: "thana" },
          { label: "Area", value: address?.area, fieldName: "area" },
          { label: "Address", value: address?.address, fieldName: "address" },
        ].map(({ label, value, fieldName }, index) => {
          if (!value || value === "undefined") return null;
          return <InfoRow key={index} label={label} value={value} isEditing={isEditing} fieldName={fieldName} onChange={onAddressChange} />;
        })}
        {/* <InfoRow label="Full Name" value={address?.fullName} isEditing={isEditing} fieldName="fullName" onChange={onAddressChange} />

        <InfoRow label="Phone" value={address?.phone} isEditing={isEditing} fieldName="phone" onChange={onAddressChange} />

        <InfoRow label="Email" value={address?.email} isEditing={isEditing} fieldName="email" onChange={onAddressChange} />

        <InfoRow label="District" value={address?.district} isEditing={isEditing} fieldName="district" onChange={onAddressChange} />

        <InfoRow label="Thana" value={address?.thana} isEditing={isEditing} fieldName="thana" onChange={onAddressChange} /> */}

        {/* <InfoRow label="Area" value={address?.area} isEditing={isEditing} fieldName="area" onChange={onAddressChange} /> */}

        {/* <InfoRow label="Zip Code" value={address?.zipCode} isEditing={isEditing} fieldName="zipCode" onChange={onAddressChange} /> */}

        {/* <div className="flex gap-2 text-sm leading-relaxed">
          <span className="w-20 shrink-0 text-gray-500">Address</span>
          <span className="text-gray-700">:</span>

          {isEditing ? (
            <Input
              defaultValue={address?.address || ""}
              onChange={(e) => onAddressChange?.("address", e.target.value)}
              className="h-7 w-full max-w-[250px] text-sm"
            />
          ) : (
            <span className="leading-snug text-gray-900">{address?.address || "N/A"}</span>
          )}
        </div> */}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrderDetailsClient({ order, adminList, vendorId }: OrderDetailsClientProps) {
  const [editingSection, setEditingSection] = useState<"shipping" | "billing" | null>(null);
  const [shippingAddress, setShippingAddress] = useState<Address>(order?.shippingAddress || {});
  const [billingAddress, setBillingAddress] = useState<Address>(order?.billingAddress || {});
  const [orderStatus, setOrderStatus] = useState(order?.status || "PENDING");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [assignedTo, setAssignedTo] = useState(order?.assignedTo);

  const currency = order?.payment?.currency || "BDT";
  const paymentStatus = order?.payment?.status || "PENDING";
  const customerId = order?.customer?._id;
  const orderId = order?._id;

  // Normalise items to always be an array
  const items: OrderItem[] = Array.isArray(order?.items) ? order.items : order?.items ? [order.items] : [];
  const [refetch, setRefetch] = useState(false);
  // Get customer's existing addresses
  const customerAddresses = order?.customer?.addresses || [];

  const handleAddressChange = (section: "shipping" | "billing", field: string, value: string) => {
    if (section === "shipping") {
      setShippingAddress((prev) => ({ ...prev, [field]: value }));
    } else {
      setBillingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveAddress = async (section: "shipping" | "billing") => {
    if (!orderId) {
      toast.error("Order ID not found");
      return;
    }

    setIsUpdating(true);

    try {
      const updatedAddress = section === "shipping" ? shippingAddress : billingAddress;

      const payload = {
        [section === "shipping" ? "shippingAddress" : "billingAddress"]: updatedAddress,
      };

      const response = await updateOrderById(orderId as string, payload);

      if (!response?.data?.error) {
        toast.success(`${section === "shipping" ? "Shipping" : "Billing"} address updated successfully`);

        setEditingSection(null);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update address");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: ORDER_STATUS) => {
    if (!customerId) {
      toast.error("Customer ID not found");
      return;
    }

    setIsUpdating(true);
    try {
      // Use the updateCustomer hook with order status update

      const response = await updateOrderById(order?._id, { status: newStatus });
      setRefetch(!refetch);
      // const response = await updateCustomer(customerId, {
      //   orderStatus: newStatus, // Adjust this field name based on your API
      // });
      if (!response?.data?.error) {
        setOrderStatus(newStatus);
        toast.success("Order status updated successfully");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = (section: "shipping" | "billing") => {
    if (section === "shipping") {
      setShippingAddress(order?.shippingAddress || {});
    } else {
      setBillingAddress(order?.billingAddress || {});
    }
    setEditingSection(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-[400fr_1145fr]">
        {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
        <div className="flex shrink-0 flex-col gap-5">
          {/* Order & Shipping Info */}
          <div className="rounded-xl border bg-white p-5">
            <SectionHeader title="Order & Shipping Info" />
            <Separator className="mb-4" />
            <div className="flex flex-col gap-2">
              {/* Order Status */}
              <p className="text-sm font-medium text-gray-700">Order Status</p>
              <Select defaultValue={orderStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {toTitleCase(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <p className="text-sm font-medium text-gray-700">Assigned To</p>
              <div className="relative mb-4">
                <Select
                  value={assignedTo}
                  disabled={isUpdating}
                  onValueChange={async (val) => {
                    if (!val || val === assignedTo) return;

                    try {
                      setIsUpdating(true);

                      const response = await updateOrderById(order?._id, {
                        assignedTo: val,
                      });

                      if (response?.data) {
                        setAssignedTo(val);
                      }
                    } finally {
                      setIsUpdating(false);
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

              {/* Shipping Partner */}
              <p className="text-sm font-medium text-gray-700">Shipping Partner</p>
              <div className="flex items-center gap-2">
                <Icons.SeteadFastIcon className="size-7.5!" />
                <span className="p-text-18 font-semibld">Steadfast</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border bg-white p-5">
            <AddressBlock
              title="Shipping Address"
              address={shippingAddress}
              isEditing={editingSection === "shipping"}
              onEdit={() => setEditingSection("shipping")}
              onSave={() => handleSaveAddress("shipping")}
              onCancel={() => handleCancelEdit("shipping")}
              onAddressChange={(field, value) => handleAddressChange("shipping", field, value)}
            />
          </div>

          {/* Billing Address */}
          <div className="rounded-xl border bg-white p-5">
            <AddressBlock
              title="Billing Address"
              address={billingAddress}
              isEditing={editingSection === "billing"}
              onEdit={() => setEditingSection("billing")}
              onSave={() => handleSaveAddress("billing")}
              onCancel={() => handleCancelEdit("billing")}
              onAddressChange={(field, value) => handleAddressChange("billing", field, value)}
            />
          </div>

          {/* Customer Info */}
          <div className="rounded-xl border bg-white p-5">
            <SectionHeader title="Customer Info" />
            <Separator className="mb-3" />
            <div className="flex flex-col gap-1.5">
              {order?.customer?.fullName && <InfoRow label="Name" value={order?.customer?.fullName} />}
              {order?.customer?.phone && <InfoRow label="Phone" value={order?.customer?.phone} />}
              {order?.customer?.email && <InfoRow label="Email" value={order?.customer?.email} />}
            </div>
          </div>

          {/* Customer Note */}
          {order?.customerNote && (
            <div className="rounded-xl border bg-white p-5">
              <SectionHeader title="Customer Note" />
              <Separator className="mb-3" />
              <p className="text-sm leading-relaxed text-gray-700">{order.customerNote}</p>
            </div>
          )}

          {/* Seller Info */}
          {!vendorId ? (
            <div className="rounded-lg border border-gray-100 bg-white p-5">
              <h3 className="p-text-20 mb-4 border-b pb-2.5 font-semibold">Seller Info</h3>
              <div className="md:space-y-4">
                {order?.sellers.map((seller, index) => (
                  <SellerCard key={index} seller={seller} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {/* Order Header */}
          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order #{order?.orderId}</h2>
                <p className="mt-1 text-sm text-gray-500">{formatDate(order?.createdAt)}</p>
              </div>
              {/* <Button variant="default" size="sm" className="flex shrink-0 items-center gap-2 bg-gray-900 hover:bg-gray-700">
              <Download className="h-4 w-4" />
              Download Invoice
            </Button> */}
            </div>

            {/* Status row */}
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-36 text-gray-500">Status</span>
                <span className="text-gray-700">:</span>
                <Badge variant="outline" className={cn("font-medium", statusBadgeClass[orderStatus] ?? statusBadgeClass["PENDING"])}>
                  {toTitleCase(orderStatus)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-36 text-gray-500">Payment Method</span>
                <span className="text-gray-700">:</span>
                <span className="font-medium text-gray-900">{toTitleCase(order?.payment?.method)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-36 text-gray-500">Payment Status</span>
                <span className="text-gray-700">:</span>
                <Badge
                  variant="outline"
                  className={cn("font-medium", paymentStatusBadgeClass[paymentStatus] ?? paymentStatusBadgeClass["PENDING"])}
                >
                  {toTitleCase(paymentStatus)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-hidden rounded-xl border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="w-10 px-4 py-3 font-semibold text-gray-700">SL</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Product Details</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Vendor</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Qty</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Selling Price</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Discount Price</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No items found
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={item._id ?? idx} className="border-b transition-colors last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.thumbnail ? (
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                              <Image
                                src={item.thumbnail}
                                alt={item.productName ?? "product"}
                                fill
                                className="object-cover"
                                crossOrigin="anonymous"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 shrink-0 rounded-lg border bg-gray-100" />
                          )}
                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate font-medium text-gray-900">{item.productName ?? "—"}</p>
                            <p className="text-xs text-gray-400">Unit Price: {formatCurrency(item.unitPrice, currency)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{item.seller?.store?.storeName ?? item.seller?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{item.quantity ?? 1}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{Number(item.sellingPrice ?? 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{Number(item.discountPrice ?? 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">{Number(item.totalPrice ?? 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t px-4 py-4">
              <div className="ml-auto max-w-xs space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order?.subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{order?.shippingFee ? formatCurrency(order.shippingFee || 0, currency) : "Free"}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>{formatCurrency(order?.tax || 0, currency)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Coupon Discount</span>
                  <span>{formatCurrency(order?.discount || 0, currency)}</span>
                </div>
                {order?.specialDiscount && order?.specialDiscount?.discountValue > 0 && (
                  <div className="border-primary flex justify-between border p-1 text-sm text-gray-600">
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
                <Separator />
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(order?.total, currency)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="p-text-18 font-semibold">Special Discount for Customer</h3>
              <Switch checked={Number(order?.specialDiscount?.discountValue) > 0} onCheckedChange={() => setIsDiscountModalOpen(true)} />
            </div>
            <p className="p-text-16 text-dark-gray font-medium">Apply a manual discount after order confirmation if needed.</p>

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
        </div>
      </div>

      <ActivityLogs resourceId={order._id} resourceType={ORDER_ACTIVITY_LOG_TYPE.ORDER} refetch={refetch} setRefetch={setRefetch} />
      <SpecialDiscountModal open={isDiscountModalOpen} onClose={() => setIsDiscountModalOpen(false)} orderData={order} />
    </div>
  );
}
