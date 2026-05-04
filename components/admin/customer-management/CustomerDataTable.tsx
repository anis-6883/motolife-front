"use client";

import { ICustomer } from "@/components/admin/customer-management/types";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomerDataTableProps {
  data: {
    docs: ICustomer[];
    pagination: {
      totalDocs: number;
    };
  };
}

export default function CustomerDataTable({ data }: CustomerDataTableProps) {
  const [total, setTotal] = useState(0);
  const [customerToDelete, setCustomerToDelete] = useState<ICustomer | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs || 0);
    }
  }, [data]);

  const customerColumns: ColumnDef<ICustomer>[] = [
    {
      id: "sl",
      header: "SL",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "fullName",
      header: "Customer Name",
    },
    {
      id: "contactInfo",
      header: "Contact Info",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">{row.original.email}</p>
          <p className="text-muted-foreground text-xs">{row.original.phone}</p>
        </div>
      ),
    },

    {
      id: "totalOrders",
      header: () => <p className="text-center">Total Orders</p>,
      cell: ({ row }) => <p className="text-muted-foreground text-center">{row.original.totalOrders}</p>,
    },

    {
      accessorKey: "isVerified",
      header: () => <p className="text-center">User Type</p>,
      cell: ({ row }) => {
        const status = row.original.isVerified;
        let statusStyles = "";

        if (status === true) {
          statusStyles = "bg-[#FFF5DC] text-[#FDAB00]";
        } else {
          statusStyles = "bg-red-100 text-red-700 border-red-200";
        }

        return (
          <div className="flex justify-center">
            <Badge className={statusStyles}>{status ? "Account user" : "Guest User"}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "accountStatus",
      header: () => <p className="text-center">Account Status</p>,
      cell: ({ row }) => {
        const status = row.original.accountStatus;
        let statusStyles = "";
        const statusConfig: any = {
          active: {
            label: "Active",
          },
          partially_banned: {
            label: "Partially Banned",
          },
          banned: {
            label: "Banned",
          },
        };
        switch (status) {
          case "active":
            statusStyles = "bg-green-100 text-green-700 border-green-200";
            break;
          case "banned":
            statusStyles = "bg-red-100 text-red-700 border-red-200";
            break;
          case "partially_banned":
            statusStyles = "bg-yellow-100 text-yellow-700 border-yellow-200";
            break;
          default:
            statusStyles = "bg-gray-100 text-gray-700";
        }

        return (
          <div className="flex justify-center capitalize">
            <Badge className={statusStyles}>{statusConfig[status].label}</Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <p className="p-text-14 text-center">Action</p>,
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <ActionButton tooltip="View Details" type="view" onClick={() => handleView(customer)} />
            <ActionButton type="delete" tooltip="Delete" onClick={() => handleDelete(customer)} />
          </div>
        );
      },
    },
  ];

  const handleView = (customer: ICustomer) => {
    router.push(`/admin/user-management/customer/${customer._id}`);
  };

  const handleDelete = (customer: ICustomer) => {
    setCustomerToDelete(customer);
  };

  return (
    <>
      <PaginationDataTable
        data={data.docs || []}
        columns={customerColumns}
        searchable={true}
        pagination={true}
        total={total}
        searchPlaceholder="Search by name , email"
        filters={[
          {
            key: "sortOrder",
            label: "Sort By",
            options: [
              { label: "New to Old", value: "__all__" },
              { label: "Old to New", value: "asc" },
            ],
          },
          {
            key: "accountStatus",
            label: "Status",
            options: [
              { label: "All", value: "__all__" },
              { label: "Active", value: "active" },
              { label: "Banned", value: "banned" },
              { label: "Partially Banned", value: "partially_banned" },
            ],
          },
        ]}
      />
      <DeleteModal
        isOpen={!!customerToDelete}
        title="Delete Customer Confirmation!"
        description={
          <span>
            Are you sure you want to delete customer <span className="text-primary font-semibold">"{customerToDelete?.email}"</span>?
          </span>
        }
        onClose={() => setCustomerToDelete(null)}
        onDelete={async () => {
          console.log("Delete customer:", customerToDelete?._id);
          return { success: true };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting customer..."
        successMessage="Customer deleted successfully!"
        errorMessage="Failed to delete customer!"
      />
    </>
  );
}
