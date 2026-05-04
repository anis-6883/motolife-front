import { getRoles } from "@/actions/admin/role-actions";
import ManagerForm from "@/components/admin/manager/AddManagerForm";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";

interface EditManagerPageProps {
  params: Promise<{ id: string }>; // Next.js 15: params is a Promise
}

export default async function EditManagerPage({ params }: EditManagerPageProps) {
  const { id } = await params; // ← must await before accessing properties

  const breadcrumbItems = [
    { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
    { label: "User Management", href: "#" },
    { label: "Managers", href: routes.privateRoutes.admin.userManagement.manager.home },
    { label: "Edit Manager", href: "#" },
  ];
  const rolesRes = await getRoles();
  const roles = rolesRes?.data?.data.docs ?? [];

  return (
    <BreadcrumbWrapper title="Edit Manager" description="">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <ManagerForm roles={roles} managerId={id} />
    </BreadcrumbWrapper>
  );
}
