"use client";

import FormDatetimePicker from "@/components/form/FormDateTimePicker";
import { Icons } from "@/components/icons";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SYSTEM_TYPE_OPTIONS, SystemType } from "@/config/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import AnnouncementModal from "../announcement/AnnouncementModal";

// ---------------------- Time Utilities ----------------------

const timeToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d+)\s+(AM|PM)/);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const getNowTime = () => {
  const now = new Date();
  return now.toISOString();
};

const getEndTimeDefault = () => {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return now.toISOString();
};

// ---------------------- Schema ----------------------

const schema = z.object({
  maintenanceSystem: z.nativeEnum(SystemType).nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
});

// ---------------------- Types ----------------------

export type MaintenanceFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: MaintenanceFormValues) => void;
  defaultValues?: Partial<MaintenanceFormValues>;
};

// ---------------------- Component ----------------------

export default function MaintenanceModeModal({ open, onClose, onConfirm, defaultValues = {} }: Props) {
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = React.useState(false);

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      maintenanceSystem: defaultValues.maintenanceSystem ?? SystemType.ALL,
      startTime: defaultValues.startTime ?? getNowTime(),
      endTime: defaultValues.endTime ?? getEndTimeDefault(),
    },
  });

  const validateTimes = (startTimeVal?: string, endTimeVal?: string) => {
    const startStr = startTimeVal || form.getValues("startTime");
    const endStr = endTimeVal || form.getValues("endTime");

    if (!startStr || !endStr) return;

    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    const now = new Date().getTime();

    // Start Time Validation
    if (start < now && startTimeVal) {
      form.setError("startTime", { type: "manual", message: "Start time cannot be in the past" });
    } else if (start >= end && startTimeVal) {
      form.setError("startTime", { type: "manual", message: "Start time must be before end time" });
    } else {
      form.clearErrors("startTime");
    }

    // End Time Validation
    if (end < now && endTimeVal) {
      form.setError("endTime", { type: "manual", message: "End time cannot be in the past" });
    } else if (end <= start && endTimeVal) {
      form.setError("endTime", { type: "manual", message: "End time must be after start time" });
    } else {
      form.clearErrors("endTime");
    }
  };

  const handleSubmit = (data: MaintenanceFormValues) => {
    onConfirm(data);
  };

  const handleCancel = () => {
    form.reset();
    setIsAnnouncementModalOpen(false);
    onClose();
  };

  const handleReset = () => {
    form.reset({
      maintenanceSystem: null,
      startTime: null,
      endTime: null,
    });
    form.clearErrors();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-2xl 2xl:max-w-3xl [&>button:first-of-type]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="p-text-24 font-semibold tracking-[0.24px]">System Maintenance</span>
            <Button
              variant="ghost"
              type="button"
              onClick={handleCancel}
              className="bg-accent/50 hover:bg-accent/80 h-10 w-10 rounded-full p-0 transition-colors max-lg:hidden"
            >
              <Icons.close className="size-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form className="space-y-6">
            {/* ── Select System ── */}
            <div className="grid items-start gap-6 md:grid-cols-[240px_1fr]">
              <div className="space-y-1">
                <p className="text-foreground text-[15px] font-semibold">Select System</p>
                <p className="text-muted-foreground text-sm leading-snug">
                  Select the systems you want to temporarily deactivate for maintenance
                </p>
              </div>

              <Controller
                control={form.control}
                name="maintenanceSystem"
                render={({ field }) => (
                  <div className="border-border w-full rounded-[10px] border p-5">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {SYSTEM_TYPE_OPTIONS.map((opt) => {
                        const isSelected = field.value === opt.value;

                        return (
                          <label
                            key={opt.value}
                            htmlFor={`maintenanceSystem-${opt.value}`}
                            className="text-foreground flex cursor-pointer items-center gap-3 text-[14px] font-medium select-none"
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => field.onChange(opt.value)}
                              className={"accent-primary size-4.5 border-2"}
                              id={`maintenanceSystem-${opt.value}`}
                            />
                            <span>{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              />
            </div>

            {/* ── Maintenance Time ── */}
            <div className="grid items-start gap-6 md:grid-cols-[240px_1fr]">
              <div className="space-y-1">
                <p className="text-foreground text-[15px] font-semibold">Maintenance Time</p>
              </div>

              <div className="grid gap-4 space-y-4 rounded-lg border border-gray-200 p-4 @2xl:grid-cols-2">
                <FormDatetimePicker
                  name="startTime"
                  label="Start Time"
                  onChange={(date) => validateTimes(date?.toISOString(), undefined)}
                />
                <FormDatetimePicker name="endTime" label="End Time" onChange={(date) => validateTimes(undefined, date?.toISOString())} />
              </div>
            </div>

            {/* ── Maintenance Announcement ── */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (!form.watch("startTime") || !form.watch("endTime")) {
                    Toast.error("Please select maintenance time first!");
                  } else {
                    setIsAnnouncementModalOpen(true);
                  }
                }}
              >
                <ExternalLink />
                Add Announcement
              </Button>
            </div>

            {/* ── Actions ── */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline-black" className="h-11 rounded-full px-8 text-[15px]" onClick={handleReset}>
                Reset
              </Button>
              <Button
                type="button"
                variant="black"
                className="h-11 rounded-full px-8 text-[15px]"
                onClick={form.handleSubmit(handleSubmit)}
              >
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>

      {/* Render the Announcement Modal on top */}
      <AnnouncementModal
        open={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        maxEndDate={form.watch("startTime")}
      />
    </Dialog>
  );
}
