import { getStockUnits } from "@/actions/admin/product-management/in-house-product-actions";
import StockUnitsTable from "@/components/admin/in-house-product/StockUnitsTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Vendor",
  description: "Maintain your vendor list.",
});

export default async function VendorPage({ params, searchParams }: PageSearchProps) {
  const { id } = await params;
  const search = await searchParams;

  const {
    data: { data },
  } = await getStockUnits({ ...search, productId: id, isDamaged: false });

  const breadcrumbItems = [
    { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
    { label: "Combo Offer", href: routes.privateRoutes.admin.productManagement.comboOffer.home },
    { label: "Product Details", href: routes.privateRoutes.admin.productManagement.comboOffer.show(id) },
    { label: "Manage Stock Unit" },
  ];

  return (
    <BreadcrumbWrapper title="Manage Stock Unit" description="Maintain your stock unit for ensuring quality 📦">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <StockUnitsTable data={data || []} />
    </BreadcrumbWrapper>
  );
}
