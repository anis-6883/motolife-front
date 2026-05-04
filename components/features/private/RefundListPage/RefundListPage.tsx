"use client";

import { getRefundStatusStyles } from "@/components/admin/user-management/vendor/detail/StyleVariants";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { Refund } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

type RefundData = {
  docs: Refund[];
  pagination: {
    totalDocs: number;
  };
};

const truncate = (text: string, max = 55) => (text?.length > max ? text.slice(0, max) + "..." : (text ?? "–"));

const RefundListPage = ({ data }: { data: RefundData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (data) {
      setTimeout(() => setIsLoading(false), 800);
      setTotal(data?.pagination?.totalDocs || 0);
    }
  }, [data]);

  const columns: ColumnDef<Refund>[] = [
    {
      accessorKey: "order",
      header: "Order ID",
      cell: ({ row }) => {
        return <p className="p-text-16 leading-5 font-semibold">#{row.original.order.orderId}</p>;
      },
    },
    {
      accessorKey: "product",
      header: "Product Info",
      cell: ({ row }) => {
        const product = row.original.items?.[0];

        return (
          <div className="flex items-center gap-3">
            <img src={product?.thumbnail} alt={product?.productName} className="h-12 w-12 rounded-md object-cover" />
            <p className="p-text-16 min-w-0 truncate leading-5 font-semibold" title={product?.productName}>
              {truncate(product?.productName, 40)}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "qty",
      header: "Qty",
      cell: ({ row }) => {
        return <p className="p-text-16 leading-5 font-semibold">{row.original.items?.[0]?.quantity}</p>;
      },
    },
    {
      accessorKey: "requestDate",
      header: "Request Date",
      cell: ({ row }) => {
        return <p className="p-text-16 leading-5 font-semibold">{new Date(row.original.createdAt as string).toLocaleDateString()}</p>;
      },
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => {
        const product = row.original.items?.[0];
        return <p className="p-text-16 leading-5 font-semibold">{product?.seller?.store?.storeName}</p>;
      },
    },
    {
      accessorKey: "refundAmount",
      header: "Total Amount",
      cell: ({ row }) => <span className="p-text-16 leading-5 font-semibold">৳ {row.original.totalAmount}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <span
            className={`p-text-14 inline-flex items-center rounded-md border px-3 py-1 font-semibold uppercase ${getRefundStatusStyles(status)}`}
          >
            {status.replace(/_/g, " ")}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <h2 className="p-text-24 mb-4 font-semibold md:mb-8">Refund List</h2>
      <PaginationDataTable data={data?.docs} columns={columns} pagination={true} isLoading={isLoading} total={total} />
    </div>
  );
};

export default RefundListPage;
