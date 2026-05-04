import { getBrands } from "@/actions/admin/product-management/brand-actions";
import { getProductCategories } from "@/actions/admin/product-management/product-category-actions";
import { getAllVendorProducts } from "@/actions/admin/product-management/vendor-product-actions";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { Brand, PageSearchProps, ProductCategory } from "@/lib/types";
import { Metadata } from "next";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Vendor Product" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Vendor Product",
  description: "Maintain your vendor products for seamless navigation.",
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
      data: { data: vendorProducts },
    },
  ] = await Promise.all([getProductCategories({ status: true }), getBrands({ status: true }), getAllVendorProducts(search)]);

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
      <BreadcrumbWrapper title="Manage Vendor Product" description="Maintain your vendor products for enhancing your business growth 💯">
        <DynamicBreadcrumb items={breadcrumbItems} />
        {/* <InHouseProductTable data={vendorProducts || []} categoryOptions={categoryOptions} brandOptions={brandOptions} /> */}
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
