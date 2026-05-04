"use client";

import { deleteRole, updateRole } from "@/actions/admin/role-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PERMISSIONS } from "@/config/constant";
import { useFormSheet } from "@/context/FormSheetContext";
import { Role, RoleData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import RoleFormSheet from "./RoleFormSheet";

export default function UserRoleTable({ data }: { data: RoleData }) {
  const [total, setTotal] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const { openSheet } = useFormSheet();

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs);
    }
  }, [data]);

  const columns: ColumnDef<{
    _id: string;
    name: string;
    status: boolean;
    permissions: string[];
  }>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const values = row?.original?.permissions;

        return (
          <div className="flex flex-wrap gap-2">
            {values?.map((value, index) => {
              const key = Object.entries(PERMISSIONS).find(([key, val]) => val === value);
              return (
                <Badge key={index}>
                  {key?.[0]?.includes("And") ? key?.[0]?.split("_").join(" ").replace("And", "&") : key?.[0]?.split("_").join(" ")}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Visibility",
      cell: ({ row }) => {
        const role = row?.original;
        return (
          <ToggleSwitch
            checked={role?.status}
            onToggle={async (status: boolean) => {
              const response = await updateRole(role?._id, { status });
              return { success: !!response?.data };
            }}
            activeText="Visible"
            inactiveText="Hidden"
          />
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const role = row?.original;

        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="edit"
              tooltip="Edit"
              onClick={() => {
                setSelectedRole(role);
                openSheet();
              }}
            />

            <ActionButton type="delete" tooltip="Delete" onClick={() => setRoleToDelete(role)} />
          </div>
        );
      },
    },
  ];

  return (
    <Card className="px-6 dark:border-white/10 dark:bg-[#151515] dark:text-white">
      <CardHeader className="-px-6">
        <CardTitle>User Roles</CardTitle>
      </CardHeader>
      <PaginationDataTable data={data.docs} columns={columns} searchable={true} pagination={true} total={total} />

      <RoleFormSheet role={selectedRole} />

      <DeleteModal
        isOpen={!!roleToDelete}
        title="Delete Attribute Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{roleToDelete?.name}"</span> attribute?
          </span>
        }
        onClose={() => setRoleToDelete(null)}
        onDelete={async () => {
          const response = await deleteRole(roleToDelete?._id);
          return { success: !!response?.data };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting role..."
        successMessage="Role deleted successfully!"
        errorMessage="Failed to delete role!"
      />
    </Card>
  );
}
