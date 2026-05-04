"use client";

import { removeProductFromOffer } from "@/actions/admin/offers-management/offers-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { IOffers } from "./types";

export default function OffersProductDataTable({ data, id }: { data: IOffers; id: string }) {
  const [offerToDelete, setOfferToDelete] = useState<IOffers | null>(null);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs || 0);
    }
  }, [data]);

  const offersColumnsWithItemsDropdown: ColumnDef<any>[] = [
    {
      accessorKey: "sl",
      header: () => <div className="w-10 text-center"> SL</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div className="">Product Info</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <img src={row.original?.thumbnail} alt="" className="h-7 w-7 rounded border p-1" />
          <p>{row.original?.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "brand",
      header: () => <div className="">Brand</div>,
      cell: ({ row }) => (
        <div className="">
          <p>{row.original?.brand?.name ?? "-"}</p>
        </div>
      ),
    },
    {
      accessorKey: "discountType",
      header: () => <div className="">Discount Type</div>,
      cell: ({ row }) => {
        const discountType = row.original?.discountType;
        let suffix = "";
        if (discountType === "percentage") {
          suffix = "%";
        }
        return (
          <div className="capitalize">
            <p>{discountType ? `${discountType} ${suffix}` : "-"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "discountValue",
      header: () => <div className="">Discount Value</div>,
      cell: ({ row }) => {
        const discountValue = row.original?.discountValue;

        return (
          <div className="capitalize">
            <p>{discountValue ?? 0}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "discountPrice",
      header: () => <div className="">Discount Price</div>,
      cell: ({ row }) => {
        const discountPrice = row.original?.discountPrice;

        return (
          <div className="capitalize">
            <p>{discountPrice ?? 0}</p>
          </div>
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const offer = row.original;
        return (
          <div className="flex items-center gap-2">
            <ActionButton type="delete" tooltip="Delete" onClick={() => handleDelete(offer)} />
          </div>
        );
      },
    },
  ];

  const handleDelete = (offer: IOffers) => {
    setOfferToDelete(offer);
  };

  return (
    <>
      <PaginationDataTable
        data={data?.docs || []}
        columns={offersColumnsWithItemsDropdown}
        searchable={true}
        searchPlaceholder="Search by product name.."
        pagination={true}
        total={total}
        // filters={[
        //   {
        //     key: "sortOrder",
        //     label: "Sort By",
        //     options: [
        //       { label: "New to Old", value: "__all__" },
        //       { label: "Old to New", value: "asc" },
        //     ],
        //   },
        //   {
        //     key: "status",
        //     label: "Status",
        //     options: [
        //       { label: "All", value: "__all__" },
        //       { label: "Active", value: "true" },
        //       { label: "Inactive", value: "false" },
        //     ],
        //   },
        // ]}
      />
      <DeleteModal
        isOpen={!!offerToDelete}
        title="Delete Offer Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{offerToDelete?.name}"</span> offer?
          </span>
        }
        warningNote={
          offerToDelete?.items?.length
            ? `Note: This offer contains ${offerToDelete.items.length} ${offerToDelete.items.length === 1 ? "item" : "items"}.`
            : undefined
        }
        onClose={() => setOfferToDelete(null)}
        onDelete={async () => {
          const response: any = await removeProductFromOffer(id, offerToDelete?._id as string);
          return {
            success: !!response?.data,
            message: response?.data?.message ?? response?.error,
          };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting offer..."
        successMessage="Offer deleted successfully!"
        errorMessage="Failed to delete offer!"
      />
    </>
  );
}
