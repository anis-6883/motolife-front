"use client";

import { deleteProductAttribute, updateProductAttribute } from "@/actions/admin/product-management/product-attribute-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { Badge } from "@/components/ui/badge";
import { useFormSheet } from "@/context/FormSheetContext";
import { Attribute, AttributeData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import ProductAttributeFormSheet from "./ProductAttributeFormSheet";

export default function ProductAttributeTable({ data }: { data: AttributeData }) {
  const [total, setTotal] = useState(0);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const [attributeToDelete, setAttributeToDelete] = useState<Attribute | null>(null);
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
    values: string[];
  }>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => {
        const values = row?.original?.values;

        return (
          <div className="flex flex-wrap gap-2">
            {values?.map((value, index) => (
              <Badge key={index}>{value}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Visibility",
      cell: ({ row }) => {
        const brand = row?.original;
        return (
          <ToggleSwitch
            checked={brand?.status}
            onToggle={async (status: boolean) => {
              const response = await updateProductAttribute(brand?._id, { status });
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
        const attribute = row?.original;

        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="edit"
              tooltip="Edit"
              onClick={() => {
                setSelectedAttribute(attribute);
                openSheet();
              }}
            />

            <ActionButton type="delete" tooltip="Delete" onClick={() => setAttributeToDelete(attribute)} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PaginationDataTable
        data={data?.docs}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search by Name..."
        pagination={true}
        total={total}
      />

      <ProductAttributeFormSheet key={selectedAttribute?._id} attribute={selectedAttribute} setSelectedAttribute={setSelectedAttribute} />

      <DeleteModal
        isOpen={!!attributeToDelete}
        title="Delete Attribute Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{attributeToDelete?.name}"</span> attribute?
          </span>
        }
        onClose={() => setAttributeToDelete(null)}
        onDelete={async () => {
          const response = await deleteProductAttribute(attributeToDelete?._id);
          return { success: !!response?.data };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting attribute..."
        successMessage="Attribute deleted successfully!"
        errorMessage="Failed to delete attribute!"
      />
    </>
  );
}
