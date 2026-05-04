"use client";
import { updateOrderById } from "@/actions/order-management/order-actions";
import { Icons } from "@/components/icons";
import ActionButton from "@/components/shared/ActionButton";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ORDER_STATUS, ORDER_STATUS_OPTIONS } from "@/config/constant";
import routes from "@/config/routes";
import formatDateToDateString from "@/lib/client-utils";
import { Vendor } from "@/lib/types";
import { cn } from "@/lib/utils";
import useUserProfile from "@/store/useUserProfile";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, PackageX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { orderStatusStyles } from "../user-management/vendor/detail/StyleVariants";
import AssignManagerModal from "./AssignToManagerModal";
import { OrderListObj } from "./order-details/schema";

type OrderData = {
  docs: OrderListObj[];
  pagination: {
    totalDocs: number;
  };
};
type AdminSchema = {
  _id: string;
  name: string;
  image?: string;
};
export default function OrderTable({
  data,
  adminList,
  vendorList,
  orderStats,
}: {
  data: OrderData;
  adminList: AdminSchema[];
  vendorList: Vendor[];
  orderStats: any;
}) {
  const [total, setTotal] = useState(0);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const router = useRouter();
  const vendorOptions = vendorList.map((vendor) => ({
    label: vendor.name,
    value: vendor._id,
  }));
  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs || 0);
    }
  }, [data]);
  const { userData } = useUserProfile();
  const columns: ColumnDef<OrderListObj>[] = [
    {
      header: "SL",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "orderId",
      header: "Order ID",
    },
    {
      header: "Order Date",
      cell: ({ row }) => formatDateToDateString(row.original.createdAt),
    },
    {
      header: "Customer",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="text-sm">
            <p className="font-medium">{order.customer?.email}</p>
            <p className="text-muted-foreground">{order.customer?.phone}</p>
          </div>
        );
      },
    },
    {
      header: "Vendor",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="text-sm">
            {order?.sellers?.map((seller) => (
              <div key={seller._id}>
                <p className="font-medium">{seller?.name}</p>
                <p className="text-muted-foreground">{seller?.store?.storeName}</p>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Total Amount",
      cell: ({ row }) => `৳ ${row.original.total}`,
    },
    {
      header: "Quantity",
      accessorKey: "totalQuantity",
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;

        function StatusDropdown() {
          const [open, setOpen] = useState(false);

          const handleChange = async (status: ORDER_STATUS) => {
            const response = await updateOrderById(order?._id, { status });
            return { success: !!response?.data };
          };

          return (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`p-text-14 flex items-center gap-1 rounded-md border px-3 py-1 font-semibold capitalize ${
                    orderStatusStyles[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status.replace(/_/g, " ")}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="space-y-1 bg-white">
                {ORDER_STATUS_OPTIONS.map((status, index) => (
                  <DropdownMenuItem
                    key={index}
                    onSelect={() => handleChange(status.value)}
                    className={cn("cursor-pointer capitalize", orderStatusStyles[status.value])}
                  >
                    <span className="p-text-14 font-semibold">{status.label.replace(/_/g, " ")}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return <StatusDropdown />;
      },
    },

    //its make dynamic base on user.data

    {
      header: "Action",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <ActionButton type="view" tooltip="View" onClick={() => router.push(`${routes.privateRoutes.admin.orders.view(order._id)}`)} />
        );
      },
    },
  ];
  if (userData?.type === "admin" || userData?.role?.permissions?.includes("all")) {
    columns.splice(columns.length - 1, 0, {
      header: "Assigned To",
      cell: ({ row }) => {
        const order = row.original;

        function AssignedDropdown() {
          const [open, setOpen] = useState(false);
          const [assignedTo, setAssignedTo] = useState(order?.assignedTo || "");

          const handleChange = async (adminId: string) => {
            const response = await updateOrderById(order?._id, { assignedTo: adminId });

            if (response?.data) {
              setAssignedTo(adminId);
            }

            return { success: !!response?.data };
          };

          const currentAdmin = adminList.find((a) => a._id === assignedTo);

          return (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <button className="p-text-14 flex items-center gap-1 rounded-md border px-3 py-1 font-semibold">
                  {currentAdmin?.name ? (
                    <ImageWithFallback
                      fallbackSrc={"/images/placeholders/userPlaceholder.jpg"}
                      src={currentAdmin?.image}
                      alt={currentAdmin?.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : null}
                  {currentAdmin?.name || "Unassigned"}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => handleChange("")}>Unassigned</DropdownMenuItem>

                {adminList.map((admin) => (
                  <DropdownMenuItem key={admin._id} onSelect={() => handleChange(admin._id)}>
                    {admin?.name ? (
                      <ImageWithFallback
                        fallbackSrc={"/images/placeholders/userPlaceholder.jpg"}
                        src={admin?.image}
                        alt={admin?.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    ) : null}
                    {admin.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return <AssignedDropdown />;
      },
    });
  }
  return (
    <div className="animate-in fade-in slide-in-from-top-2 space-y-5 duration-300">
      <div className="grid grid-cols-4 gap-5">
        {[
          {
            label: "Processing",
            value: orderStats[0]?.processingOrders || 0,
            icon: <Icons.ClockFadingIcon className="text-secondary" />,
            color: "border-l-secondary",
            bg: "bg-secondary/10",
            iconColor: "text-secondary/80",
            valueColor: "text-secondary",
          },
          {
            label: "Shipped",
            value: orderStats[0]?.shippedOrders || 0,
            icon: <Icons.Package className="text-blue-dark" />,
            color: "border-l-blue-dark",
            bg: "bg-blue-dark/10",
            iconColor: "text-blue-dark/80",
            valueColor: "text-blue-dark",
          },
          {
            label: "Delivered",
            value: orderStats[0]?.deliveredOrders || 0,
            icon: <Icons.NoteCheck className="text-green-dark" />,
            color: "border-l-green-dark",
            bg: "bg-green-dark/10",
            iconColor: "text-green-dark/80",
            valueColor: "text-green-dark",
          },
          {
            label: "Cancelled",
            value: orderStats[0]?.cancelledOrders || 0,
            icon: <PackageX className="text-primary" />,
            color: "border-l-primary",
            bg: "bg-primary/10",
            iconColor: "text-primary/80",
            valueColor: "text-primary",
          },
        ].map(({ label, value, icon, bg, iconColor, color, valueColor }) => (
          <div key={label} className={`relative overflow-hidden rounded-2xl border border-l-4 bg-white p-5 ${bg} ${color}`}>
            <div className={`size-15 p-3.5 ${bg} flex items-center justify-center rounded-full ${iconColor} mb-4`}>{icon}</div>
            <div className="flex items-center justify-between">
              <p className="p-text-18 mb-1 font-semibold">{label}</p>
              <p className={`p-text-30 font-bold ${valueColor} tracking-tight`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {userData?.type === "admin" || userData?.role?.permissions?.includes("all") ? (
        <div className="flex justify-end">
          <Button variant="black" onClick={() => setAssignModalOpen(true)}>
            Assign To Manager
          </Button>
        </div>
      ) : null}
      {/* <div className="flex justify-end">
        <Button variant="black" onClick={() => setAssignModalOpen(true)}>
          Assign To Manager
        </Button>
      </div> */}
      <PaginationDataTable
        data={data?.docs || []}
        columns={columns}
        searchable
        searchPlaceholder="Search by order id.."
        pagination
        total={total}
        filters={[
          {
            key: "status",
            label: "Order Status",
            options: [{ label: "All", value: "__all__" }, ...ORDER_STATUS_OPTIONS],
          },
          // {
          //   key: "vendor",
          //   label: "Vendor",
          //   options: [{ label: "All", value: "__all__" }, ...vendorOptions],
          // },
          {
            key: "date",
            label: "Order Date",
            options: [
              { label: "All", value: "__all__" },
              { label: "This Week", value: "week" },
              { label: "This Month", value: "month" },
            ],
          },
          {
            key: "isCustomerVerified",
            label: "Customer Verified",
            options: [
              { label: "All", value: "__all__" },
              { label: "Verified", value: "true" },
              { label: "Not Verified", value: "false" },
            ],
          },
        ]}
      />
      <AssignManagerModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        orders={data?.docs || []}
        adminList={adminList}
      />
    </div>
  );
}
