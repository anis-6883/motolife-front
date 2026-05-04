"use client";

import ActionButton from "@/components/shared/ActionButton";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { Switch } from "@/components/ui/switch";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type WithdrawStatus = "pending" | "approved" | "denied";
type DisputeStatus = "processing" | "resolved" | null;

type WithdrawRequest = {
  _id: string;
  name: string;
  withdrawAmount: number;
  paymentMethod: "Cash" | "Bank" | "Bkash";
  requestTime: string;
  status: WithdrawStatus;
  disputeStatus: DisputeStatus;
};

// ── Dummy data ───────────────────────────────────────────────────────────────

const dummyWithdrawData: WithdrawRequest[] = [
  {
    _id: "1",
    name: "Guy Hawkins",
    withdrawAmount: 284.0,
    paymentMethod: "Cash",
    requestTime: "Jan 01, 2026 ; 02:06:57",
    status: "pending",
    disputeStatus: null,
  },
  {
    _id: "2",
    name: "Dianne Russell",
    withdrawAmount: 284.0,
    paymentMethod: "Bank",
    requestTime: "Jan 06, 2026 ; 08:02:09",
    status: "approved",
    disputeStatus: null,
  },
  {
    _id: "3",
    name: "Theresa Webb",
    withdrawAmount: 284.0,
    paymentMethod: "Bkash",
    requestTime: "Jan 04, 2026 ; 05:39:11",
    status: "approved",
    disputeStatus: "processing",
  },
  {
    _id: "4",
    name: "Robert Fox",
    withdrawAmount: 284.0,
    paymentMethod: "Cash",
    requestTime: "Jan 07, 2026 ; 09:13:45",
    status: "approved",
    disputeStatus: "resolved",
  },
  {
    _id: "5",
    name: "Annette Black",
    withdrawAmount: 284.0,
    paymentMethod: "Bank",
    requestTime: "Jan 03, 2026 ; 04:27:48",
    status: "denied",
    disputeStatus: null,
  },
  {
    _id: "6",
    name: "Wade Warren",
    withdrawAmount: 284.0,
    paymentMethod: "Cash",
    requestTime: "Jan 05, 2026 ; 06:50:34",
    status: "approved",
    disputeStatus: null,
  },
  {
    _id: "7",
    name: "Kathryn Murphy",
    withdrawAmount: 284.0,
    paymentMethod: "Bank",
    requestTime: "Jan 02, 2026 ; 03:15:22",
    status: "pending",
    disputeStatus: null,
  },
  {
    _id: "8",
    name: "Esther Howard",
    withdrawAmount: 284.0,
    paymentMethod: "Cash",
    requestTime: "Jan 08, 2026 ; 10:25:11",
    status: "approved",
    disputeStatus: null,
  },
  {
    _id: "9",
    name: "Darrell Steward",
    withdrawAmount: 284.0,
    paymentMethod: "Cash",
    requestTime: "Jan 01, 2026 ; 02:06:57",
    status: "approved",
    disputeStatus: null,
  },
  {
    _id: "10",
    name: "Devon Lane",
    withdrawAmount: 284.0,
    paymentMethod: "Cash",
    requestTime: "Jan 01, 2026 ; 02:06:57",
    status: "denied",
    disputeStatus: null,
  },
];

// ── Status badge styles ──────────────────────────────────────────────────────

const statusStyles: Record<WithdrawStatus, string> = {
  pending: "bg-orange-100 text-orange-600",
  approved: "bg-green-100 text-green-700",
  denied: "bg-red-100 text-red-600",
};

const disputeStyles: Record<string, string> = {
  processing: "bg-orange-100 text-orange-600",
  resolved: "bg-green-100 text-green-700",
};

// ── Dispute Toggle Cell ──────────────────────────────────────────────────────

function DisputeCell({ dispute }: { dispute: DisputeStatus }) {
  const [enabled, setEnabled] = useState(!!dispute);

  if (dispute) {
    return <span className={`rounded-md px-3 py-1 text-xs font-semibold capitalize ${disputeStyles[dispute]}`}>{dispute}</span>;
  }

  return (
    <div className="flex items-center justify-center">
      <Switch checked={enabled} onCheckedChange={setEnabled} />
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function WithdrawDataTable() {
  const data = dummyWithdrawData;
  const total = 1367; // dummy total to match design

  const columns: ColumnDef<WithdrawRequest>[] = [
    {
      header: "SL",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "withdrawAmount",
      header: "Withdraw Amount",
      cell: ({ row }) => row.original.withdrawAmount.toFixed(2),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
    },
    {
      accessorKey: "requestTime",
      header: "Request Time",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return <span className={`rounded-md px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}>{status}</span>;
      },
    },
    {
      header: "Dispute",
      cell: ({ row }) => <DisputeCell dispute={row.original.disputeStatus} />,
    },
    {
      header: "Action",
      cell: () => (
        <div className="flex items-center gap-2">
          <ActionButton type="view" tooltip="View Details" onClick={() => {}} />
        </div>
      ),
    },
  ];

  return (
    <PaginationDataTable
      data={data}
      columns={columns}
      searchable={true}
      searchPlaceholder="Search Here"
      pagination={true}
      total={total}
      filters={[
        {
          key: "sortOrder",
          label: "Sort By",
          options: [
            { label: "All", value: "__all__" },
            { label: "New to Old", value: "desc" },
            { label: "Old to New", value: "asc" },
          ],
        },
        {
          key: "vendorName",
          label: "Vendor Name",
          options: [{ label: "All", value: "__all__" }],
        },
        {
          key: "status",
          label: "Status",
          options: [
            { label: "All", value: "__all__" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Denied", value: "denied" },
          ],
        },
      ]}
    />
  );
}
