"use client";

import { deleteDamageUnit } from "@/actions/admin/product-management/damage-product-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { useFormSheet } from "@/context/FormSheetContext";
import { DamageProductData, DamageProductUnit } from "@/lib/types";
import { dateFormat } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { PiMountains } from "react-icons/pi";
import DamageFormSheet from "./DamageFormSheet";

export default function DamageProductTable({
  data,
  categoryOptions,
}: {
  data: DamageProductData;
  categoryOptions: { label: string; value: string }[];
}) {
  const { openSheet } = useFormSheet();
  const [total, setTotal] = useState(0);
  const [selectedDamageProduct, setSelectedDamageProduct] = useState<(DamageProductUnit & { mode: "show" | "edit" }) | null>(null);
  const [productToDelete, setProductToDelete] = useState<DamageProductUnit | null>(null);

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs);
    }
  }, [data]);

  const columns: ColumnDef<DamageProductUnit>[] = [
    {
      id: "serial",
      header: "SL",
      accessorFn: (_row: any, index: number) => index + 1,
    },
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => {
        return row?.original?.product?.thumbnail ? (
          <div className="relative h-[50px] w-[50px] overflow-hidden rounded-full">
            <img
              src={row?.original?.product?.thumbnail}
              alt={row?.original?.product?.name}
              width={50}
              height={50}
              className="h-full w-full object-cover p-1"
            />
          </div>
        ) : (
          <PiMountains className="text-3xl" />
        );
      },
    },
    {
      accessorKey: "sku",
      header: "Product SKU",
    },
    {
      accessorKey: "product.name",
      header: "Name",
    },
    {
      accessorKey: "category.name",
      header: "Category",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return <span>{dateFormat(row?.original?.createdAt)}</span>;
      },
    },
    {
      accessorKey: "damagePercentage",
      header: () => <h2 className="text-center">Damage Percentage</h2>,
      cell: ({ row }) => {
        return <p className="text-center">{row?.original?.damagePercentage}%</p>;
      },
    },
    {
      accessorKey: "actions",
      header: () => <h2 className="text-center">Actions</h2>,
      cell: ({ row }) => {
        const product = row?.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <ActionButton
              type="view"
              tooltip="Show"
              onClick={() => {
                setSelectedDamageProduct({ ...product, mode: "show" });
                openSheet();
              }}
            />
            <ActionButton
              type="edit"
              tooltip="Edit"
              onClick={() => {
                setSelectedDamageProduct({ ...product, mode: "edit" });
                openSheet();
              }}
            />

            <ActionButton type="delete" tooltip="Delete" onClick={() => setProductToDelete(product)} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PaginationDataTable
        data={data?.docs}
        searchable={true}
        searchPlaceholder="Search by Product SKU..."
        columns={columns}
        pagination={true}
        total={total}
        filters={[
          {
            key: "sortOrder",
            label: "Sort By",
            options: [
              { label: "Select", value: "__all__" },
              { label: "Old to New", value: "desc" },
              { label: "New to Old", value: "asc" },
            ],
          },
          {
            key: "category",
            label: "Category",
            options: [{ label: "Select", value: "__all__" }, ...categoryOptions],
          },
        ]}
      />

      <DamageFormSheet
        key={selectedDamageProduct?._id}
        damageProduct={selectedDamageProduct}
        setSelectDamageProduct={setSelectedDamageProduct}
      />

      <DeleteModal
        isOpen={!!productToDelete}
        title="Delete Product Confirmation!"
        description={
          <span>
            Are you sure you want to delete this{" "}
            <span className="text-primary font-semibold">
              "{productToDelete?.product?.name} ({productToDelete?.sku})"
            </span>{" "}
            variant unit?
          </span>
        }
        onClose={() => setProductToDelete(null)}
        onDelete={async () => {
          if (productToDelete) {
            const response = await deleteDamageUnit(productToDelete?._id);
            return { success: !!response?.data };
          }
          return { success: false };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting product variant unit..."
        successMessage="Product variant unit deleted successfully!"
        errorMessage="Failed to delete product variant unit!"
      />
    </>
  );
}
