"use client";

import { deleteBanner, updateBanner } from "@/actions/admin/banners/banner-management-action";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { useFormSheet } from "@/context/FormSheetContext";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useState } from "react";
import BannerFormSheet from "./BannerFormSheet";
import { BannerItem, BannersData } from "./type";

export default function BannersTable({ data }: { data: BannersData }) {
  const [total, setTotal] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState<BannerItem | null>(null);
  const [deleteBannerItem, setDeleteBannerItem] = useState<BannerItem | null>(null);
  const { openSheet } = useFormSheet();

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs);
    }
  }, [data]);

  const columns: ColumnDef<BannerItem>[] = [
    {
      accessorKey: "sl",
      header: () => <div className="w-16 text-center">SL</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const { image } = row.original;
        return (
          <div className="w-fit rounded-lg border bg-gray-100 p-0.5">
            <Image src={image} alt="Banner Image" width={60} height={40} className="rounded object-cover" />
          </div>
        );
      },
    },
    {
      accessorKey: "bannerUrl",
      header: "Banner Url",
      cell: ({ row }) => {
        const title = row.original?.bannerUrl ?? "#";

        return <div>{title.length > 70 ? title.slice(0, 70) + "..." : title}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { status, _id } = row.original;
        return (
          <ToggleSwitch
            checked={status}
            onToggle={async (value: boolean) => {
              const response: any = await updateBanner(_id, { status: value });
              return { success: !!response?.data, message: response?.data?.message ?? response?.error };
            }}
            activeText="Active"
            inactiveText="Inactive"
          />
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const banner = row.original;
        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="edit"
              tooltip="Edit"
              onClick={() => {
                setSelectedBanner(banner);
                openSheet();
              }}
            />
            <ActionButton type="delete" tooltip="Delete" onClick={() => setDeleteBannerItem(banner)} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PaginationDataTable data={data?.docs} columns={columns} pagination={true} total={total} />

      <BannerFormSheet banner={selectedBanner} setSelectBanner={setSelectedBanner} />

      <DeleteModal
        isOpen={!!deleteBannerItem}
        title="Delete Banner?"
        description={<span>Are you sure you want to delete this banner?</span>}
        onClose={() => setDeleteBannerItem(null)}
        onDelete={async () => {
          const response: any = await deleteBanner(deleteBannerItem?._id);
          return {
            success: !!response?.data,
            message: response?.data?.message ?? response?.error,
          };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting banner..."
        successMessage="Banner deleted successfully"
        errorMessage="Failed to delete banner!"
      />
    </>
  );
}
