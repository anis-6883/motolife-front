"use client";

import { deleteManager, updateManager } from "@/actions/admin/manager/manager-action";
import ActionButton from "@/components/shared/ActionButton";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import routes from "@/config/routes";
import { ColumnDef, Row } from "@tanstack/react-table";
import { AlertTriangle, Loader2, Search, UserCircle2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Manager, ManagerPagination } from "../type";

interface ManagerTableProps {
  docs: Manager[];
  pagination: ManagerPagination;
  onView: (manager: Manager) => void;
}

type StatusFilterValue = "__all__" | "true" | "false";

// ─── Delete confirmation modal ────────────────────────────────────────────────

interface DeleteModalProps {
  manager: Manager | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmModal({ manager, isDeleting, onConfirm, onCancel }: DeleteModalProps) {
  if (!manager) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!isDeleting ? onCancel : undefined} />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>

        {/* Text */}
        <h3 className="text-center text-base font-semibold text-gray-900">Delete Manager</h3>
        <p className="mt-2 text-center text-sm text-gray-500">
          Are you sure you want to delete <span className="font-medium text-gray-800">{manager.name}</span>? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-full" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 rounded-full bg-red-500 hover:bg-red-600"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </span>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Status toggle ────────────────────────────────────────────────────────────

function StatusToggle({ manager }: { manager: Manager }) {
  const [status, setStatus] = useState(manager.status);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (value: boolean) => {
    const prev = status;
    setStatus(value);
    startTransition(async () => {
      const t = Toast.loading({ title: "Status", description: "Updating status..." });
      try {
        await updateManager(manager._id, { status: value });
        Toast.remove(t);
        Toast.success({ title: "Success", description: `Manager ${value ? "activated" : "deactivated"}.` });
      } catch {
        setStatus(prev);
        Toast.remove(t);
        Toast.error({ title: "Failed", description: "Failed to update status." });
      }
    });
  };

  return <Switch checked={status} onCheckedChange={handleToggle} disabled={isPending} className="" />;
}

// ─── Cell Actions ────────────────────────────────────────────────────────────

function CellActions({ row, onView, onDeleteClick }: { row: Row<Manager>; onView: any; onDeleteClick: any }) {
  const m = row.original;
  const router = useRouter();
  return (
    <div className="flex items-center gap-1.5">
      <ActionButton type="view" tooltip="View" onClick={() => onView(m)} />
      <ActionButton
        type="edit"
        tooltip="Edit"
        onClick={() => router.push(routes.privateRoutes.admin.userManagement.manager.edit?.(m._id) ?? "#")}
      />
      <ActionButton type="delete" tooltip="Delete" onClick={() => onDeleteClick(m)} />
    </div>
  );
}

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(onView: (manager: Manager) => void, onDeleteClick: (manager: Manager) => void): ColumnDef<Manager>[] {
  return [
    {
      accessorKey: "sl",
      header: "SL",
      size: 50,
      cell: ({ row }) => <span className="text-sm font-medium text-gray-700">{row.index + 1}</span>,
    },
    {
      accessorKey: "_id",
      header: "Manager ID",
      cell: ({ row }) => <span className="font-mono text-xs text-gray-500">{row.original._id.slice(-8).toUpperCase()}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const m = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
              {m.image ? (
                <Image src={m.image} alt={m.name} width={32} height={32} className="h-full w-full object-cover" />
              ) : (
                <UserCircle2 className="h-full w-full p-0.5 text-gray-400" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-900">{m.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-sm text-gray-600">{row.original.email}</span>,
    },
    {
      accessorKey: "phone",
      header: "Contact Info",
      cell: ({ row }) => <span className="text-sm text-gray-600">{row.original.phone}</span>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">{row.original.role?.name ?? "—"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusToggle manager={row.original} />,
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => <CellActions row={row} onView={onView} onDeleteClick={onDeleteClick} />,
    },
  ];
}

// ─── Table ────────────────────────────────────────────────────────────────────

export default function ManagerTable({ docs, pagination, onView }: ManagerTableProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("__all__");

  // ── Delete modal state ────────────────────────────────────────────────────
  const [pendingDelete, setPendingDelete] = useState<Manager | null>(null); // manager staged for deletion
  const [isDeleting, setIsDeleting] = useState(false);

  const hasActiveFilters = search !== "" || statusFilter !== "__all__";

  // ── Filtered docs ─────────────────────────────────────────────────────────
  const filteredDocs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return docs.filter((m) => {
      if (statusFilter === "true" && !m.status) return false;
      if (statusFilter === "false" && m.status) return false;
      if (q) {
        const haystack = [m.name, m.email, m.phone ?? "", m.role?.name ?? "", m._id.slice(-8).toUpperCase()].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [docs, search, statusFilter]);

  // ── Delete flow ───────────────────────────────────────────────────────────
  // Step 1: clicking trash opens the modal
  const handleDeleteClick = (manager: Manager) => setPendingDelete(manager);

  // Step 2: confirming in modal executes the delete
  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    const t = Toast.loading({ title: "Deleting", description: "Deleting manager..." });
    try {
      await deleteManager(pendingDelete._id);
      Toast.remove(t);
      Toast.success({ title: "Deleted", description: "Manager deleted successfully." });
      setPendingDelete(null);
      router.refresh();
    } catch {
      Toast.remove(t);
      Toast.error({ title: "Failed", description: "Failed to delete manager." });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) setPendingDelete(null);
  };

  const columns = buildColumns(onView, handleDeleteClick);

  return (
    <>
      {/* ── Confirmation modal (portal-like, rendered at top level) ── */}
      <DeleteConfirmModal manager={pendingDelete} isDeleting={isDeleting} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />

      <div className="flex flex-col gap-4">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3 p-1">
          <div className="relative w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search name, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 pl-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as StatusFilterValue)}>
              <SelectTrigger className="h-9 w-32 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("__all__");
              }}
              className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
              Reset
            </button>
          )}

          {search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              Search: &quot;{search}&quot;
              <button type="button" onClick={() => setSearch("")}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {statusFilter !== "__all__" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              Status: {statusFilter === "true" ? "Active" : "Inactive"}
              <button type="button" onClick={() => setStatusFilter("__all__")}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>

        <PaginationDataTable data={filteredDocs} columns={columns} pagination total={filteredDocs.length} />
      </div>
    </>
  );
}
