"use client";

import { deleteAnnouncement } from "@/actions/admin/announcement-actions";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { ANNOUNCEMENT_DISPLAY_STYLE_OPTIONS, ANNOUNCEMENT_TYPE_OPTIONS, SYSTEM_TYPE_OPTIONS } from "@/config/constant";
import { Announcement } from "@/lib/types";
import { dateFormat } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import AnnouncementModal from "./AnnouncementModal";
import StatusCell from "./StatusCell";
import ViewAnnouncementModal from "./ViewAnnouncementModal";

type AnnouncementData = {
  docs: Announcement[];
  pagination: {
    totalDocs: number;
  };
};

const getDisplayLabel = (options: { label: string; value: string }[], value: string): string => {
  return options.find((opt) => opt.value === value)?.label || value;
};

export default function AnnouncementDataTable({ data }: { data: AnnouncementData }) {
  const [total, setTotal] = useState(0);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [announcementToView, setAnnouncementToView] = useState<Announcement | null>(null);
  const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | null>(null);

  useEffect(() => {
    if (data) {
      setTotal(data?.pagination?.totalDocs || 0);
    }
  }, [data]);

  const columns: ColumnDef<Announcement>[] = [
    {
      header: "SL",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Announcement Message",
      cell: ({ row }) => {
        const announcement = row.original;
        return (
          <div className="max-w-62.5">
            <p className="truncate font-medium">{announcement.title}</p>
            <p className="text-muted-foreground truncate text-sm">{announcement.message}</p>
          </div>
        );
      },
    },
    {
      header: "Date Created",
      cell: ({ row }) => dateFormat(row.original.createdAt, "MMM DD, YYYY"),
    },
    {
      header: "Duration",
      cell: ({ row }) => {
        const { startDate, endDate } = row.original;
        return (
          <div className="text-sm">
            <p>
              {dateFormat(startDate, "MMM DD, YYYY")} - {endDate ? dateFormat(endDate, "MMM DD, YYYY") : "Indefinite"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Announcement Type",
      cell: ({ row }) => getDisplayLabel(ANNOUNCEMENT_TYPE_OPTIONS, row.original.type),
    },
    {
      header: "Display Style",
      cell: ({ row }) => getDisplayLabel(ANNOUNCEMENT_DISPLAY_STYLE_OPTIONS, row.original.displayStyle),
    },
    {
      header: "Target System",
      cell: ({ row }) => getDisplayLabel(SYSTEM_TYPE_OPTIONS, row.original.selectedSystem),
    },
    {
      header: "Status",
      cell: StatusCell,
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const announcement = row.original;
        return (
          <div className="flex items-center gap-2">
            <ActionButton type="edit" tooltip="Edit" onClick={() => setAnnouncementToEdit(announcement)} />
            <ActionButton type="view" tooltip="View" onClick={() => setAnnouncementToView(announcement)} />
            <ActionButton type="delete" tooltip="Delete" onClick={() => setAnnouncementToDelete(announcement)} />
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
        searchPlaceholder="Search by Announcement Message..."
        pagination={true}
        total={total}
      />

      <ViewAnnouncementModal open={!!announcementToView} announcement={announcementToView} onClose={() => setAnnouncementToView(null)} />

      <AnnouncementModal open={!!announcementToEdit} announcement={announcementToEdit} onClose={() => setAnnouncementToEdit(null)} />

      <DeleteModal
        isOpen={!!announcementToDelete}
        title="Delete Announcement Confirmation!"
        description={
          <span>
            Are you sure you want to delete this <span className="text-primary font-semibold">"{announcementToDelete?.title}"</span>{" "}
            announcement?
          </span>
        }
        onClose={() => setAnnouncementToDelete(null)}
        onDelete={async () => {
          const response = await deleteAnnouncement(announcementToDelete?._id);
          return { success: !!response?.data };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting announcement..."
        successMessage="Announcement deleted successfully!"
        errorMessage="Failed to delete announcement!"
      />
    </>
  );
}
