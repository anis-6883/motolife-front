import { getOffersListById, getProductsListById } from "@/actions/admin/offers-management/offers-actions";
import FlashSaleProductForm from "@/components/admin/offers-management/offers/FlashSaleProductForm";
import OffersProductDataTable from "@/components/admin/offers-management/offers/OffersProductDataTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Offer Products List",
  description: "Maintain your Offer Products List.",
});

type PageProps = {
  params: Promise<{ offerId: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { id: vendorId, offerId } = await params;
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
  } = await getProductsListById(offerId);
  const {
    data: { data: offerLIstData },
  } = await getOffersListById(offerId, { ...flatParams, sellerId: vendorId });

  const breadcrumbItems = [
    { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
    { label: "User Management" },
    { label: "Vendor" },
    { label: "Vendor List", href: routes.privateRoutes.admin.userManagement.vendor.home },
    { label: "Details", href: routes.privateRoutes.admin.userManagement.vendor.view(vendorId) },
    { label: "Offers & Deals", href: routes.privateRoutes.admin.userManagement.vendor.view(vendorId) + "?tab=offers-and-deals" },
    { label: "Offer Details", href: "#" },
  ];

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper title="Offer Products List" description="Maintain your Offer Products List">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <FlashSaleProductForm sale={offersData} id={offerId} offerList={offerLIstData || {}} vendorId={vendorId} />
        <OffersProductDataTable data={offerLIstData || {}} id={offerId} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
