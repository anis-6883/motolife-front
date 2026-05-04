import { getOffersListById, getProductsListById } from "@/actions/admin/offers-management/offers-actions";
import FlashSaleProductForm from "@/components/admin/offers-management/offers/FlashSaleProductForm";
import OffersProductDataTable from "@/components/admin/offers-management/offers/OffersProductDataTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Offers", href: routes.privateRoutes.admin.offerAndDealsManagement.offerList.home },
  { label: "Offer products List" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Offer Products List",
  description: "Maintain your Offer Products List",
});

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sParams = await searchParams;

  const flatParams: Record<string, string> = {};

  Object.entries(sParams || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      flatParams[key] = value[0];
    } else if (value !== undefined) {
      flatParams[key] = String(value);
    }
  });

  const {
    data: { data: offersData },
  } = await getProductsListById(id);
  const {
    data: { data: offerListData },
  } = await getOffersListById(id, flatParams);

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper title="Offer Products List" description="Maintain your Offer Products List">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <FlashSaleProductForm sale={offersData} id={id} offerList={offerListData || {}} />
        <OffersProductDataTable data={offerListData || {}} id={id} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
