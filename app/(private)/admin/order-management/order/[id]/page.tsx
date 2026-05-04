import { getAdminList } from "@/actions/admin/profile-actions";
import { getOrderById } from "@/actions/order-management/order-actions";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import OrderDetailsClient from "../../../user-management/customer/[id]/order/[orderId]/components/OrderDetailsClient";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Order", href: routes.privateRoutes.admin.orderManagement.order.home },
  { label: "Order Details" },
];
export const metadata: Metadata = generatePageMetadata({
  title: "Order Details",
  description: "View order details.",
});
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export default async function OrderDetailsPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { vendorId } = await searchParams;
  const [
    // {
    //   data: { data: activityLogData },
    // },
    orderData,
    adminList,
  ] = await Promise.all([
    // getActivityLog(ORDER_ACTIVITY_LOG_TYPE.ORDER, id),
    vendorId ? getOrderById(id, vendorId as string) : getOrderById(id),
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
