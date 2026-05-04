"use client";

import { updateAnnouncement } from "@/actions/admin/announcement-actions";
import Toast from "@/components/shared/Toast";
import { Switch } from "@/components/ui/switch";
import { Announcement } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import { useOptimistic, useTransition } from "react";

export default function StatusCell({ row }: { row: Row<Announcement> }) {
  const announcement = row.original;
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(announcement.status);
  const [isPending, startTransition] = useTransition();

  const handleStatusToggle = () => {
    startTransition(async () => {
      setOptimisticStatus(!optimisticStatus);

      const res = await updateAnnouncement(announcement._id, { status: !announcement.status });

      if (res?.data?.status) {
        Toast.success({
          title: "Success",
          description: "Status updated successfully!",
        });
        return;
      }

      Toast.error({
        title: "Failed",
        description: ("message" in res ? res.message : res?.error) || "Failed to update status!",
      });
    });
  };

  return <Switch checked={optimisticStatus} onCheckedChange={handleStatusToggle} disabled={isPending} className="cursor-pointer" />;
}
