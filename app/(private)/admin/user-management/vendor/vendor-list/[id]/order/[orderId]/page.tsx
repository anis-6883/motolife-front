import { getAdminList } from "@/actions/admin/profile-actions";
import { getOrderById } from "@/actions/order-management/order-actions";
import OrderDetailsClient from "@/app/(private)/admin/user-management/customer/[id]/order/[orderId]/components/OrderDetailsClient";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Order Details",
  description: "View order details.",
});
type PageProps = {
  params: Promise<{ id: string; orderId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export default async function OrderDetailsPage({ params }: PageProps) {
  const { id: vendorId, orderId } = await params;

  const breadcrumbItems = [
    { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
    { label: "User Management" },
    { label: "Vendor" },
    { label: "Vendor List", href: routes.privateRoutes.admin.userManagement.vendor.home },
    { label: "Details", href: routes.privateRoutes.admin.userManagement.vendor.view(vendorId) },
    { label: "Order", href: routes.privateRoutes.admin.userManagement.vendor.view(vendorId) + "?tab=order" },
    { label: "Order Details", href: "#" },
  ];

  const [
    // {
    //   data: { data: activityLogData },
    // },
    orderData,
    adminList,
  ] = await Promise.all([
    // getActivityLog(ORDER_ACTIVITY_LOG_TYPE.ORDER, id),
    vendorId ? getOrderById(orderId, vendorId as string) : getOrderById(orderId),
    getAdminList(),
  ]);

  return (
    <BreadcrumbWrapper title="Order Details" description="Track and review your Motolife order information.">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <div className="mt-6">
        <OrderDetailsClient order={orderData?.data?.data} adminList={adminList.data} vendorId={vendorId as string} />
      </div>
    </BreadcrumbWrapper>
  );
}
