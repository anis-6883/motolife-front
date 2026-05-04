import { getRoles } from "@/actions/admin/role-actions";
import AddManagerForm from "@/components/admin/manager/AddManagerForm";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { Suspense } from "react";

export const metadata = {
  title: "Add Manager – User Management",
};

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "User Management", href: "#" },
  { label: "Managers", href: routes.privateRoutes.admin.userManagement.manager.home },
  { label: "Add Manager", href: "#" },
];

async function RolesLoader() {
  const rolesRes = await getRoles();
  const roles = rolesRes?.data?.data?.docs ?? [];
  return <AddManagerForm roles={roles} />;
}

export default async function AddManagerPage() {
  return (
    <BreadcrumbWrapper title="Add Manager" description="">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Suspense fallback={<div>Loading roles...</div>}>
        <RolesLoader />
      </Suspense>
    </BreadcrumbWrapper>
  );
}
