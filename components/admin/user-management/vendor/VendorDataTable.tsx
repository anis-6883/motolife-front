"use client";

import { deleteVendor, updateVendor } from "@/actions/user-management/vendor-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import Toast from "@/components/shared/Toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  SELLER_ACCOUNT_STATUS_OPTIONS,
  SELLER_VERIFICATION_STATUS_OPTIONS,
  SellerAccountStatus,
  SellerVerificationStatus,
} from "@/config/constant";
import routes from "@/config/routes";
import { Vendor } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useOptimistic, useState, useTransition } from "react";

type VendorData = {
  docs: Vendor[];
  pagination: {
    totalDocs: number;
  };
};
export const statusStyles: Record<SellerAccountStatus, string> = {
  [SellerAccountStatus.LIVE]: "bg-green-dark text-white border-transparent",
  [SellerAccountStatus.SUSPENDED]: "bg-primary text-white border-transparent",
  [SellerAccountStatus.INACTIVE]: "bg-black/40 text-white border-transparent",
  [SellerAccountStatus.ON_VACATION]: "bg-secondary text-white border-transparent",
};

const StatusCell = ({ id, initialStatus }: { id: string; initialStatus: boolean }) => {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: boolean) => {
    startTransition(async () => {
      setOptimisticStatus(newStatus);

      try {
        const res: any = await updateVendor(id, { status: newStatus });
        if (res?.data || !res?.error) {
          Toast.success("Vendor status updated successfully!");
        } else {
          throw new Error(res?.error || res?.message || "Failed to update status");
        }
      } catch (error: any) {
        Toast.error(error?.message || "Something went wrong!");
      }
    });
  };

  return (
    <div className="flex items-center justify-center">
      <Switch checked={optimisticStatus} disabled={isPending} onCheckedChange={handleStatusChange} />
    </div>
  );
};

export default function VendorDataTable({ data }: { data: VendorData }) {
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const [total, setTotal] = useState(0);
  // const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs || 0);
    }
  }, [data]);

  const columns: ColumnDef<Vendor>[] = [
    {
      header: "SL",
      cell: ({ row }) => row.index + 1,
    },

    {
      header: "Shop Name",
      cell: ({ row }) => row.original.store?.storeName || "N/A",
    },

    {
      accessorKey: "name",
      header: "Vendor Name",
    },
    {
      header: "Contact Info",
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <div className="text-sm">
            <p className="font-medium">{vendor?.email}</p>
            <p className="text-muted-foreground">{vendor?.phone}</p>
          </div>
        );
      },
    },
    {
      header: "Verification",
      cell: ({ row }) => {
        const vendor = row.original;

        function VerificationDropdown() {
          const [open, setOpen] = useState(false);

          const currentStatus: SellerVerificationStatus = vendor?.verificationStatus || SellerVerificationStatus.NON_VERIFIED;

          const getStyles = (status: SellerVerificationStatus) => {
            switch (status) {
              case SellerVerificationStatus.VERIFIED:
                return "bg-green-100 text-green-700 border-transparent";
              case SellerVerificationStatus.REJECTED:
                return "bg-primary/5 text-primary border-transparent";
              default:
                return "bg-secondary/10 text-secondary border-transparent";
            }
          };

          const handleChange = async (status: SellerVerificationStatus) => {
            const response = await updateVendor(vendor?._id, { verificationStatus: status });
            return { success: !!response?.data };
          };

          // If already verified/rejected, just show a badge
          if (currentStatus !== SellerVerificationStatus.NON_VERIFIED) {
            return (
              <span className={`p-text-14 rounded-md border px-3 py-1 font-semibold capitalize ${getStyles(currentStatus)}`}>
                {currentStatus.replace(/_/g, " ")}
              </span>
            );
          }

          // Otherwise, show the dropdown
          return (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`p-text-14 flex items-center gap-1 rounded-md border px-3 py-1 font-semibold capitalize ${getStyles(
                    currentStatus
                  )}`}
                >
                  {currentStatus.replace(/_/g, " ")}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                {[SellerVerificationStatus.VERIFIED, SellerVerificationStatus.REJECTED].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onSelect={() => handleChange(status)} // prefer onSelect
                    className="cursor-pointer capitalize"
                  >
                    <span className="p-text-14 font-semibold">{status.replace(/_/g, " ")}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return <VerificationDropdown />;
      },
    },
    {
      accessorKey: "accountStatus",
      header: "Account Status",
      cell: ({ row }) => {
        const vendor = row?.original;
        return (
          <span className={`p-text-14 rounded-md border px-3 py-1 font-semibold capitalize ${statusStyles[vendor?.accountStatus]}`}>
            {vendor?.accountStatus?.replace(/_/g, " ")}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const vendor = row?.original;
        return <StatusCell id={vendor?._id} initialStatus={vendor?.status} />;
      },
    },
    {
      header: "Total Products",
      cell: ({ row }) => row.original.totalProducts ?? 12,
    },

    {
      header: "Total Orders",
      cell: ({ row }) => row.original.totalOrders ?? 25,
    },

    {
      header: "Action",
      cell: ({ row }) => {
        const vendor = row.original;

        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="edit"
              tooltip="Edit"
              onClick={() => router.push(routes.privateRoutes.admin.userManagement.vendor.edit(vendor._id))}
            />
            <ActionButton
              type="view"
              tooltip="View"
              onClick={() => router.push(routes.privateRoutes.admin.userManagement.vendor.view(vendor._id))}
            />
            <ActionButton type="delete" tooltip="Delete" onClick={() => setVendorToDelete(vendor)} />
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
        searchPlaceholder="Search by Name, Email & Phone..."
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
            key: "verificationStatus",
            label: "Verification Status",
            options: [{ label: "All", value: "__all__" }, ...SELLER_VERIFICATION_STATUS_OPTIONS],
          },
          {
            key: "accountStatus",
            label: "Account Status",
            options: [{ label: "All", value: "__all__" }, ...SELLER_ACCOUNT_STATUS_OPTIONS],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "All", value: "__all__" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
      />

      <DeleteModal
        isOpen={!!vendorToDelete}
        title="Delete Vendor Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{vendorToDelete?.name}"</span> vendor?
          </span>
        }
        warningNote={`Note: Total ${vendorToDelete?.totalProducts} ${vendorToDelete?.totalProducts === 1 ? "product" : "products"} will be hidden!`}
        onClose={() => setVendorToDelete(null)}
        onDelete={async () => {
          const response = await deleteVendor(vendorToDelete?._id);
          return { success: !!response?.data };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting vendor..."
        successMessage="Vendor deleted successfully!"
        errorMessage="Failed to delete category!"
      />
    </>
  );
}
