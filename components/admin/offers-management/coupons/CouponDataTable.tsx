"use client";

import { updateCoupon } from "@/actions/admin/offers-management/coupon-actions";
import { deleteOffers } from "@/actions/admin/offers-management/offers-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { CouponType, DISCOUNT_TYPE } from "@/config/constant";
import { useFormSheet } from "@/context/FormSheetContext";
import { CouponData, TCoupon } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { useEffect, useState } from "react";
import CouponFormSheet from "./CouponFormSheet";

export default function CouponDataTable({ data }: { data: CouponData }) {
  const [total, setTotal] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState<TCoupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<TCoupon | null>(null);
  const { openSheet } = useFormSheet();

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs);
    }
  }, [data]);

  const columns: ColumnDef<TCoupon>[] = [
    {
      header: "SL",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "type",
      header: "Coupon Type",
      cell: ({ row }) => {
        return <p>{CouponType[row.original.type]}</p>;
      },
    },
    {
      accessorKey: "title",
      header: "Coupon Title",
    },
    {
      accessorKey: "code",
      header: "Coupon Code",
    },
    {
      accessorKey: "bearer",
      header: "Bearer",
      cell: ({ row }) => {
        const bearer = row.original.bearer;
        return <span className="capitalize">{bearer}</span>;
      },
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => <p>{row.original.vendor ?? "N/A"}</p>,
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => <p>{row.original.customer ?? "N/A"}</p>,
    },
    {
      accessorKey: "endDate",
      header: "Expire At",
      cell: ({ row }) => <p>{moment(row.original.endDate).format("MMM DD, YYYY")}</p>,
    },
    {
      accessorKey: "discount",
      header: "Discount",
      cell: ({ row }) => {
        const couponType = row.original.type;

        if (couponType === "free_delivery") {
          return <p>Free Delivery</p>;
        } else {
          if (row.original.discountType === DISCOUNT_TYPE.FLAT) {
            return <p>{row.original.discountValue} BDT OFF</p>;
          } else {
            return <p>{row.original.discountValue}% Discount</p>;
          }
        }
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const coupon = row?.original;
        return (
          <ToggleSwitch
            checked={coupon?.status}
            onToggle={async (status: boolean) => {
              const response = await updateCoupon(coupon?._id, { status });
              return { success: !!response?.data };
            }}
            activeText="Active"
            inactiveText="Inactive"
          />
        );
      },
    },
    {
      id: "actions",
      header: () => <p className="p-text-14 text-center">Action</p>,
      cell: ({ row }) => {
        const coupon = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <ActionButton type="edit" tooltip="Edit" onClick={() => handleEdit(coupon)} />
            <ActionButton type="delete" tooltip="Delete" onClick={() => handleDelete(coupon)} />
          </div>
        );
      },
    },
  ];

  const handleEdit = (coupon: TCoupon) => {
    setSelectedCoupon(coupon);
    openSheet();
  };

  const handleDelete = (coupon: TCoupon) => {
    setCouponToDelete(coupon);
  };

  return (
    <>
      <PaginationDataTable
        searchPlaceholder="Search by Coupon Title & Code..."
        data={data?.docs || []}
        columns={columns}
        searchable={true}
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
            options: [
              { label: "All", value: "__all__" },
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ],
          },
        ]}
      />

      <CouponFormSheet coupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon} />

      <DeleteModal
        isOpen={!!couponToDelete}
        title="Delete Offer Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{couponToDelete?.title}"</span> offer?
          </span>
        }
        onClose={() => setCouponToDelete(null)}
        onDelete={async () => {
          const response: any = await deleteOffers(couponToDelete?._id);

          return { success: !!response?.data, message: response.data.message ?? response.error };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting offer..."
        successMessage="Offer deleted successfully!"
        errorMessage="Failed to delete offer!"
      />
    </>
  );
}
