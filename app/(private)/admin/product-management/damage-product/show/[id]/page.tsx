import { getInHouseProductById } from "@/actions/admin/product-management/in-house-product-actions";
import ProductDetailsAdmin from "@/components/admin/shared/ProductDetailsAdmin";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "In-House Product", href: routes.privateRoutes.admin.productManagement.inHouseProduct.home },
  { label: "Show Product" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Show In-House Product",
  description: "Show in-house product details for observing your product's quality",
});

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const {
    data: { data: inHouseProduct },
  } = await getInHouseProductById(id);

  return (
    <BreadcrumbWrapper title="Show In-House Product" description="Show in-house product details for observing your product's quality 🛞">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <ProductDetailsAdmin product={inHouseProduct} />
    </BreadcrumbWrapper>
  );
}
