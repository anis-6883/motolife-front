"use client";

import { deleteOffers, updateOffers } from "@/actions/admin/offers-management/offers-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import routes from "@/config/routes";
import { useFormSheet } from "@/context/FormSheetContext";
import { useResourceType } from "@/store/useResourceType";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddSaleFormSheet from "./AddSaleFormSheet";
import { IOffers, ResourceType, Sale } from "./types";

export default function OffersDataTable({ data, vendorId }: { data: IOffers; vendorId?: string }) {
  const router = useRouter();
  const [offerToDelete, setOfferToDelete] = useState<IOffers | null>(null);
  const [total, setTotal] = useState(0);
  const { openSheet, isOpen } = useFormSheet();
  const [selectedOffer, setSelectedOffer] = useState<Sale | null>(null);
  const { addType, removeType } = useResourceType();

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs || 0);
      if (data?.docs?.some((item: any) => item.resourceType === "flash_sale")) {
        addType("flash_sale");
      }
      if (data?.docs?.some((item: any) => item.resourceType === "todays_deal")) {
        addType("todays_deal");
      }
      if (data?.docs?.some((item: any) => item.resourceType === "category")) {
        addType("category");
      }
    }
  }, [data, addType]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedOffer(null);
    }
  }, [isOpen]);

  const offersColumnsWithItemsDropdown: ColumnDef<IOffers>[] = [
    {
      header: "SL",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "title",
      header: "Offer Title",
    },
    {
      header: "Duration",
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), "dd MMM yyyy") + " - " + format(new Date(row.original.endDate), "dd MMM yyyy"),
    },
    {
      id: "itemsCount",
      header: () => <p className="text-center">Product Quantity</p>,
      cell: ({ row }) => {
        const itemsCount = row.original.itemsCount;
        if (itemsCount === 0) {
          return <p className="text-muted-foreground text-center">No products</p>;
        }
        return (
          <p className="text-muted-foreground text-center">
            <span className="rounded-md bg-[#F4F4F4] p-2 font-bold">{itemsCount}</span>
          </p>
        );
      },
    },
    {
      id: "resourceType",
      header: () => <p className="text-center">Resource Type</p>,
      cell: ({ row }) => {
        let tyeText = "";
        if (row.original.resourceType === "flash_sale") {
          tyeText = "Flash Sale";
        } else if (row.original.resourceType === "todays_deal") {
          tyeText = "Toady's Deal";
        } else {
          tyeText = row.original.resourceType as string; // now there is tow type of type
        }
        return (
          <p className="text-muted-foreground text-center">
            <span className="capitalize">{tyeText ?? "-"}</span>
          </p>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <p className="text-center">Status</p>,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div className="flex justify-center">
            <ToggleSwitch
              checked={!!status}
              onToggle={async (status: boolean) => {
                const response = await updateOffers(row.original?._id, { status });
                return { success: !!response?.data };
              }}
              activeText="Active"
              inactiveText="Inactive"
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <p className="p-text-14 text-center">Action</p>,
      cell: ({ row }) => {
        const offer = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <ActionButton
              type="default"
              icon={<Plus className="h-4 w-4" />}
              tooltip="Add Products"
              onClick={() => {
                router.push(
                  vendorId
                    ? routes.privateRoutes.admin.userManagement.vendor.offerDetails(vendorId, offer._id)
                    : routes.privateRoutes.admin.offerAndDealsManagement.offerList.addProduct(offer._id)
                );
              }}
            />
            <ActionButton type="edit" tooltip="Edit" onClick={() => handleEdit(offer)} />
            <ActionButton type="delete" tooltip="Delete" onClick={() => handleDelete(offer)} />
          </div>
        );
      },
    },
  ];

  const handleEdit = (offer: IOffers) => {
    const saleData: Sale = {
      _id: offer._id,
      title: offer.title,
      startDate: offer.startDate || offer.createdAt,
      endDate: offer.endDate,
      resourceType: offer.resourceType as ResourceType,
      bannerUrl: offer.url || "",
      image: offer.image || "",
      status: offer.status,
      seller: offer?.seller,
      comboProduct: offer?.comboProduct,
      category: offer?.category,
    };
    setSelectedOffer(saleData);
    openSheet();
  };

  const handleDelete = (offer: IOffers) => {
    setOfferToDelete(offer);
  };

  return (
    <>
      <PaginationDataTable
        searchPlaceholder="Search by Offer Name..."
        data={data?.docs || []}
        columns={offersColumnsWithItemsDropdown}
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

      <AddSaleFormSheet sale={selectedOffer} />

      <DeleteModal
        isOpen={!!offerToDelete}
        title="Delete Offer Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{offerToDelete?.title}"</span> offer?
          </span>
        }
        warningNote={
          offerToDelete?.items?.length
            ? `Note: This offer contains ${offerToDelete.items.length} ${offerToDelete.items.length === 1 ? "item" : "items"}.`
            : undefined
        }
        onClose={() => setOfferToDelete(null)}
        onDelete={async () => {
          const response: any = await deleteOffers(offerToDelete?._id);
          if (offerToDelete?.resourceType === "flash_sale" || offerToDelete?.resourceType === "category") {
            removeType(offerToDelete?.resourceType);
          }

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
