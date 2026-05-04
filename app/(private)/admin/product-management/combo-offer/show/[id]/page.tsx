import { getComboOfferById } from "@/actions/admin/product-management/combo-offer-actions";
import ProductDetailsAdmin from "@/components/admin/shared/ProductDetailsAdmin";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Combo Offer", href: routes.privateRoutes.admin.productManagement.comboOffer.home },
  { label: "Show Product" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Show Combo Offer Product",
  description: "Show combo offer product details for observing your product's quality",
});

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comboOfferRes = await getComboOfferById(id);

  return (
    <BreadcrumbWrapper
      title="Show Combo Offer Product"
      description="Show combo offer product details for observing your product's quality 🎁"
    >
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductDetailsAdmin product={comboOfferRes?.data?.data} isCombo={true} />
    </BreadcrumbWrapper>
  );
}
