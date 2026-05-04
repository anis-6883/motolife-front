import { getRefundRequests } from "@/actions/order-management/order-actions";
import RefundTable from "@/components/admin/order-management/RefundTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import { REFUND_STATUS_OPTIONS } from "@/config/constant";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import Link from "next/link";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Refund Request" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Refund Request",
  description: "Maintain your refund request list.",
});
type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export default async function OrderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentTab = params.status || "";

  const flatParams: Record<string, string> = {};

  Object.entries(params || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      flatParams[key] = value[0];
    } else if (value !== undefined) {
      flatParams[key] = value;
    }
  });

  const [{ data }] = await Promise.all([
    // getActivityLog(ORDER_ACTIVITY_LOG_TYPE.ORDER, id),
    getRefundRequests(flatParams),
  ]);

  return (
    <BreadcrumbWrapper title="Manage Refund Request" description="Maintain your refund request list">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <div className="scrollbar-none mt-5 mb-5 flex w-max max-w-full gap-2 overflow-x-auto rounded-lg border p-2">
        {[{ value: "", label: "all" }, ...REFUND_STATUS_OPTIONS].map((tab) => (
          <Link key={tab.value} href={`?status=${tab.value}`} replace>
            <Button
              variant={currentTab === tab.value ? "default" : "outline"}
              className={`${currentTab === tab.value ? "cool" : "h-9 border-0 shadow-none"}`}
            >
              {(tab.label || "").split("_").join(" ")}
            </Button>
          </Link>
        ))}
      </div>
      <RefundTable data={data} />
    </BreadcrumbWrapper>
  );
}
