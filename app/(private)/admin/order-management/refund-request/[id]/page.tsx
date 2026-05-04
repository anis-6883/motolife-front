import { getAdminList } from "@/actions/admin/profile-actions";
import { getRefundRequestById } from "@/actions/order-management/order-actions";
import RefundDetails from "@/components/admin/order-management/refund-details/RefundDetails";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Order Management", href: routes.privateRoutes.admin.orderManagement.order.home },
  { label: "Refund Request", href: routes.privateRoutes.admin.orderManagement.refundRequest.home },
  { label: "Refund Details" },
];
export const metadata: Metadata = generatePageMetadata({
  title: "Refund Details",
  description: "View refund request details.",
});
type PageProps = {
  params: Promise<{ id: string }>;
};
export default async function OrderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [
    {
      data: { data: orderData },
    },
    adminList,
  ] = await Promise.all([getRefundRequestById(id), getAdminList()]);

  return (
    <BreadcrumbWrapper title="Order Details" description="Track and review your Motolife order information.">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <RefundDetails refundData={orderData} adminList={adminList.data} />
    </BreadcrumbWrapper>
  );
}
