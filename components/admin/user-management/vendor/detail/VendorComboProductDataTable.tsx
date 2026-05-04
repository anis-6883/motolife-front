"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { deleteVendorProduct, updateVendorComboProduct } from "@/actions/admin/user-management/vendor-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { PRODUCT_STATUS_OPTIONS } from "@/config/constant";
import routes from "@/config/routes";
import formatDateToDateString from "@/lib/client-utils";
import { IProductListObjAdmin } from "@/lib/types";

type VendorProductData = {
  docs: IProductListObjAdmin[];
  pagination: {
    totalDocs: number;
  };
};
export default function VendorComboProductDataTable({ data, vendorId }: { data: VendorProductData; vendorId: string }) {
  const [productToDelete, setProductToDelete] = useState<IProductListObjAdmin | null>(null);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs || 0);
    }
  }, [data]);

  const columns: ColumnDef<IProductListObjAdmin>[] = [
    {
      header: "SL",
      cell: ({ row }) => row.index + 1,
    },

    {
      header: "Product ID",
      cell: ({ row }) => row.original.productId || "N/A",
    },

    {
      header: "Product Name",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
              <ImageWithFallback
                fallbackSrc="/images/auth/logo.png"
                src={product?.thumbnail}
                alt={product?.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="p-text-16 leading-6">{product?.name}</p>
          </div>
        );
      },
    },
    {
      header: "Date Added",
      cell: ({ row }) => {
        const product = row.original;
        return <p className="p-text-16 leading-6">{formatDateToDateString(product?.createdAt)}</p>;
      },
    },

    {
      header: "Selling Price",
      cell: ({ row }) => {
        const product = row.original;
        return <p className="p-text-16 leading-6">{product?.sellingPrice}</p>;
      },
    },
    {
      header: "Stock",
      cell: ({ row }) => {
        const product = row.original;
        return <p className="p-text-16 leading-6">{product?.stockQuantity}</p>;
      },
    },
    {
      accessorKey: "isFeatured",
      header: "Featured Product",
      cell: ({ row }) => {
        const product = row?.original;
        return (
          <ToggleSwitch
            checked={!!product?.isFeatured}
            onToggle={async (status: boolean) => {
              const response = await updateVendorComboProduct(product?.seller, product?._id, { isFeatured: status });
              return { success: !!response?.data };
            }}
          />
        );
      },
    },
    {
      accessorKey: "isPublished",
      header: "Publish",
      cell: ({ row }) => {
        const product = row?.original;
        return (
          <ToggleSwitch
            checked={!!product?.isPublished}
            onToggle={async (status: boolean) => {
              const response = await updateVendorComboProduct(product?.seller, product?._id, { isPublished: status });
              return { success: !!response?.data };
            }}
          />
        );
      },
    },

    {
      accessorKey: "isNewArrived",
      header: "New",
      cell: ({ row }) => {
        const product = row?.original;
        return (
          <ToggleSwitch
            checked={!!product?.isNewArrived}
            onToggle={async (status: boolean) => {
              const response = await updateVendorComboProduct(product?.seller, product?._id, { isNewArrived: status });
              return { success: !!response?.data };
            }}
          />
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="view"
              tooltip="View"
              onClick={() => router.push(routes.privateRoutes.admin.userManagement.vendor.comboProductDetails(vendorId, product._id))}
            />
            <ActionButton
              type="edit"
              tooltip="Edit"
              onClick={() => router.push(routes.privateRoutes.admin.userManagement.vendor.comboProductEdit(vendorId, product._id))}
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
        data={data?.docs || []}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search by Product Name..."
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
            key: "status",
            label: "Status",
            options: [{ label: "All", value: "__all__" }, ...PRODUCT_STATUS_OPTIONS],
          },
          {
            key: "isFeatured",
            label: "Featured",
            options: [
              { label: "All", value: "__all__" },
              { label: "Featured", value: "true" },
              { label: "Not Featured", value: "false" },
            ],
          },
          {
            key: "isPublished",
            label: "Published",
            options: [
              { label: "All", value: "__all__" },
              { label: "Published", value: "true" },
              { label: "Not Published", value: "false" },
            ],
          },
          {
            key: "isNew",
            label: "New Arrived",
            options: [
              { label: "All", value: "__all__" },
              { label: "Newly Added", value: "true" },
              { label: "Old Stock", value: "false" },
            ],
          },
        ]}
      />

      {productToDelete ? (
        <DeleteModal
          isOpen={!!productToDelete}
          title="Delete Product Confirmation!"
          description={
            <span>
              Are you sure you want to delete this <span className="text-primary font-semibold">"{productToDelete?.name}"</span> product?
            </span>
          }
          warningNote={`Note: Total ${productToDelete?.stockQuantity} ${productToDelete?.stockQuantity === 1 ? "stock" : "stocks"} will be hidden!`}
          onClose={() => setProductToDelete(null)}
          onDelete={async () => {
            const response = await deleteVendorProduct(productToDelete?.seller, productToDelete?._id);
            return { success: !!response?.data };
          }}
          deleteButtonText="Delete"
          loadingMessage="Deleting product..."
          successMessage="Product deleted successfully!"
          errorMessage="Failed to delete product!"
        />
      ) : null}
    </>
  );
}
