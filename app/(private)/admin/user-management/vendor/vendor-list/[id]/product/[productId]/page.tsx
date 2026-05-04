import { getProductById } from "@/actions/admin/product-management/product-actions";
import ProductDetailsAdmin from "@/components/admin/shared/ProductDetailsAdmin";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Product Details",
  description: "Manage and oversee individual vendor product details",
});

export default async function VendorProductPage({ params }: { params: Promise<{ id: string; productId: string }> }) {
  const { id: vendorId, productId } = await params;
  const { data: productDetailData } = await getProductById(productId);

  const breadcrumbItems = [
    { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
    { label: "User Management" },
    { label: "Vendor" },
    { label: "Vendor List", href: routes.privateRoutes.admin.userManagement.vendor.home },
    { label: "Details", href: routes.privateRoutes.admin.userManagement.vendor.view(vendorId) },
    { label: "Product", href: routes.privateRoutes.admin.userManagement.vendor.view(vendorId) + "?tab=product" },
    { label: "Product Details", href: "#" },
  ];

  return (
    <BreadcrumbWrapper title="Product Details" description="Manage and oversee individual vendor product details">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductDetailsAdmin product={productDetailData.data} vendorId={vendorId} />
    </BreadcrumbWrapper>
  );
}
