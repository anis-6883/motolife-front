"use client";

import {
  deleteProductCategory,
  sortProductCategories,
  updateProductCategory,
} from "@/actions/admin/product-management/product-category-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import SortDateTable from "@/components/shared/SortDateTable";
import Toast from "@/components/shared/Toast";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { tableIds } from "@/config/constant";
import routes from "@/config/routes";
import { useHandleClientLogout } from "@/hooks/useHandleClientLogout";
import { ProductCategory } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { PiMountains } from "react-icons/pi";
import SubcategorySheet from "./SubcategorySheet";

export default function ProductCategoryTable({ data }: { data: ProductCategory[] }) {
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);
  const handleClientLogout = useHandleClientLogout();

  useEffect(() => {
    if (data) {
      if (selectedCategory) {
        setSelectedCategory(data.find((item) => item._id === selectedCategory._id) || null);
      }
    }
  }, [data, selectedCategory]);

  // Handle Category Sorting
  const handleSort = async (sortedIds: string[]) => {
    try {
      const t = Toast.loading({
        title: "Sorting",
        description: "Sorting category order...⏳",
      });

      const response = await sortProductCategories({ sortedIds });

      if (!response.data) {
        Toast.remove(t);
        await handleClientLogout("401 or 500 Failed", "Failed to sort category order!");
        return;
      }

      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: "Category order sorted successfully!",
      });
    } catch (error: any) {
      Toast.error({
        title: "Failed",
        description: error?.message || "Failed to sort category order!",
      });
    }
  };

  const columns: ColumnDef<ProductCategory>[] = [
    {
      accessorKey: "image",
      header: "Logo",
      cell: ({ row }) => {
        return row?.original?.image ? (
          <div className="relative h-[50px] w-[50px] overflow-hidden rounded-full">
            <img src={row?.original?.image} alt={row?.original?.name} width={50} height={50} className="h-full w-full object-cover p-1" />
          </div>
        ) : (
          <PiMountains className="text-3xl" />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "subCategories",
      header: "Subcategories",
      cell: ({ row }) => {
        const subcategoryCount = row?.original?.subCategories?.length || 0;
        return (
          <div className="flex flex-col gap-1">
            {subcategoryCount > 0 ? (
              <span
                className="text-muted-foreground cursor-pointer text-sm underline select-none dark:text-white"
                onClick={() => {
                  setSelectedCategory(row?.original);
                  setShowSubCategory(true);
                }}
              >
                {subcategoryCount} {subcategoryCount > 1 ? "subcategories" : "subcategory"}
              </span>
            ) : (
              <span className="text-muted-foreground text-sm dark:text-white">No subcategories</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Visibility",
      cell: ({ row }) => {
        const category = row?.original;
        return (
          <ToggleSwitch
            checked={!!category?.status}
            onToggle={async (status: boolean) => {
              const response = await updateProductCategory(category?._id, { status });
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
        const category = row?.original;

        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="edit"
              tooltip="Edit"
              href={routes.privateRoutes.admin.productManagement.productCategory.edit(category?._id)}
            />

            <ActionButton type="delete" tooltip="Delete" onClick={() => setCategoryToDelete(category)} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <SortDateTable data={data} columns={columns} tableId={tableIds.productCategory} onSortEnd={handleSort} pagination={false} />

      <SubcategorySheet
        showSubCategory={showSubCategory}
        setShowSubCategory={setShowSubCategory}
        selectedCategory={selectedCategory}
        columns={columns}
        tableId={tableIds.productCategory}
        isLoading={false}
        handleSort={handleSort}
      />

      <DeleteModal
        isOpen={!!categoryToDelete}
        title="Delete Category Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{categoryToDelete?.name}"</span> category?
          </span>
        }
        warningNote={`Note: Total ${categoryToDelete?.totalProducts || 0} ${categoryToDelete?.totalProducts === 1 ? "product" : "products"} will be hidden!`}
        onClose={() => setCategoryToDelete(null)}
        onDelete={async () => {
          const response = await deleteProductCategory(categoryToDelete?._id);
          return { success: !!response?.data };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting category..."
        successMessage="Category deleted successfully!"
        errorMessage="Failed to delete category!"
      />
    </>
  );
}
