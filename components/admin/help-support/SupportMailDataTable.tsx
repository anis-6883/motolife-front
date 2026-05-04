"use client";

import { deleteContact } from "@/actions/admin/help-support/getSupportMail";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import routes from "@/config/routes";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContactMessage = {
  _id: string;
  fullName: string;
  subject: string;
  message: string;
  email: string;
  phone: string;
  hasReplied: boolean;
  replies: any[];
  createdAt: string;
};

interface ContactDataTableProps {
  data: {
    docs: ContactMessage[];
    pagination: {
      totalDocs: number;
    };
  };
  onReply?: (contact: ContactMessage) => void;
  onTogglePublish?: (id: string, value: boolean) => Promise<void>;
  onDelete?: (id: string) => Promise<{ success: boolean }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const truncate = (text: string, max = 55) => (text?.length > max ? text.slice(0, max) + "..." : (text ?? "–"));

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex w-fit items-center gap-1.5 rounded-md border border-amber-100 bg-amber-50 px-2 py-0.5">
      <span className="text-sm font-semibold text-amber-500">{rating.toFixed(1)}</span>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SupportMailDataTable({ data }: ContactDataTableProps) {
  const [total, setTotal] = useState(0);
  const [contactToDelete, setContactToDelete] = useState<ContactMessage | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (data) {
      setTotal(data.pagination?.totalDocs || 0);
    }
  }, [data]);

  const columns: ColumnDef<ContactMessage>[] = [
    {
      id: "sl",
      header: "SL",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.index + 1}</span>,
    },
    {
      id: "messageId",
      header: "Message ID",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original._id.slice(-4)}</span>,
    },
    {
      id: "fullName",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-500">
            {row.original.fullName?.charAt(0) || "A"}
          </div>
          <span className="max-w-[140px] truncate text-sm font-medium">{row.original.fullName}</span>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-muted-foreground max-w-[180px] truncate text-sm">{row.original.email}</div>,
    },
    {
      id: "phone",
      header: "Phone",
      cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.original.phone || "–"}</div>,
    },
    {
      id: "subject",
      header: "Subject",
      cell: ({ row }) => <div className="max-w-[150px] truncate overflow-hidden text-sm font-medium">{row.original.subject}</div>,
    },
    {
      id: "message",
      header: "Message",
      cell: ({ row }) => (
        <div className="text-muted-foreground overfloow-hidden max-w-[150px] truncate text-sm">{truncate(row.original.message, 55)}</div>
      ),
    },
    {
      id: "hasReplied",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.hasReplied ? (
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
              Replied
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-600/20 ring-inset">
              Pending
            </span>
          )}
        </div>
      ),
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm whitespace-nowrap">{format(new Date(row.original.createdAt), "MMM dd, yyyy")}</span>
      ),
    },
    {
      id: "actions",
      header: () => <p className="text-center">Action</p>,
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <div className="flex items-center gap-2">
            <ActionButton
              type="view"
              tooltip="View"
              onClick={() => router.push(routes.privateRoutes.admin.helpAndSUpport.contactMail.view(contact._id))}
            />
            <ActionButton type="delete" tooltip="Delete" onClick={() => setContactToDelete(contact)} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PaginationDataTable
        searchPlaceholder="Search by Name and Email..."
        data={data.docs || []}
        columns={columns}
        searchable={true}
        isLoading={false}
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
            key: "hasReplied",
            label: "Replied",
            options: [
              { label: "All", value: "__all__" },
              { label: "Replied", value: "true" },
              { label: "Pending", value: "false" },
            ],
          },
        ]}
      />

      <DeleteModal
        isOpen={!!contactToDelete}
        title="Delete Contact Confirmation!"
        description={
          <span>
            Are you sure you want to delete the message from{" "}
            <span className="text-primary font-semibold">"{contactToDelete?.fullName}"</span>?
          </span>
        }
        onClose={() => setContactToDelete(null)}
        onDelete={async () => {
          const response: any = await deleteContact(contactToDelete?._id || "");
          return { success: !!response?.data, message: response.data.message ?? response.error };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting contact..."
        successMessage="Contact deleted successfully!"
        errorMessage="Failed to delete contact!"
      />
    </>
  );
}
