"use client";

import { deleteRestockRequest, updateRequestVisibility } from "@/actions/admin/product-management/request-restock-action";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { useFormSheet } from "@/context/FormSheetContext";
import formatDateToDateString from "@/lib/client-utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useState } from "react";
import RestockRequestFormSheet from "./RestockRequestFormSheet";
import { RestockRequest, ReStockRequestListData } from "./type";

export default function RequestListTable({ data }: { data: ReStockRequestListData }) {
  const [total, setTotal] = useState(0);
  const [selectReStock, setSelectRestockRequest] = useState<RestockRequest | null>(null);
  const [stockDelete, setStockDelete] = useState<RestockRequest | null>(null);
  const { openSheet } = useFormSheet();

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs);
    }
  }, [data]);

  const columns: ColumnDef<RestockRequest>[] = [
    {
      accessorKey: "sl",
      header: () => <div className="w-16 text-center">SL</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => {
        const sku = row.original?.product?.sku;

        return <div>{sku ?? "--"}</div>;
      },
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => {
        const { name, thumbnail } = row.original?.product ?? {};

        return (
          <div className="flex items-center gap-1">
            <div className="rounded-lg border bg-gray-100 p-0.5">
              <Image src={thumbnail} alt={name} className="" width={30} height={30} />
            </div>
            <p>{name ?? "N/A"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "sellingPrice",
      header: "Selling Price",
      cell: ({ row }) => {
        const sellingPrice = row.original?.product?.sellingPrice;

        return <div>{Number(sellingPrice.toFixed(2)).toLocaleString() ?? "0"}</div>;
      },
    },
    {
      accessorKey: "lastRequestDate",
      header: "Last Request Date",
      cell: ({ row }) => {
        const { updatedAt } = row.original?.product || {};

        return <div>{updatedAt ? formatDateToDateString(updatedAt) : "N/A"}</div>;
      },
    },
    {
      accessorKey: "numberOfRequest",
      header: "Number Of Request",
      cell: ({ row }) => {
        const { totalRequests } = row.original || {};

        return (
          <div className="max-w-[120px] text-center">
            <span className="rounded bg-gray-100 p-1">{totalRequests ?? 0}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Visibility",
      cell: ({ row }) => {
        const { isPublished, _id } = row?.original?.product;
        return (
          <ToggleSwitch
            checked={isPublished}
            onToggle={async (status: boolean) => {
              const response: any = await updateRequestVisibility({ id: _id, isPublished: status });
              return { success: !!response?.data, message: response?.data?.message ?? response?.error };
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
        const request = row?.original;

        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="edit"
              tooltip="Edit"
              onClick={() => {
                setSelectRestockRequest(request);
                openSheet();
              }}
            />

            <ActionButton type="delete" tooltip="Delete" onClick={() => setStockDelete(request)} />
          </div>
        );
      },
    },
  ];

  const tableFilters = [
    {
      key: "sortOrder",
      label: "Sort By",
      options: [
        { label: "New to Old", value: "__all__" },
        { label: "Old to New", value: "asc" },
      ],
    },
    {
      key: "isPublished",
      label: "Publish",
      options: [
        { label: "All", value: "__all__" },
        { label: "Publish ", value: "true" },
        { label: "Not Publish", value: "false" },
      ],
    },
  ];
  return (
    <>
      <PaginationDataTable
        searchPlaceholder="Search by SKU & Name..."
        filters={tableFilters}
        data={data?.docs}
        columns={columns}
        searchable={true}
        pagination={true}
        total={total}
      />
      {selectReStock && <RestockRequestFormSheet restockRequest={selectReStock} />}

      <DeleteModal
        isOpen={!!stockDelete}
        title={`Delete Stock Request Confirmation!`}
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{stockDelete?.product?.name}"</span>{" "}
            attribute?
          </span>
        }
        onClose={() => setStockDelete(null)}
        onDelete={async () => {
          const response: any = await deleteRestockRequest(stockDelete?._id as string);
          return { success: !!response?.data, message: response?.data?.message ?? response?.error };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting stock..."
        successMessage="Re-stock request deleted successfully!"
        errorMessage="Failed to delete stock!"
      />
    </>
  );
}
