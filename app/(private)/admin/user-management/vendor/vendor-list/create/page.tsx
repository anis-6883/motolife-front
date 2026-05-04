import VendorManagementForm from "@/components/admin/user-management/vendor/VendorManagementForm";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "User Management" },
  { label: "Vendor" },
  { label: "Vendor List", href: routes.privateRoutes.admin.userManagement.vendor.home },
  { label: "Create" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Add New Vendor",
  description: "Add a new vendor 🛵",
});

export default function CreateVendorProductPage() {
  return (
    <BreadcrumbWrapper title="Add New Vendor" description="Add a new vendor 🛵">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <VendorManagementForm />
    </BreadcrumbWrapper>
  );
}
