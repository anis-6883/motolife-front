import { getRequestRestockList } from "@/actions/admin/product-management/request-restock-action";
import RequestListTable from "@/components/admin/restock-rquest/RequestListTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps } from "@/lib/types";
import { Metadata } from "next";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Request Re-Stock" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Restock Request List",
  description: "Submit a request to replenish items that are low or out of stock.",
});

export default async function RequestReStockPage({ searchParams }: PageSearchProps) {
  const search = await searchParams;
  const {
    data: { data: restockRequests },
  } = await getRequestRestockList(search);

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper title="Restock Request List" description="Submit a request to replenish items that are low or out of stock 🎊">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <RequestListTable data={restockRequests || []} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
