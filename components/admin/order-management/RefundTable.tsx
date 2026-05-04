"use client";
import ActionButton from "@/components/shared/ActionButton";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import routes from "@/config/routes";
import formatDateToDateString from "@/lib/client-utils";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRefundStatusStyles } from "../user-management/vendor/detail/StyleVariants";
import { RefundDoc, RefundResponse } from "./schema";

export default function RefundTable({ data }: { data: RefundResponse }) {
  const [total, setTotal] = useState(0);
  const router = useRouter();
  useEffect(() => {
    if (data) {
      setTotal(data?.data?.pagination?.totalDocs || 0);
    }
  }, [data]);

  const columns: ColumnDef<RefundDoc>[] = [
    {
      header: "SL",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "refundId",
      header: "Refund ID",
    },
    {
      header: "Order ID",
      cell: ({ row }) => row.original.order.orderId,
    },
    {
      header: "Items",
      cell: ({ row }) => row.original.items.length,
    },
    {
      header: "Request Date",
      cell: ({ row }) => formatDateToDateString(row.original.createdAt),
    },
    {
      header: "Vendor",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="text-sm">
            {order?.order?.sellers ? (
              <>
                {Array.isArray(order?.order?.sellers) ? (
                  order?.order?.sellers?.map((seller) => (
                    <div key={seller._id}>
                      <p className="font-medium">{seller?.name}</p>
                      <p className="text-muted-foreground">{seller?.store?.storeName}</p>
                    </div>
                  ))
                ) : (
                  <div key={order?.order?.sellers._id}>
                    <p className="font-medium">{order?.order?.sellers?.name}</p>
                    <p className="text-muted-foreground">{order?.order?.sellers?.store?.storeName}</p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        );
      },
    },
    {
      header: "Customer",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="text-sm">
            <p className="font-medium">{order.customer?.fullName}</p>
            <p className="text-muted-foreground">{order.customer?.phone}</p>
          </div>
        );
      },
    },
    {
      header: "Total Amount",
      cell: ({ row }) => `৳ ${row.original.totalAmount}`,
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <span
            className={`p-text-14 inline-flex items-center rounded-md border px-3 py-1 font-semibold uppercase ${getRefundStatusStyles(order.status)}`}
          >
            {order.status.replace(/_/g, " ")}
          </span>
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const refund = row.original;
        return (
          <ActionButton
            type="view"
            tooltip="View"
            onClick={() => router.push(`${routes.privateRoutes.admin.orderManagement.refundRequest.view(refund._id)}`)}
          />
        );
      },
    },
  ];
  return (
    <div className="animate-in fade-in slide-in-from-top-2 space-y-5 duration-300">
      <PaginationDataTable
        searchPlaceholder="Search by Refund ID & Order ID..."
        data={data?.data?.docs || []}
        columns={columns}
        searchable
        pagination
        total={total}
      />
    </div>
  );
}
