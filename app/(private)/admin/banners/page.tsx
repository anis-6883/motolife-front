import { getAllBannersForAdmin } from "@/actions/admin/banners/banner-management-action";
import BannersTable from "@/components/admin/banners/BannersTable";
import AddButton from "@/components/shared/AddButton";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps } from "@/lib/types";
import { Metadata } from "next";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Banner Setup" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Banner Setup",
  description: "Manage and control all website banners from one place. ",
});

export default async function BannerSetupPage({ searchParams }: PageSearchProps) {
  const search = await searchParams;

  const {
    data: { data },
  } = await getAllBannersForAdmin(search);

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper
        title="Main Section Banner Setup"
        description="Manage and control all website banners from one place."
        addBtn={<AddButton title="Add New Banner" />}
      >
        <DynamicBreadcrumb items={breadcrumbItems} />
        <BannersTable data={data || {}} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
