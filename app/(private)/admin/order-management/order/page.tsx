import { getAdminList } from "@/actions/admin/profile-actions";
import { getOrders, getOrderStats } from "@/actions/order-management/order-actions";
import { getVendors } from "@/actions/user-management/vendor-actions";
import OrderTable from "@/components/admin/order-management/OrderTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Order" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Order",
  description: "Maintain your vendor list.",
});
type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export default async function OrderPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const flatParams: Record<string, string> = {};

  Object.entries(params || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      flatParams[key] = value[0];
    } else if (value !== undefined) {
      flatParams[key] = value;
    }
  });

  const [
    {
      data: { data },
    },
    {
      data: { data: adminList },
    },
    {
      data: { data: vendorList },
    },
    {
      data: { data: orderStats },
    },
  ] = await Promise.all([
    // getActivityLog(ORDER_ACTIVITY_LOG_TYPE.ORDER, id),
    getOrders(flatParams),
    getAdminList(),
    getVendors({}),
    getOrderStats(),
  ]);

  return (
    <BreadcrumbWrapper title="Manage Order" description="Maintain your order list 🧭">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <OrderTable data={data || []} adminList={adminList} vendorList={vendorList.docs} orderStats={orderStats} />
    </BreadcrumbWrapper>
  );
}
