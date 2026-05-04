import { getProductAttributes } from "@/actions/admin/product-management/product-attribute-actions";
import ProductAttributeTable from "@/components/admin/product-attribute/ProductAttributeTable";
import AddButton from "@/components/shared/AddButton";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps } from "@/lib/types";
import { Metadata } from "next";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Product Attribute" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Product Attribute",
  description: "Maintain your product attributes for variations",
});

export default async function ProductAttributePage({ searchParams }: PageSearchProps) {
  const search = await searchParams;

  const {
    data: { data },
  } = await getProductAttributes(search);

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper
        title="Manage Product Attribute"
        description="Maintain your product attributes for variations"
        addBtn={<AddButton title="Add New Product Attribute" />}
      >
        <DynamicBreadcrumb items={breadcrumbItems} />
        <ProductAttributeTable data={data || []} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
