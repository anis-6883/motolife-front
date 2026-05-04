"use client";

import { deleteProductFaq, updateProductFaq } from "@/actions/admin/product-management/product-faq-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import routes from "@/config/routes";
import { useFormSheet } from "@/context/FormSheetContext";
import { ProductFAQ, ProductFAQData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuReplyAll } from "react-icons/lu";
import { PiMountains } from "react-icons/pi";
import ProductFaqFormSheet from "./ProductFaqFormSheet";

export default function ProductFaqTable({ data }: { data: ProductFAQData }) {
  const { openSheet } = useFormSheet();
  const [total, setTotal] = useState(0);
  const [selectedProductFAQ, setSelectedProductFAQ] = useState<ProductFAQ | null>(null);
  const [productFAQToDelete, setProductFAQToDelete] = useState<ProductFAQ | null>(null);

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs);
    }
  }, [data]);

  const columns: ColumnDef<ProductFAQ>[] = [
    {
      accessorKey: "questionId",
      header: "Question ID",
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => {
        return row?.original?.product?.thumbnail ? (
          <div className="flex items-center gap-2">
            <div className="relative h-[50px] w-[50px] overflow-hidden rounded-full">
              <img
                src={row?.original?.product?.thumbnail}
                alt={row?.original?.product?.name}
                width={50}
                height={50}
                className="h-full w-full object-cover p-1"
              />
            </div>
            <Link
              href={routes.privateRoutes.admin.productManagement.inHouseProduct.show(row?.original?.product?._id)}
              className="hover:text-primary"
            >
              {row?.original?.product?.name.length > 30 ? row?.original?.product?.name.slice(0, 30) + "..." : row?.original?.product?.name}
            </Link>
          </div>
        ) : (
          <PiMountains className="text-3xl" />
        );
      },
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
    },
    // {
    //   accessorKey: "customerEmail",
    //   header: "Customer Email",
    // },
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => (
        <p>
          {row?.original?.question
            ? row?.original?.question?.length > 30
              ? row?.original?.question?.slice(0, 30) + "..."
              : row?.original?.question
            : "N/A"}
        </p>
      ),
    },
    {
      accessorKey: "answer",
      header: "Answer",
      cell: ({ row }) => (
        <p>
          {row?.original?.answer
            ? row?.original?.answer?.length > 30
              ? row?.original?.answer?.slice(0, 30) + "..."
              : row?.original?.answer
            : "N/A"}
        </p>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <p>{moment(row?.original?.createdAt).format("MMM DD, YYYY")}</p>,
    },
    {
      accessorKey: "status",
      header: "Visibility",
      cell: ({ row }) => {
        const productFAQ = row?.original;
        return (
          <ToggleSwitch
            checked={productFAQ?.status}
            onToggle={async (status: boolean) => {
              if (!productFAQ?.answer) {
                return { success: false, message: "Please answer the question first to make it visible!" };
              }

              const response = await updateProductFaq(productFAQ?._id, { status });
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
              type="default"
              tooltip="Reply"
              onClick={() => {
                setSelectedProductFAQ(attribute);
                openSheet();
              }}
              icon={<LuReplyAll />}
            />

            <ActionButton type="delete" tooltip="Delete" onClick={() => setProductFAQToDelete(attribute)} />
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
        searchPlaceholder="Search by Name, Email & Question..."
        pagination={true}
        total={total}
      />

      <ProductFaqFormSheet key={selectedProductFAQ?._id} productFAQ={selectedProductFAQ} setSelectedProductFAQ={setSelectedProductFAQ} />

      <DeleteModal
        isOpen={!!productFAQToDelete}
        title="Delete Product FAQ Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{productFAQToDelete?.question}"</span>{" "}
            product FAQ?
          </span>
        }
        onClose={() => setProductFAQToDelete(null)}
        onDelete={async () => {
          const response = await deleteProductFaq(productFAQToDelete?._id);
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
