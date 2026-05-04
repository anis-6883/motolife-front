"use client";

import { IOrderResponse } from "@/components/admin/customer-management/types";
import ActionButton from "@/components/shared/ActionButton";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import routes from "@/config/routes";
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomerDataTableProps {
  customerId: string;
  data: {
    docs: IOrderResponse[];
    pagination: {
      totalDocs: number;
    };
  };
}

export default function CustomerOrderTable({ data, customerId }: CustomerDataTableProps) {
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs || 0);
    }
  }, [data]);

  const customerColumns: ColumnDef<IOrderResponse>[] = [
    {
      id: "sl",
      header: () => <h2 className="!w-[150px]">SL</h2>,
      cell: ({ row }) => row.index + 1,
    },
    {
      id: "orderId",
      accessorKey: "orderId",
      header: () => <p className="">Order ID</p>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <p>{row.original.orderId}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(row.original.orderId);
            }}
            className="rounded-md bg-green-300/40 p-1 hover:bg-gray-100/70"
            title="Copy Order ID"
          >
            <Copy size={15} />
          </button>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Order Date",
      cell: ({ row }) => <p>{moment(row.original.createdAt).format("MMM DD, YYYY")}</p>,
    },
    {
      accessorKey: "total",
      header: () => <p className="text-center">Total Amount(BDT)</p>,
      cell: ({ row }) => <p className="text-center">{row.original.total}</p>,
    },
    {
      accessorKey: "status",
      header: () => <p className="text-center">Status</p>,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <OrderStatusBadge status={row.original.status} />
          </div>
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="view"
              tooltip="View"
              onClick={() => router.push(routes.privateRoutes.admin.userManagement.customer.order(customerId, order._id))}
            />
            <ActionButton type="download" tooltip="Download" onClick={() => handleDownload(order.invoice)} />
          </div>
        );
      },
    },
  ];

  const handleDownload = (invoice: object) => {};

  return (
    <>
      <PaginationDataTable
        data={data.docs || []}
        columns={customerColumns}
        searchable={true}
        pagination={true}
        total={total}
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
            ],
          },
        ]}
      />
    </>
  );
}
