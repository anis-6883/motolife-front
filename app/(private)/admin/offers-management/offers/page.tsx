import { getOffersList } from "@/actions/admin/offers-management/offers-actions";
import AddNewSaleButton from "@/components/admin/offers-management/offers/AddNewSaleButton";
import OffersDataTable from "@/components/admin/offers-management/offers/OffersDataTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps } from "@/lib/types";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Offers & Deals", href: routes.privateRoutes.admin.offerAndDealsManagement.offerList.home },
  { label: "Offer List" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Offer List",
  description: "Maintain your Offer List.",
});

export default async function page({ searchParams }: PageSearchProps) {
  const search = await searchParams;

  const {
    data: { data },
  } = await getOffersList(search);

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper
        title="Offers & Deals"
        description="Manage your offers for attracting your lead customers 🛒"
        addBtn={<AddNewSaleButton />}
      >
        <DynamicBreadcrumb items={breadcrumbItems} />
        <OffersDataTable data={data || []} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
