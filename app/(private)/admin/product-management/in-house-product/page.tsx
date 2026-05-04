import { getBrands } from "@/actions/admin/product-management/brand-actions";
import { getInHouseProducts } from "@/actions/admin/product-management/in-house-product-actions";
import { getProductCategories } from "@/actions/admin/product-management/product-category-actions";
import InHouseProductTable from "@/components/admin/in-house-product/InHouseProductTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { Brand, PageSearchProps, ProductCategory } from "@/lib/types";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "In-House Product" }];

export const metadata: Metadata = generatePageMetadata({
  title: "In-House Product",
  description: "Maintain your in-house products for seamless navigation.",
});

export default async function ProductPage({ searchParams }: PageSearchProps) {
  const search = await searchParams;

  const [
    {
      data: { data: activeCategories },
    },
    {
      data: { data: activeBrands },
    },
    {
      data: { data: inHouseProducts },
    },
  ] = await Promise.all([
    getProductCategories({ status: true }),
    getBrands({ status: true }),
    getInHouseProducts({ ...search, isDamaged: false }),
  ]);

  const categoryOptions = activeCategories.map((category: ProductCategory) => {
    return {
      label: category.name,
      value: category._id,
    };
  });

  const brandOptions = activeBrands.map((brand: Brand) => {
    return {
      label: brand.name,
      value: brand._id,
    };
  });
  return (
    <FormSheetProvider>
      <BreadcrumbWrapper
        title="Manage In-House Product"
        description="Maintain your in-house products for growing your business"
        addBtn={
          <Link href={routes.privateRoutes.admin.productManagement.inHouseProduct.create}>
            <Button size="sm" className="cool">
              <Plus className="h-4 w-4" />
              Add New Product
            </Button>
          </Link>
        }
      >
        <DynamicBreadcrumb items={breadcrumbItems} />
        <InHouseProductTable data={inHouseProducts || []} categoryOptions={categoryOptions} brandOptions={brandOptions} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
