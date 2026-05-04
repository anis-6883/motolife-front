import { getProductFaqs } from "@/actions/admin/product-management/product-faq-actions";
import ProductFaqTable from "@/components/admin/product-faq/ProductFaqTable";
import AddButton from "@/components/shared/AddButton";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps } from "@/lib/types";
import { Metadata } from "next";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Product FAQ" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Product FAQ",
  description: "Maintain your product FAQ",
});

export default async function ProductFAQPage({ searchParams }: PageSearchProps) {
  const search = await searchParams;

  const {
    data: { data },
  } = await getProductFaqs(search);

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper
        title="Manage Product FAQ"
        description="Maintain the queries which comes from lead customers"
        addBtn={<AddButton title="Add New Question" />}
      >
        <DynamicBreadcrumb items={breadcrumbItems} />
        <ProductFaqTable data={data || []} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
