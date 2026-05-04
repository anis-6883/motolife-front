import { getVendors } from "@/actions/user-management/vendor-actions";
import VendorDataTable from "@/components/admin/user-management/vendor/VendorDataTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "User Management" },
  { label: "Vendor" },
  { label: "Vendor List" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Manage Vendor",
  description: "Manage vendor accounts and details",
});
type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export default async function VendorPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const flatParams: Record<string, string> = {};

  Object.entries(params || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      flatParams[key] = value[0];
    } else if (key === "status") {
      flatParams.status = value === "active" ? "true" : value === "inactive" ? "false" : "";
    } else if (value !== undefined) {
      flatParams[key] = value;
    }
  });

  const vendorResponse = await getVendors(flatParams);

  return (
    <BreadcrumbWrapper
      title="Manage Vendor"
      description="Manage vendor accounts and details"
      addBtn={
        <Link href={routes.privateRoutes.admin.userManagement.vendor.create}>
          <Button size="sm" className="cool">
            <Plus className="mr-1 h-4 w-4" />
            Add New Vendor
          </Button>
        </Link>
      }
    >
      <DynamicBreadcrumb items={breadcrumbItems} />
      <VendorDataTable data={vendorResponse?.data?.data || []} />
    </BreadcrumbWrapper>
  );
}
