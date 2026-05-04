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

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "In-House Product", href: routes.privateRoutes.admin.productManagement.inHouseProduct.home },
  { label: "Edit" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Edit In-House Product",
  description: "Edit your in-house products for seamless navigation",
});

export default async function InHouseProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;

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
    getInHouseProductById(id),
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
    <BreadcrumbWrapper title="Edit In-House Product" description="Edit your in-house products for ensuring your product's quality 🛞">
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
