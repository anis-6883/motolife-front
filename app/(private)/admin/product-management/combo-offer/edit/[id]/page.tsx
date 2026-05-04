import { getBrands } from "@/actions/admin/product-management/brand-actions";
import { getComboOfferById } from "@/actions/admin/product-management/combo-offer-actions";
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
  { label: "Combo Offer Product", href: routes.privateRoutes.admin.productManagement.comboOffer.home },
  { label: "Edit" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Edit Combo Offer Product",
  description: "Edit your combo offer products for scaling your selling strategy",
});

export default async function ComboOfferEditPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const [
    {
      data: { data: comboOffer },
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
    getComboOfferById(id),
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
    <BreadcrumbWrapper title="Edit Combo Offer Product" description="Edit your combo offer products for scaling your selling strategy 🎁">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <InHouseProductForm
        mode="combo-offer"
        product={comboOffer}
        categories={categoryOptions}
        brands={brandOptions}
        benefits={benefitOptions}
        attributes={attributeOptions}
      />
    </BreadcrumbWrapper>
  );
}
