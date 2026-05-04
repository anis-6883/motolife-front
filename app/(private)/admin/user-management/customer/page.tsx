import { getCustomerList } from "@/actions/admin/customer-management/get-customer";
import CustomerDataTable from "@/components/admin/customer-management/CustomerDataTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "User Management", href: routes.privateRoutes.admin.userManagement.customer.home },
  { label: "Customers" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Customers",
  description: "Maintain your Customers.",
});
type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export default async function page({ searchParams }: PageProps) {
  const params = await searchParams;

  const flatParams: Record<string, string> = {};
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  Object.entries(params || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      flatParams[key] = value[0];
    } else if (value !== undefined) {
      flatParams[key] = value;
    }
  });

  const {
    data: { data },
  } = await getCustomerList(flatParams);
  return (
    <FormSheetProvider>
      <BreadcrumbWrapper title="Customers" description="Manage your Customers here">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <CustomerDataTable data={data || []} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
