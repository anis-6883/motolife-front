import { getInHouseShop } from "@/actions/admin/inhouse-shop/inhouse-shop-actions";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import EditShopInformation from "./InhouseShopEditForm";

export default async function ShopSettingsPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
    { label: "In-house Shop", href: routes.privateRoutes.admin.inhouseShop },
    { label: "Edit", href: routes.privateRoutes.admin.inhouseShopEdit },
  ];

  const res = await getInHouseShop();
  const data = res?.data?.data ?? res?.data ?? null;
  return (
    <BreadcrumbWrapper title="Edit Shop Information" description="Basic information about the shop for your quick review">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <EditShopInformation initialData={data} />
    </BreadcrumbWrapper>
  );
}
