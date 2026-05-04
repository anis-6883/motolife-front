import { getManager } from "@/actions/admin/manager/manager-action";
import ManagerListClient from "@/components/admin/manager/list/ManagerListClient";
import { ManagerListResponse } from "@/components/admin/manager/type";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Managers – User Management",
};

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "User Management", href: "#" },
  { label: "Managers", href: "/" },
];

export default async function ManagersPage() {
  const res = await getManager();
  const data = (res?.data?.data ?? res?.data ?? { docs: [], pagination: {} }) as ManagerListResponse;

  const docs = data?.docs ?? [];
  const pagination = data?.pagination ?? {
    totalDocs: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  };

  return (
    <BreadcrumbWrapper
      title="Managers"
      description=""
      addBtn={
        <Link href={routes.privateRoutes.admin.userManagement.manager.create ?? "#"}>
          <Button className="rounded-full px-5">
            <Plus className="mr-1.5 h-4 w-4" />
            Add New Manager
          </Button>
        </Link>
      }
    >
      <DynamicBreadcrumb items={breadcrumbItems} />

      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-4 px-5">
          <h2 className="text-sm font-semibold text-gray-900">Manager List</h2>
        </div>
        <ManagerListClient docs={docs} pagination={pagination} />
      </div>
    </BreadcrumbWrapper>
  );
}
