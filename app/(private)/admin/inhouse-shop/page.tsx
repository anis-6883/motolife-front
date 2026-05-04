import { getInHouseShop, getShopStats } from "@/actions/admin/inhouse-shop/inhouse-shop-actions";
import ShopSettings from "@/components/admin/shop/inhouse-shop/ShopSettings";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";

export const metadata = {
  title: "Shop Settings - In-house Shop",
};

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "In-house Shop", href: routes.privateRoutes.admin.inhouseShop },
];

export default async function ShopSettingsPage() {
  const [shopRes, statsRes] = await Promise.all([getInHouseShop(), getShopStats()]);

  const shop = shopRes?.data?.data ?? shopRes?.data ?? null;
  const stats = statsRes?.data?.data ?? statsRes?.data ?? null;

  return (
    <BreadcrumbWrapper title="In-house Shop" description="Manage your in-house shop settings and preferences.">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <ShopSettings shop={shop} stats={stats} />
    </BreadcrumbWrapper>
  );
}
