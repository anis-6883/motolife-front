import { getProductCategoryById } from "@/actions/admin/product-management/product-category-actions";
import ProductCategoryForm from "@/components/admin/product-category/ProductCategoryForm";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Product Category", href: routes.privateRoutes.admin.productManagement.productCategory.home },
  { label: "Edit" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Edit Product Category",
  description: "Edit your product categories for seamless navigation",
});

export default async function ProductCategoryPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { data: category } = await getProductCategoryById(id);

  return (
    <BreadcrumbWrapper title="Edit Product Category" description="Edit your product categories for seamless navigation 🧭">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductCategoryForm category={category?.data} />
    </BreadcrumbWrapper>
  );
}
