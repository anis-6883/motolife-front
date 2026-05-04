import { getAdminList } from "@/actions/admin/profile-actions";
import { getOrderById } from "@/actions/order-management/order-actions";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import OrderDetailsClient from "./components/OrderDetailsClient";

type TOrderPageProps = {
  params: Promise<{ id: string; orderId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: TOrderPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return generatePageMetadata({
    title: "Order Details",
    description: `Viewing details for order ${orderId}`,
  });
}

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "User Management", href: routes.privateRoutes.admin.userManagement.customer.home },
  { label: "Customers", href: routes.privateRoutes.admin.userManagement.customer.home },
  { label: "Customers List", href: routes.privateRoutes.admin.userManagement.customer.home },
  { label: "Customers Details", href: "#" },
  { label: "Order Details" },
];

export default async function OrderDetailsPage({ params, searchParams }: TOrderPageProps) {
  const { orderId } = await params;
  const { vendorId } = await searchParams;

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

  console.log({ order: orderData?.data?.data });

  return (
    <BreadcrumbWrapper title="Order Details" description="View the full details of this order">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <div className="mt-6">
        <OrderDetailsClient order={orderData?.data?.data} adminList={adminList.data} vendorId={vendorId as string} />
      </div>
    </BreadcrumbWrapper>
  );
}
