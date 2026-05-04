"use client";

import { updateInHouseShop } from "@/actions/admin/inhouse-shop/inhouse-shop-actions";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { VacationSettings } from "@/types/shop";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { DURATION_OPTIONS, DURATION_VALUES, VacationFormValues, vacationSchema } from "../schema";

// ─── Loader ───────────────────────────────────────────────────────────────────

const LoaderIcon = () => (
  <span
    style={{
      width: 13,
      height: 13,
      border: "2px solid rgba(255,255,255,0.28)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      animation: "vmSpin .7s linear infinite",
      display: "inline-block",
      flexShrink: 0,
    }}
  />
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface VacationModeModalProps {
  open: boolean;
  onClose: () => void;
  currentVacation?: VacationSettings | null;
  onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VacationModeModal({ open, onClose, currentVacation, onSuccess }: VacationModeModalProps) {
  const isCurrentlyOnVacation = currentVacation?.isOnVacation ?? false;

  // Fix 2: defaultValues must match schema shape exactly
  const form = useForm<VacationFormValues>({
    resolver: zodResolver(vacationSchema),
    defaultValues: {
      durationType: (currentVacation?.durationType as (typeof DURATION_VALUES)[number]) || "1_hour",
      note: currentVacation?.note ?? "",
      customStartAt: "",
      customEndsAt: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const [selectedDuration] = useWatch({ control: form.control, name: ["durationType"] });
  const isCustom = selectedDuration === "custom";

  useEffect(() => {
    if (open) {
      reset({
        durationType: (currentVacation?.durationType as (typeof DURATION_VALUES)[number]) || "1_hour",
        note: currentVacation?.note ?? "",
        customStartAt: "",
        customEndsAt: "",
      });
    }
  }, [open, currentVacation, reset]);

  const onSubmit = async (values: VacationFormValues) => {
    const t = Toast.loading({ title: "Status", description: "Enabling vacation mode..." });
    try {
      await updateInHouseShop({
        businessSettings: {
          vacation: {
            isOnVacation: true,
            durationType: values.durationType,
            note: values.note ?? "",
            ...(values.durationType === "custom" && {
              startAt: values.customStartAt,
              endsAt: values.customEndsAt,
            }),
          },
        },
      });
      Toast.remove(t);
      Toast.success({ title: "Success", description: "Vacation mode enabled!" });
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error instanceof Error ? error.message : "Failed to enable vacation mode.",
      });
    }
  };

  const handleDisable = async () => {
    const t = Toast.loading({ title: "Status", description: "Disabling vacation mode..." });
    try {
      await updateInHouseShop({
        businessSettings: {
          vacation: { isOnVacation: false },
        },
      });
      Toast.remove(t);
      Toast.success({ title: "Success", description: "Vacation mode disabled!" });
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error instanceof Error ? error.message : "Failed to disable vacation mode.",
      });
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ── Active vacation banner ── */}
          {isCurrentlyOnVacation && (
            <div className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-amber-800">🌴 Vacation mode is currently ON</p>
                {currentVacation?.endsAt && (
                  <p className="mt-0.5 text-xs text-amber-700">Ends at: {new Date(currentVacation.endsAt).toLocaleString()}</p>
                )}
                {currentVacation?.note && <p className="mt-0.5 text-xs text-amber-600 italic">"{currentVacation.note}"</p>}
              </div>
              <Button
                type="button"
                variant="outline"
                className="shrink-0 rounded-full border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={handleDisable}
                disabled={isSubmitting}
              >
                Turn Off
              </Button>
            </div>
          )}

          {/* ── Duration radios ── */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 12 }}>
              Vacation Mode Duration <span style={{ color: "#ef4444" }}>*</span>
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 8px" }}>
              {DURATION_OPTIONS.map((opt) => (
                <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                  <input
                    type="radio"
                    value={opt.value}
                    checked={selectedDuration === opt.value}
                    onChange={() => setValue("durationType", opt.value, { shouldValidate: true })}
                    style={{ width: 15, height: 15, accentColor: "#111", cursor: "pointer", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, color: "#374151", whiteSpace: "nowrap" }}>{opt.label}</span>
                </label>
              ))}
            </div>

            {errors.durationType && <p style={{ fontSize: 11.5, color: "#ef4444", marginTop: 8 }}>{errors.durationType.message}</p>}
          </div>

          {/* ── Custom time fields ── */}
          {isCustom && (
            <div className="mb-5 grid grid-cols-2 gap-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4">
              <p className="col-span-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Custom Duration</p>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("customStartAt")}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
                {errors.customStartAt && <p className="mt-1 text-[11.5px] text-red-500">{errors.customStartAt.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("customEndsAt")}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
                {errors.customEndsAt && <p className="mt-1 text-[11.5px] text-red-500">{errors.customEndsAt.message}</p>}
              </div>
            </div>
          )}

          {/* ── Divider ── */}
          <div style={{ height: 1, background: "#f3f4f6", marginBottom: 20 }} />

          {/* ── Vacation Note ── */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 8 }}>Vacation Note</label>
            <textarea
              {...register("note")}
              placeholder="Type your vacation note here..."
              disabled={isSubmitting}
              style={{
                width: "100%",
                minHeight: 100,
                resize: "vertical",
                borderRadius: 8,
                border: `1.5px solid ${errors.note ? "#ef4444" : "#e5e7eb"}`,
                padding: "10px 14px",
                fontSize: 13,
                color: "#111",
                fontFamily: "inherit",
                lineHeight: 1.6,
                transition: "border-color .15s, box-shadow .15s",
                outline: "none",
                boxSizing: "border-box",
                opacity: isSubmitting ? 0.6 : 1,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#111";
                e.target.style.boxShadow = "0 0 0 3px rgba(17,17,17,.07)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.note ? "#ef4444" : "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
            {errors.note && <p style={{ fontSize: 11.5, color: "#ef4444", marginTop: 6 }}>{errors.note.message}</p>}
          </div>

          {/* ── Actions ── */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Vacation Mode On
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
