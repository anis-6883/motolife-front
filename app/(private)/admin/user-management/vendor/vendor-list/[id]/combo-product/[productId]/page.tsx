import { getComboOfferById } from "@/actions/admin/product-management/combo-offer-actions";
import ProductDetailsAdmin from "@/components/admin/shared/ProductDetailsAdmin";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Vendor Combo Offer Details",
  description: "Vendor combo offer product details for observing your product's quality",
});

export default async function VendorProductPage({ params }: { params: Promise<{ id: string; productId: string }> }) {
  const { id: vendorId, productId } = await params;
  const comboOfferRes = await getComboOfferById(productId);

  const breadcrumbItems = [
    { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
    { label: "User Management" },
    { label: "Vendor" },
    { label: "Vendor List", href: routes.privateRoutes.admin.userManagement.vendor.home },
    { label: "Details", href: routes.privateRoutes.admin.userManagement.vendor.view(vendorId) },
    { label: "Combo Offer", href: routes.privateRoutes.admin.userManagement.vendor.view(vendorId) + "?tab=combo-offer" },
    { label: "Product Details", href: "#" },
  ];

  return (
    <BreadcrumbWrapper
      title="Vendor Combo Offer Details"
      description="Vendor combo offer product details for observing your product's quality"
    >
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductDetailsAdmin product={comboOfferRes?.data?.data || []} vendorId={vendorId} isCombo={true} />
    </BreadcrumbWrapper>
  );
}
