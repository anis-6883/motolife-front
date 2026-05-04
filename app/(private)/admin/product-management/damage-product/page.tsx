import { getDamagedStockUnits } from "@/actions/admin/product-management/damage-product-actions";
import { getProductCategories } from "@/actions/admin/product-management/product-category-actions";
import DamageProductTable from "@/components/admin/damage-product/DamageProductTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps, ProductCategory } from "@/lib/types";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Damage Product" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Damage Product",
  description: "Maintain your damage products for seamless navigation.",
});

export default async function ProductPage({ searchParams }: PageSearchProps) {
  const search = await searchParams;

  const [
    {
      data: { data: activeCategories },
    },
    {
      data: { data: damagedStockUnits },
    },
  ] = await Promise.all([getProductCategories({ status: true }), getDamagedStockUnits({ ...search, isDamaged: true })]);

  const categoryOptions = activeCategories.map((category: ProductCategory) => {
    return {
      label: category.name,
      value: category._id,
    };
  });

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper
        title="Manage Damaged Product"
        description="Maintain your damage products for tracking your product quality"
        addBtn={
          <Link href={routes.privateRoutes.admin.productManagement.damageProduct.create}>
            <Button size="sm" className="cool">
              <Plus className="h-4 w-4" />
              Add New Damage Product
            </Button>
          </Link>
        }
      >
        <DynamicBreadcrumb items={breadcrumbItems} />
        <DamageProductTable data={damagedStockUnits || []} categoryOptions={categoryOptions} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
