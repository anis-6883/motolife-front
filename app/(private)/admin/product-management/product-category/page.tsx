import { getProductCategories } from "@/actions/admin/product-management/product-category-actions";
import ProductCategoryTable from "@/components/admin/product-category/ProductCategoryTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Product Category" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Product Category",
  description: "Maintain your product categories for seamless navigation.",
});

export default async function ProductCategoryPage() {
  const {
    data: { data },
  } = await getProductCategories();

  return (
    <BreadcrumbWrapper
      title="Manage Product Category"
      description="Maintain your product categories for seamless navigation"
      addBtn={
        <Link href={routes.privateRoutes.admin.productManagement.productCategory.create}>
          <Button size="sm" className="cool">
            <Plus className="h-4 w-4" />
            Add New Product Category
          </Button>
        </Link>
      }
    >
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductCategoryTable data={data || []} />
    </BreadcrumbWrapper>
  );
}
