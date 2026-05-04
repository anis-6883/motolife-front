"use client";

import { deleteStockUnit } from "@/actions/admin/product-management/in-house-product-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { SellerAccountStatus } from "@/config/constant";
import { IStockUnit } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { LuPackageX } from "react-icons/lu";
import MarkStockAsDamagedModal from "./MarkStockAsDamagedModal";

export default function StockUnitsTable({ data }: { data: StockUnitData }) {
  const [total, setTotal] = useState(0);
  const [stockUnitToDelete, setStockUnitToDelete] = useState<IStockUnit | null>(null);
  const [stockUnitToMarkDamaged, setStockUnitToMarkDamaged] = useState<IStockUnit | null>(null);

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs || 0);
    }
  }, [data]);

  const columns: ColumnDef<IStockUnit>[] = [
    {
      header: "SL",
      cell: ({ row }) => row.index + 1,
    },

    {
      header: "Product SKU",
      cell: ({ row }) => row.original.sku || "N/A",
    },
    {
      header: "Parent SKU",
      cell: ({ row }) => row.original.parentSku || "N/A",
    },
    {
      header: "Selling Price",
      cell: ({ row }) => row.original.sellingPrice || "N/A",
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const stockUnit = row.original;

        return (
          <div className="flex items-center gap-2">
            <ActionButton type="delete" tooltip="Delete" onClick={() => setStockUnitToDelete(stockUnit)} />
            <ActionButton
              type="default"
              icon={<LuPackageX />}
              tooltip="Mark as Damaged"
              onClick={() => setStockUnitToMarkDamaged(stockUnit)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PaginationDataTable
        data={data?.docs || []}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search by Product & Parent SKU"
        pagination={true}
        total={total}
      />

      <DeleteModal
        isOpen={!!stockUnitToDelete}
        title="Delete Stock Unit Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{stockUnitToDelete?.sku}"</span> stock unit?
          </span>
        }
        onClose={() => setStockUnitToDelete(null)}
        onDelete={async () => {
          const response = await deleteStockUnit(stockUnitToDelete?._id || "");
          return { success: !!response?.data };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting stock unit..."
        successMessage="Stock unit deleted successfully!"
        errorMessage="Failed to delete stock unit!"
      />

      <MarkStockAsDamagedModal
        key={stockUnitToMarkDamaged?._id || "none"}
        open={!!stockUnitToMarkDamaged}
        onOpenChange={(open) => !open && setStockUnitToMarkDamaged(null)}
        stockUnit={stockUnitToMarkDamaged}
      />
    </>
  );
}

type StockUnitData = {
  docs: IStockUnit[];
  pagination: {
    totalDocs: number;
  };
};

export const statusStyles: Record<SellerAccountStatus, string> = {
  [SellerAccountStatus.LIVE]: "bg-green-dark text-white border-transparent",
  [SellerAccountStatus.SUSPENDED]: "bg-primary text-white border-transparent",
  [SellerAccountStatus.INACTIVE]: "bg-black/40 text-white border-transparent",
  [SellerAccountStatus.ON_VACATION]: "bg-secondary text-white border-transparent",
};
