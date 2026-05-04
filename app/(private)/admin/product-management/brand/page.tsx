import { getBrands } from "@/actions/admin/product-management/brand-actions";
import ProductBrandTable from "@/components/admin/brand/ProductBrandTable";
import AddButton from "@/components/shared/AddButton";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps } from "@/lib/types";
import { Metadata } from "next";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Product Brand" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Product Brand",
  description: "Maintain your product brands for seamless navigation",
});

export default async function ProductBrandPage({ searchParams }: PageSearchProps) {
  const search = (await searchParams).search || "";

  const {
    data: { data },
  } = await getBrands({ search });

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper
        title="Manage Product Brand"
        description="Maintain your product brands for trustworthiness and transparency"
        addBtn={<AddButton title="Add New Product Brand" />}
      >
        <DynamicBreadcrumb items={breadcrumbItems} />
        <ProductBrandTable data={data || []} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
