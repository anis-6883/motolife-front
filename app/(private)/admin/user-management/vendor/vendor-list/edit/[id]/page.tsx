import { getVendorById } from "@/actions/user-management/vendor-actions";
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
  { label: "Edit" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Edit Vendor",
  description: "Update vendor details.",
});

export default async function VendorPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { data: vendor } = await getVendorById(id);

  return (
    <BreadcrumbWrapper title="Edit Vendor" description="Update vendor details">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <VendorManagementForm vendor={vendor?.data} />
    </BreadcrumbWrapper>
  );
}
