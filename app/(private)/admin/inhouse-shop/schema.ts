import z from "zod";

export const DURATION_VALUES = ["30_minutes", "1_hour", "2_hours", "3_hours", "4_hours", "5_hours", "custom", "until_change"] as const;

export const DURATION_OPTIONS: { label: string; value: (typeof DURATION_VALUES)[number] }[] = [
  { label: "For 30 Minutes", value: "30_minutes" },
  { label: "For 1 Hour", value: "1_hour" },
  { label: "For 2 Hours", value: "2_hours" },
  { label: "For 3 Hours", value: "3_hours" },
  { label: "For 4 Hour", value: "4_hours" },
  { label: "For 5 Hour", value: "5_hours" },
  { label: "Custom Time", value: "custom" },
  { label: "Until I Change", value: "until_change" },
];
export const vacationSchema = z
  .object({
    durationType: z.enum(DURATION_VALUES, {
      message: "Please select a duration.",
    }),
    note: z.string().max(300, "Note must be under 300 characters.").optional().or(z.literal("")),
    customStartAt: z.string().optional().or(z.literal("")),
    customEndsAt: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.durationType === "custom") {
      if (!data.customStartAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["customStartAt"],
          message: "Start date is required for custom time.",
        });
      }

      if (!data.customEndsAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["customEndsAt"],
          message: "End date is required for custom time.",
        });
      }

      if (data.customStartAt && data.customEndsAt && data.customEndsAt <= data.customStartAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["customEndsAt"],
          message: "End date must be after start date.",
        });
      }
    }
  });

export type VacationFormValues = z.infer<typeof vacationSchema>;

export const shopSchema = z.object({
  // store
  storeName: z.string().min(1, "Store name is required.").min(3, "Must be at least 3 characters.").max(60, "Must be under 60 characters."),
  logoImage: z.string(), // holds URL (existing or newly uploaded)
  coverImage: z.string(), // holds URL (existing or newly uploaded)

  // businessSettings
  isAvailable: z.boolean(),
  isOnVacation: z.boolean().optional(),
  vacationNote: z.string().max(120, "Max 120 characters.").optional().or(z.literal("")),
  vacationDuration: z.string().max(60, "Max 60 characters.").optional().or(z.literal("")),
  minOrderAmount: z.number({ error: "Must be a number." }).min(0, "Cannot be negative."),
});

export type ShopFormValues = z.infer<typeof shopSchema>;
