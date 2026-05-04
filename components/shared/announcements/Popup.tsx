"use client";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { AnnouncementType } from "@/config/constant";
import { Announcement } from "@/lib/types";
import { cn } from "@/lib/utils";
import { InfoIcon, PartyPopperIcon, SparkleIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

const variants = {
  [AnnouncementType.INFORMATION]: {
    border: "border-blue-dark",
    bgLight: "bg-blue-light",
    bgDark: "bg-blue-dark",
    icon: InfoIcon,
  },
  [AnnouncementType.ALERT]: {
    border: "border-primary",
    bgLight: "bg-primary-light",
    bgDark: "bg-primary",
    icon: TriangleAlertIcon,
  },
  [AnnouncementType.PROMOTION]: {
    border: "border-purple-dark",
    bgLight: "bg-purple-light",
    bgDark: "bg-purple-dark",
    icon: PartyPopperIcon,
  },
  [AnnouncementType.UPDATE]: {
    border: "border-paste-dark",
    bgLight: "bg-paste-light",
    bgDark: "bg-paste-dark",
    icon: SparkleIcon,
  },
};

const getCurrentVariant = (variant: Announcement["type"]) => {
  return variants[variant] || variants[AnnouncementType.INFORMATION];
};

export default function Popup({ announcement }: { announcement: Announcement }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const currentVariant = getCurrentVariant(announcement.type);

  useEffect(() => {
    setMounted(true);
    const closedAnnouncements = JSON.parse(localStorage.getItem("closed_announcements") || "[]");
    if (!closedAnnouncements.includes(announcement._id)) {
      setOpen(true);
    }
  }, [announcement._id]);

  const handleClose = () => {
    setOpen(false);
    const closedAnnouncements = JSON.parse(localStorage.getItem("closed_announcements") || "[]");
    if (!closedAnnouncements.includes(announcement._id)) {
      localStorage.setItem("closed_announcements", JSON.stringify([...closedAnnouncements, announcement._id]));
    }
  };

  if (!mounted) return null;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <AlertDialogContent
        className={cn(
          "scrollbar-none flex max-h-[90svh] flex-col items-center gap-0 overflow-y-auto rounded-md border p-10 text-center",
          currentVariant.bgLight
        )}
      >
        {/* Close Button */}
        <button className="absolute top-5 right-5 cursor-pointer" onClick={handleClose}>
          <XIcon className="size-5" />
        </button>
        {/* Content */}
        <div className={cn("mb-2.5 flex size-15 shrink-0 items-center justify-center rounded-full text-white", currentVariant.bgDark)}>
          <currentVariant.icon className="size-8.5" />
        </div>
        <h4 className="mb-8 text-[30px] font-semibold">{announcement.title}</h4>
        <p className="text-lg whitespace-pre-line">{announcement.message}</p>
      </AlertDialogContent>
    </AlertDialog>
  );
}
