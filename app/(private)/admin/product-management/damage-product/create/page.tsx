import { getBrands } from "@/actions/admin/product-management/brand-actions";
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

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Damage Product", href: routes.privateRoutes.admin.productManagement.damageProduct.home },
  { label: "Create" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Add New Damage Product",
  description: "Add a new damage product for tracking your product quality",
});

export default async function CreateInHouseProductPage() {
  const [
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
    <BreadcrumbWrapper title="Add New Damage Product" description="Add a new damage product for tracking your product quality 🧪">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <InHouseProductForm
        categories={categoryOptions}
        brands={brandOptions}
        benefits={benefitOptions}
        attributes={attributeOptions}
        isDamaged={true}
      />
    </BreadcrumbWrapper>
  );
}
