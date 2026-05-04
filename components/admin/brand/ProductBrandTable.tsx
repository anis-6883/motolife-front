"use client";

import { deleteBrand, sortBrands, updateBrand } from "@/actions/admin/product-management/brand-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import SortDateTable from "@/components/shared/SortDateTable";
import Toast from "@/components/shared/Toast";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { tableIds } from "@/config/constant";
import { useFormSheet } from "@/context/FormSheetContext";
import { Brand } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { PiMountains } from "react-icons/pi";
import ProductBrandFormSheet from "./ProductBrandFormSheet";

export default function ProductBrandTable({ data }: { data: Brand[] }) {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const { openSheet } = useFormSheet();

  const handleSort = async (sortedIds: string[]) => {
    try {
      const t = Toast.loading({
        title: "Sorting",
        description: "Sorting brand order...⏳",
      });

      const response = await sortBrands({ sortedIds });

      if (!response.data) {
        Toast.remove(t);
        Toast.error({
          title: "Failed",
          description: "Failed to sort brand order!",
        });
        return;
      }

      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: "Brand order sorted successfully!",
      });
    } catch (error: any) {
      Toast.error({
        title: "Failed 444",
        description: error?.message || "Failed to sort brand order!",
      });
    }
  };

  const columns: ColumnDef<{
    _id: string;
    name: string;
    status: boolean;
    image?: string;
  }>[] = [
    {
      accessorKey: "image",
      header: "Logo",
      cell: ({ row }) => {
        return row?.original?.image ? (
          <div className="flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full">
            <img src={row?.original?.image} alt={row?.original?.name} width={50} height={50} className="h-full w-full object-cover p-1" />
          </div>
        ) : (
          <div className="flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full">
            <PiMountains className="text-3xl" />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
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
              const response = await updateBrand(brand?._id, { status });
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
        const brand = row?.original;

        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="edit"
              tooltip="Edit"
              onClick={() => {
                setSelectedBrand(brand);
                openSheet();
              }}
            />

            <ActionButton type="delete" tooltip="Delete" onClick={() => setBrandToDelete(brand)} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <SortDateTable data={data} columns={columns} tableId={tableIds.productBrand} onSortEnd={handleSort} pagination={false} />

      <ProductBrandFormSheet key={selectedBrand?._id} brand={selectedBrand} setSelectedBrand={setSelectedBrand} />

      <DeleteModal
        isOpen={!!brandToDelete}
        title="Delete Brand Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{brandToDelete?.name}"</span> brand?
          </span>
        }
        warningNote={`Note: Total ${brandToDelete?.totalProducts} ${brandToDelete?.totalProducts === 1 ? "product" : "products"} will be hidden!`}
        onClose={() => setBrandToDelete(null)}
        onDelete={async () => {
          const response = await deleteBrand(brandToDelete?._id);
          return { success: !!response?.data };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting brand..."
        successMessage="Brand deleted successfully!"
        errorMessage="Failed to delete brand!"
      />
    </>
  );
}
