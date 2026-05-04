import { getProductById } from "@/actions/admin/product-management/product-actions";
import ProductDetailsAdmin from "@/components/admin/shared/ProductDetailsAdmin";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Vendor Product", href: routes.privateRoutes.admin.productManagement.vendorProduct.home },
  { label: "Product Details" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Product Details",
  description: "Manage and oversee individual vendor product details",
});

export default async function VendorProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: productDetailData } = await getProductById(id);
  return (
    <BreadcrumbWrapper title="Product Details" description="Manage and oversee individual vendor product details">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductDetailsAdmin product={productDetailData.data} />
    </BreadcrumbWrapper>
  );
}
