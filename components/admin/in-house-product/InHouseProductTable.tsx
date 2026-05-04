"use client";

import { deleteComboOffer, updateComboOffer } from "@/actions/admin/product-management/combo-offer-actions";
import { deleteInHouseProduct, updateInHouseProduct } from "@/actions/admin/product-management/in-house-product-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import routes from "@/config/routes";
import { useFormSheet } from "@/context/FormSheetContext";
import { InHouseProduct, InHouseProductData } from "@/lib/types";
import { dateFormat } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { LuPackageX } from "react-icons/lu";
import { PiMountains } from "react-icons/pi";
import DamageTableSheet from "./DamageTableSheet";

export default function InHouseProductTable({
  data,
  categoryOptions,
  brandOptions,
  mode = "in-house",
}: {
  data: InHouseProductData;
  categoryOptions: { label: string; value: string }[];
  brandOptions: { label: string; value: string }[];
  mode?: "in-house" | "combo-offer" | "vendor";
}) {
  const { openSheet } = useFormSheet();
  const [total, setTotal] = useState(0);
  const [productToDelete, setProductToDelete] = useState<InHouseProduct | null>(null);
  const [damageSetupProduct, setDamageSetupProduct] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs);
    }
  }, [data]);

  const columns: ColumnDef<InHouseProduct>[] = [
    {
      id: "serial",
      header: "SL",
      accessorFn: (_row: any, index: number) => index + 1,
    },
    {
      accessorKey: "productId",
      header: "Product ID",
    },
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => {
        return row?.original?.thumbnail ? (
          <div className="relative h-[50px] w-[50px] overflow-hidden rounded-full">
            <img
              src={row?.original?.thumbnail}
              alt={row?.original?.name}
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row?.original?.name || "";

        return <span title={name}>{name.length > 60 ? name.slice(0, 60) + "..." : name}</span>;
      },
    },
    ...(mode === "in-house"
      ? [
          {
            accessorKey: "category.name",
            header: "Category",
          },
          {
            accessorKey: "brand.name",
            header: "Brand",
          },
        ]
      : []),
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return <span>{dateFormat(row?.original?.createdAt)}</span>;
      },
    },
    {
      accessorKey: "sellingPrice",
      header: "Selling Price (BDT)",
    },
    {
      accessorKey: "stockQuantity",
      header: "Stock",
      cell: ({ row }) => {
        if (row?.original?.variants?.length > 0) {
          return row?.original?.variants?.reduce((acc, variant) => acc + variant?.stock, 0);
        }
        return row?.original?.stockQuantity;
      },
    },
    {
      accessorKey: "isPublished",
      header: "Status",
      cell: ({ row }) => {
        const product = row?.original;

        return (
          <ToggleSwitch
            checked={!!product?.isPublished}
            onToggle={async (isPublished: boolean) => {
              if (mode === "in-house") {
                const response = await updateInHouseProduct(product?._id, { isPublished });
                return { success: !!response?.data };
              }

              if (mode === "combo-offer") {
                const response = await updateComboOffer(product?._id, { isPublished });
                return { success: !!response?.data };
              }

              return { success: false };
            }}
            showLabel={false}
          />
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row?.original;
        const stock =
          product?.variants?.length > 0 ? product?.variants?.reduce((acc, variant) => acc + variant?.stock, 0) : product?.stockQuantity;
        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="view"
              tooltip="Show"
              href={
                mode === "in-house"
                  ? routes.privateRoutes.admin.productManagement.inHouseProduct.show(product?._id)
                  : routes.privateRoutes.admin.productManagement.comboOffer.show(product?._id)
              }
            />
            <ActionButton
              type="edit"
              tooltip="Edit"
              href={
                mode === "in-house"
                  ? routes.privateRoutes.admin.productManagement.inHouseProduct.edit(product?._id)
                  : routes.privateRoutes.admin.productManagement.comboOffer.edit(product?._id)
              }
            />

            <ActionButton type="delete" tooltip="Delete" onClick={() => setProductToDelete(product)} />

            {mode === "in-house" && (
              <ActionButton
                disabled={stock === 0}
                type="default"
                icon={<LuPackageX />}
                tooltip="Mark as Damaged"
                onClick={() => {
                  setDamageSetupProduct(product);
                  openSheet();
                }}
              />
            )}
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
        searchPlaceholder="Search by Name & Product ID..."
        columns={columns}
        pagination={true}
        total={total}
        filters={[
          {
            key: "sortOrder",
            label: "Sort By",
            options: [
              { label: "Select", value: "__all__" },
              { label: "Old to New", value: "asc" },
              { label: "New to Old", value: "desc" },
            ],
          },
          ...(mode === "in-house"
            ? [
                {
                  key: "category",
                  label: "Category",
                  options: [{ label: "Select", value: "__all__" }, ...categoryOptions],
                },
                {
                  key: "brand",
                  label: "Brand",
                  options: [{ label: "Select", value: "__all__" }, ...brandOptions],
                },
              ]
            : []),
          {
            key: "isPublished",
            label: "Status",
            options: [
              { label: "Select", value: "__all__" },
              { label: "Published", value: "true" },
              { label: "Hidden", value: "false" },
            ],
          },
        ]}
      />

      <DeleteModal
        isOpen={!!productToDelete}
        title="Delete Product Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{productToDelete?.name}"</span> product?
          </span>
        }
        onClose={() => setProductToDelete(null)}
        onDelete={async () => {
          if (mode === "in-house") {
            const response = await deleteInHouseProduct(productToDelete?._id);
            return { success: !!response?.data };
          }

          if (mode === "combo-offer") {
            const response = await deleteComboOffer(productToDelete?._id);
            return { success: !!response?.data };
          }

          return { success: false };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting product..."
        successMessage="Product deleted successfully!"
        errorMessage="Failed to delete product!"
      />

      <DamageTableSheet damageProduct={damageSetupProduct} setSelectDamageProduct={setDamageSetupProduct} />
    </>
  );
}
