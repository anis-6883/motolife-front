"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ANNOUNCEMENT_DISPLAY_STYLE_OPTIONS, ANNOUNCEMENT_TYPE_OPTIONS, SYSTEM_TYPE_OPTIONS } from "@/config/constant";
import { Announcement } from "@/lib/types";
import { dateFormat } from "@/lib/utils";
import { Clock } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  announcement: Announcement | null;
}

const getDisplayLabel = (options: { label: string; value: string }[], value: string): string => {
  return options.find((opt) => opt.value === value)?.label || value;
};

export default function ViewAnnouncementModal({ open, onClose, announcement }: Props) {
  if (!announcement) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="@container/dialog overflow-hidden p-0 sm:max-w-2xl 2xl:max-w-3xl [&>button:first-of-type]:hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex w-full items-center justify-between">
            <span className="p-text-24 font-semibold tracking-[0.24px]">Announcement Details</span>
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="bg-accent/50 hover:bg-accent/80 flex h-10 w-10 rounded-full p-0 transition-colors md:flex"
            >
              <Icons.close className="size-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="scrollbar-none text-foreground max-h-[70vh] space-y-6 overflow-y-auto p-6">
          {/* Status & Type */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-500">Status:</span>
              <Badge variant={announcement.status ? "success" : "destructive"}>{announcement.status ? "Active" : "Inactive"}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-500">Announcement Type:</span>
              <Badge variant="outline" className="border-primary text-primary">
                {getDisplayLabel(ANNOUNCEMENT_TYPE_OPTIONS, announcement.type)}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Announcement Title</h3>
              <p className="text-lg font-bold text-gray-900">{announcement.title}</p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Announcement Message</h3>
              <div className="border-border bg-muted/5 rounded-xl border p-5 leading-relaxed text-gray-700 shadow-sm">
                {announcement.message}
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Display Style</h3>
              <p className="font-semibold text-gray-900">
                {getDisplayLabel(ANNOUNCEMENT_DISPLAY_STYLE_OPTIONS, announcement.displayStyle)}
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Target System</h3>
              <p className="font-semibold text-gray-900">{getDisplayLabel(SYSTEM_TYPE_OPTIONS, announcement.selectedSystem)}</p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Start Date</h3>
              <p className="font-semibold text-gray-900">{dateFormat(announcement.startDate, "MMM DD, YYYY - hh:mm A")}</p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">End Date</h3>
              <p className="font-semibold text-gray-900">
                {announcement.endDate ? dateFormat(announcement.endDate, "MMM DD, YYYY - hh:mm A") : "No End Date"}
              </p>
            </div>
          </div>

          <div className="border-border text-muted-foreground flex items-center gap-2 border-t pt-4 text-xs italic">
            <Clock className="size-3.5" />
            Created at: {dateFormat(announcement.createdAt, "MMMM DD, YYYY - hh:mm A")}
          </div>
        </div>

        <div className="flex justify-end p-6 pt-2">
          <Button variant="black" className="h-11 rounded-full px-10 text-[15px]" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
