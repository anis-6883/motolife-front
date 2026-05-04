import WithdrawDataTable from "@/components/admin/user-management/vendor/money-withdraw/WithdrawDataTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "User Management" },
  { label: "Vendor", href: routes.privateRoutes.admin.userManagement.vendor.home },
  { label: "Money Withdraw" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Money Withdraw",
  description: "Manage vendor withdrawal requests",
});

export default function MoneyWithdrawPage() {
  return (
    <BreadcrumbWrapper title="Withdraw" description="Manage vendor withdrawal requests">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <WithdrawDataTable />
    </BreadcrumbWrapper>
  );
}
