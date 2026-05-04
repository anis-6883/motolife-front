import { getProductBenefit } from "@/actions/admin/product-management/product-benefit-actions";
import ProductBenefitTable from "@/components/admin/product-benefit/ProductBenefitTable";
import AddButton from "@/components/shared/AddButton";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps } from "@/lib/types";
import { Metadata } from "next";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Product Benefit" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Product Benefit",
  description: "Maintain your product benefits to enhance sales",
});

export default async function ProductBenefitPage({ searchParams }: PageSearchProps) {
  const search = await searchParams;

  const {
    data: { data },
  } = await getProductBenefit(search);

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper
        title="Manage Product Benefit"
        description="Maintain your product benefits for enhancing business sales"
        addBtn={<AddButton title="Add New Product Benefit" />}
      >
        <DynamicBreadcrumb items={breadcrumbItems} />
        <ProductBenefitTable data={data || []} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
