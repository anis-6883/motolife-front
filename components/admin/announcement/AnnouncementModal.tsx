"use client";

import { createAnnouncement, updateAnnouncement } from "@/actions/admin/announcement-actions";
import FormDatetimePicker from "@/components/form/FormDateTimePicker";
import InputField from "@/components/form/InputField";
import { Icons } from "@/components/icons";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ANNOUNCEMENT_DISPLAY_STYLE_OPTIONS,
  ANNOUNCEMENT_TYPE_OPTIONS,
  AnnouncementDisplayStyle,
  SYSTEM_TYPE_OPTIONS,
} from "@/config/constant";
import { Announcement } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AnnouncementFormValues, announcementSchema } from "./schemas";

interface Props {
  open: boolean;
  onClose: () => void;
  maxEndDate?: string | null;
  onConfirm?: () => void;
  announcement?: Announcement | null;
}

export default function AnnouncementModal({ open, onClose, maxEndDate, onConfirm, announcement }: Props) {
  const isEdit = !!announcement;
  const [isLoading, setIsLoading] = useState(false);
  const isTodayRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    return startDate >= startOfToday && endDate <= endOfToday;
  };
  const form = useForm({
    resolver: zodResolver(announcementSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      message: "",
      type: ANNOUNCEMENT_TYPE_OPTIONS[0].value,
      displayStyle: AnnouncementDisplayStyle.BANNER_BAR,
      selectedSystem: SYSTEM_TYPE_OPTIONS[0].value,
      startDate: maxEndDate ? "" : new Date().toISOString(),
      endDate: maxEndDate || "",
      publishDateType: (maxEndDate ? "custom" : "today") as "today" | "custom",
    },
  });

  const publishDateType = form.watch("publishDateType");

  useEffect(() => {
    if (open) {
      if (announcement) {
        const isToday = isTodayRange(announcement.startDate, announcement.endDate as string);
        form.reset({
          publishDateType: isToday ? "today" : "custom",
          title: announcement.title,
          message: announcement.message,
          type: announcement.type as any,
          displayStyle: announcement.displayStyle as any,
          selectedSystem: announcement.selectedSystem,
          startDate: announcement.startDate,
          endDate: announcement.endDate,
        });
      } else {
        const now = new Date();
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const defaultEndDate = maxEndDate || endOfToday.toISOString();

        form.reset({
          publishDateType: maxEndDate ? "custom" : "today",
          title: "",
          message: "",
          type: ANNOUNCEMENT_TYPE_OPTIONS[0].value,
          displayStyle: AnnouncementDisplayStyle.BANNER_BAR,
          selectedSystem: SYSTEM_TYPE_OPTIONS[0].value,
          startDate: maxEndDate ? "" : now.toISOString(),
          endDate: defaultEndDate,
        });
      }
    }
  }, [open, maxEndDate, announcement, form]);

  const handleReset = () => {
    if (!maxEndDate) {
      const now = new Date();
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      form.reset({
        publishDateType: "today",
        title: "",
        message: "",
        type: ANNOUNCEMENT_TYPE_OPTIONS[0].value,
        displayStyle: AnnouncementDisplayStyle.BANNER_BAR,
        selectedSystem: SYSTEM_TYPE_OPTIONS[0].value,
        startDate: now.toISOString(),
        endDate: endOfToday.toISOString(),
      });
    } else {
      form.reset({
        publishDateType: "custom",
        title: "",
        message: "",
        type: ANNOUNCEMENT_TYPE_OPTIONS[0].value,
        displayStyle: AnnouncementDisplayStyle.BANNER_BAR,
        selectedSystem: SYSTEM_TYPE_OPTIONS[0].value,
        startDate: "",
        endDate: maxEndDate,
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (data: AnnouncementFormValues) => {
    // Strip publishDateType — it's a UI-only field, not part of the API payload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { publishDateType: _, ...payload } = data;

    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: isEdit ? "Updating announcement..." : "Saving general settings...",
    });

    try {
      const res = isEdit ? await updateAnnouncement(announcement?._id as string, payload) : await createAnnouncement(payload);

      if (res?.data?.status || res?.data) {
        onClose();
        onConfirm?.();

        Toast.remove(t);
        Toast.success({
          title: "Success",
          description: isEdit ? "Announcement updated successfully!" : "Announcement created successfully!",
        });
        return;
      }

      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: (res as any)?.error || `Failed to ${isEdit ? "update" : "create"} announcement`,
      });
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || `Failed to ${isEdit ? "update" : "create"} announcement`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="@container/dialog overflow-hidden p-0 sm:max-w-2xl 2xl:max-w-3xl [&>button:first-of-type]:hidden">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col">
            <DialogHeader className="border-none p-6 pb-0">
              <DialogTitle className="flex w-full items-center justify-between">
                <span className="text-2xl font-bold">{isEdit ? "Update" : "Add New"} Announcement</span>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleCancel}
                  className="bg-accent/50 hover:bg-accent/80 hidden h-10 w-10 rounded-full p-0 transition-colors md:flex"
                >
                  <Icons.close className="size-5" />
                </Button>
              </DialogTitle>
            </DialogHeader>

            <div className="max-h-[75vh] space-y-6 overflow-y-auto p-6">
              <InputField
                name="title"
                type="text"
                label="Announcement Title"
                placeholder="Enter announcement title"
                labelClassName="font-semibold"
                required
              />

              <InputField
                name="message"
                type="textarea"
                label="Announcement Message"
                placeholder="Enter announcement message"
                rowCount={4}
                labelClassName="font-semibold"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="type"
                  type="select"
                  label="Announcement Type"
                  placeholder="Select announcement type"
                  options={ANNOUNCEMENT_TYPE_OPTIONS}
                  labelClassName="font-semibold"
                  required
                />
                <InputField
                  name="displayStyle"
                  type="select"
                  label="Display Style"
                  placeholder="Select display style"
                  options={ANNOUNCEMENT_DISPLAY_STYLE_OPTIONS}
                  labelClassName="font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold capitalize">Select System</Label>
                <div>
                  <div className="flex gap-6 rounded-lg border border-gray-200 p-3.5">
                    {SYSTEM_TYPE_OPTIONS.map((sys) => (
                      <div key={sys.value} className="flex items-center gap-2">
                        <Checkbox
                          checked={form.watch("selectedSystem") === sys.value}
                          onCheckedChange={() => form.setValue("selectedSystem", sys.value)}
                          id={`sys-${sys.value}`}
                        />
                        <Label htmlFor={`sys-${sys.value}`}>{sys.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold capitalize">Publish Date</Label>
                <div className="space-y-4 rounded-lg border border-gray-200 p-3.5">
                  <div className="flex gap-10">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={publishDateType === "today"}
                        onChange={() => {
                          const now = new Date();
                          const end = new Date();
                          end.setHours(23, 59, 59, 999);

                          form.setValue("publishDateType", "today");
                          form.setValue("startDate", now.toISOString());
                          form.setValue("endDate", end.toISOString());
                        }}
                        className="accent-primary size-4"
                      />
                      Today
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={publishDateType === "custom"}
                        onChange={() => form.setValue("publishDateType", "custom")}
                        className="accent-primary size-4"
                      />
                      Custom Date
                    </label>
                  </div>

                  {publishDateType === "custom" && (
                    <div className="grid gap-4 @2xl:grid-cols-2">
                      <FormDatetimePicker name="startDate" label="Start Time" required />
                      <FormDatetimePicker name="endDate" label="End Time" disabled={!!maxEndDate} required />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-end gap-3 p-6 pt-2">
              <Button type="button" onClick={handleReset} variant="outline">
                Reset
              </Button>
              <Button type="submit">{isLoading ? "Saving..." : isEdit ? "Update" : "Submit"}</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
