import { getSupportMailList } from "@/actions/admin/help-support/getSupportMail";
import SupportMailDataTable from "@/components/admin/help-support/SupportMailDataTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps } from "@/lib/types";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.helpAndSUpport.contactMail.home },
  { label: "Help & Support", href: routes.privateRoutes.admin.userManagement.customer.home },
  { label: "Messages" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Customers",
  description: "Maintain your Customers.",
});

export default async function page({ searchParams }: PageSearchProps) {
  const search = await searchParams;

  const {
    data: { data },
  } = await getSupportMailList(search);

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper title="Help & Support" description="">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <SupportMailDataTable data={data || []} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
