"use client";

import { updateBusinessSettings } from "@/actions/admin/business-settings-actions";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { SYSTEM_TYPE_OPTIONS, SystemType } from "@/config/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import MaintenanceModeModal, { MaintenanceFormValues } from "./MaintenanceModeModal";
import { GeneralSettingsFormValues, generalSettingsSchema } from "./schemas";

// ---------------------- Component ----------------------

interface GeneralSettingsFormProps {
  defaultValues?: Partial<GeneralSettingsFormValues> & { maintenanceModeEnabled?: boolean };
}

const createDateWithTime = (timeStr: string) => {
  const today = new Date();
  const [time, period] = timeStr.split(" ");
  const [h, m] = time.split(":").map(Number);
  let hours = h;
  const minutes = m;

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  today.setHours(hours, minutes, 0, 0);
  return today.toISOString();
};

export default function GeneralSettingsForm({ defaultValues = {} }: GeneralSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      maintenanceSystem: defaultValues.maintenanceSystem ?? null,
      maintenanceTime: defaultValues.maintenanceTime ?? null,
      maintenanceAnnouncement: defaultValues.maintenanceAnnouncement ?? false,
      maintenanceTimeStart: defaultValues.maintenanceTimeStart ?? null,
      maintenanceTimeEnd: defaultValues.maintenanceTimeEnd ?? null,
    },
  });

  const handleSubmit = async (data: GeneralSettingsFormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Saving general settings...",
    });

    try {
      console.log({ data });
      await updateBusinessSettings(data, "general");

      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: "General settings updated successfully!",
      });
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || "Failed to update settings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaintenanceConfirm = async (modalData: MaintenanceFormValues) => {
    form.setValue("maintenanceSystem", modalData.maintenanceSystem as any);
    form.setValue("maintenanceTimeStart", modalData.startTime ?? null);
    form.setValue("maintenanceTimeEnd", modalData.endTime ?? null);

    setIsModalOpen(false);

    // Automatically submit after confirmation
    // form.handleSubmit(handleSubmit)();
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-6">
          {/* Maintenance Mode */}
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:h-full">
            <div className="space-y-2">
              <FormLabel className="text-sm">
                Maintenance Mode
                {defaultValues?.maintenanceModeEnabled ? (
                  <span className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50/50 px-2 py-px text-[10px] font-semibold tracking-wide text-green-600 uppercase">
                    <span className="relative flex h-1 w-1">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-1 w-1 rounded-full bg-green-500"></span>
                    </span>
                    Active
                  </span>
                ) : (
                  <span className="rounded-full border border-red-200 bg-red-50/50 px-2 py-px text-[10px] font-semibold tracking-wide text-red-500 uppercase">
                    Inactive
                  </span>
                )}
              </FormLabel>
              <div className="space-y-2">
                {/* Schedule & System Row */}
                {(form.watch("maintenanceTimeStart") || form.watch("maintenanceTimeEnd")) && form.watch("maintenanceSystem") && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                    {form.watch("maintenanceSystem") && (
                      <div className="flex items-center gap-1.5 rounded border border-gray-200 bg-gray-100/80 px-2 py-0.5 font-medium text-gray-700">
                        <span className="text-[10px] text-gray-500 uppercase">System:</span>
                        <span>
                          {SYSTEM_TYPE_OPTIONS.find((opt) => opt.value === form.watch("maintenanceSystem"))?.label ||
                            form.watch("maintenanceSystem")}
                        </span>
                      </div>
                    )}

                    {(form.watch("maintenanceTimeStart") || form.watch("maintenanceTimeEnd")) && (
                      <div className="text-muted-foreground bg-accent/30 border-accent/50 flex items-center gap-2 rounded border px-2 py-0.5">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">From:</span>
                          <span className="text-foreground font-medium">
                            {form.watch("maintenanceTimeStart")
                              ? format(new Date(form.watch("maintenanceTimeStart")!), "MMM d, h:mm a")
                              : "N/A"}
                          </span>
                        </div>
                        <span className="text-gray-300">→</span>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">To:</span>
                          <span className="text-foreground font-medium">
                            {form.watch("maintenanceTimeEnd")
                              ? format(new Date(form.watch("maintenanceTimeEnd")!), "MMM d, h:mm a")
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Button type="button" variant="link" className="text-blue-dark p-0 font-medium" onClick={() => setIsModalOpen(true)}>
              Configure
            </Button>
          </FormItem>

          {/* CTA */}
          <div className="flex justify-end">
            <Button type="submit" className="rounded-full" variant={"black"} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </FormProvider>

      <MaintenanceModeModal
        key={isModalOpen ? "open" : "closed"}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleMaintenanceConfirm}
        defaultValues={{
          maintenanceSystem: form.getValues("maintenanceSystem") as SystemType,
          startTime: form.getValues("maintenanceTimeStart") || undefined,
          endTime: form.getValues("maintenanceTimeEnd") || undefined,
        }}
      />
    </>
  );
}
