import { getRoles } from "@/actions/admin/role-actions";
import CreateRoleForm from "@/components/admin/user-role/CreateRoleForm";
import UserRoleTable from "@/components/admin/user-role/UserRoleTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { UserRoundCog } from "lucide-react";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: <UserRoundCog className="text-xl" />, href: "/" },
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "User Role" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "User Role",
  description: "Manage your user roles for better application permissions",
});

type PageProps = {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
};

export default async function UserRolePage({ searchParams }: PageProps) {
  const page = Number((await searchParams).page) || 1;
  const limit = Number((await searchParams).limit) || 10;
  const search = (await searchParams).search || "";

  const {
    data: { data },
  } = await getRoles(page, limit, search);

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper title="Manage User Role" description="Manage your user roles for better application permissions">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <CreateRoleForm />
        <UserRoleTable data={data || []} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
