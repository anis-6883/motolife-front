import { getBrands } from "@/actions/admin/product-management/brand-actions";
import { getInHouseProductById } from "@/actions/admin/product-management/in-house-product-actions";
import { getProductAttributes } from "@/actions/admin/product-management/product-attribute-actions";
import { getProductBenefit } from "@/actions/admin/product-management/product-benefit-actions";
import { getProductCategories } from "@/actions/admin/product-management/product-category-actions";
import InHouseProductForm from "@/components/admin/in-house-product/InHouseProductForm";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { ProductCategory } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Edit Vendor Product",
  description: "Update and manage vendor product details",
});

export default async function SellerProductEditPage({ params }: { params: Promise<{ id: string; productId: string }> }) {
  const { id: vendorId, productId } = await params;

  const breadcrumbItems = [
    { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
    { label: "User Management" },
    { label: "Vendor" },
    { label: "Vendor List", href: routes.privateRoutes.admin.userManagement.vendor.home },
    { label: "Details", href: routes.privateRoutes.admin.userManagement.vendor.view(vendorId) },
    { label: "Product", href: routes.privateRoutes.admin.userManagement.vendor.view(vendorId) + "?tab=product" },
    { label: "Edit Product", href: "#" },
  ];

  const [
    {
      data: { data: product },
    },
    {
      data: { data: activeCategories },
    },
    {
      data: { data: activeBrands },
    },
    {
      data: { data: activeBenefits },
    },
    {
      data: { data: activeAttributes },
    },
  ] = await Promise.all([
    getInHouseProductById(productId),
    getProductCategories({ status: true }),
    getBrands({ status: true }),
    getProductBenefit({ p: false, status: true }),
    getProductAttributes({ p: false, status: true }),
  ]);

  const categoryOptions = activeCategories.map((category: ProductCategory) => {
    return {
      label: category.name,
      value: category._id,
      subCategories:
        (category?.subCategories?.length ?? 0) > 0
          ? category.subCategories?.map((subCategory: any) => {
              return {
                label: subCategory.name,
                value: subCategory._id,
              };
            })
          : null,
    };
  });

  const brandOptions = activeBrands.map((brand: any) => {
    return {
      label: brand.name,
      value: brand._id,
    };
  });

  const benefitOptions = activeBenefits.map((benefit: any) => {
    return {
      label: benefit.title,
      value: benefit._id,
    };
  });

  const attributeOptions = activeAttributes.map((attribute: any) => {
    return {
      label: attribute.name,
      value: attribute._id,
      relatedValues: attribute.values.map((value: string) => {
        return {
          label: value,
          value: value,
        };
      }),
    };
  });
  return (
    <BreadcrumbWrapper title="Edit Vendor Product" description="Update and manage vendor product details">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <InHouseProductForm
        product={product}
        categories={categoryOptions}
        brands={brandOptions}
        benefits={benefitOptions}
        attributes={attributeOptions}
      />
    </BreadcrumbWrapper>
  );
}
