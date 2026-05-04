"use client";

import { deleteProductBenefit, updateProductBenefit } from "@/actions/admin/product-management/product-benefit-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { useFormSheet } from "@/context/FormSheetContext";
import { ProductBenefit, ProductBenefitData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import ProductBenefitFormSheet from "./ProductBenefitFormSheet";

export default function ProductBenefitTable({ data }: { data: ProductBenefitData }) {
  const [total, setTotal] = useState(0);
  const [selectedProductBenefit, setSelectedProductBenefit] = useState<ProductBenefit | null>(null);
  const [productBenefitToDelete, setProductBenefitToDelete] = useState<ProductBenefit | null>(null);
  const { openSheet } = useFormSheet();

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs);
    }
  }, [data]);

  const columns: ColumnDef<ProductBenefit>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "benefits",
      header: "Benefits",
      cell: ({ row }) => {
        const benefits = row?.original?.benefits;
        return <div>{benefits.length > 0 ? `${benefits.length} ${benefits.length === 1 ? "Benefit" : "Benefits"}` : "No benefits"}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Visibility",
      cell: ({ row }) => {
        const productBenefit = row?.original;
        return (
          <ToggleSwitch
            checked={productBenefit?.status}
            onToggle={async (status: boolean) => {
              const response = await updateProductBenefit(productBenefit?._id, { status });
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
        const productBenefit = row?.original;

        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="edit"
              tooltip="Edit"
              onClick={() => {
                setSelectedProductBenefit(productBenefit);
                openSheet();
              }}
            />

            <ActionButton type="delete" tooltip="Delete" onClick={() => setProductBenefitToDelete(productBenefit)} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PaginationDataTable
        data={data.docs}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search by Title..."
        pagination={true}
        total={total}
      />

      <ProductBenefitFormSheet productBenefit={selectedProductBenefit} setSelectedProductBenefit={setSelectedProductBenefit} />

      <DeleteModal
        isOpen={!!productBenefitToDelete}
        title="Delete Product Benefit Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{productBenefitToDelete?.title}"</span>{" "}
            benefit?
          </span>
        }
        onClose={() => setProductBenefitToDelete(null)}
        onDelete={async () => {
          const response = await deleteProductBenefit(productBenefitToDelete?._id);
          return { success: !!response?.data };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting benefit..."
        successMessage="Benefit deleted successfully!"
        errorMessage="Failed to delete benefit!"
      />
    </>
  );
}
