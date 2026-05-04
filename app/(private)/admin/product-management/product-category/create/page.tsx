import ProductCategoryForm from "@/components/admin/product-category/ProductCategoryForm";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Product Category", href: routes.privateRoutes.admin.productManagement.productCategory.home },
  { label: "Create" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Add New Product Category",
  description: "Add a new product category for creating new window 🛵",
});

export default function CreateProductCategoryPage() {
  return (
    <BreadcrumbWrapper title="Add New Product Category" description="Add a new product category for creating new window 🛵">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductCategoryForm />
    </BreadcrumbWrapper>
  );
}
