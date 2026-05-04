import { AnnouncementDisplayStyle, AnnouncementType } from "@/config/constant";
import z from "zod";

export const announcementSchema = z
  .object({
    publishDateType: z.enum(["today", "custom"]),
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be at most 100 characters"),
    message: z
      .string()
      .min(1, "Message is required")
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message must be at most 1000 characters"),
    type: z.enum(AnnouncementType, { message: "Please select an announcement type" }),
    displayStyle: z.enum(AnnouncementDisplayStyle, { message: "Please select a display style" }),
    selectedSystem: z.string().min(1, "Please select a system"),
    startDate: z.string().min(1, "Please select a start date"),
    endDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const now = Date.now();
    const start = data.startDate ? new Date(data.startDate).getTime() : null;
    const end = data.endDate ? new Date(data.endDate).getTime() : null;

    if (data.publishDateType === "custom") {
      if (!data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date is required for custom schedule",
        });
        return;
      }

      // Add a small buffer (e.g., 60 seconds) to 'now' to avoid immediate validation errors due to time elapsed while filling the form
      if (start !== null && start < now - 60000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["startDate"],
          message: "Start time cannot be in the past",
        });
      }
    }

    if (end !== null) {
      // Add a small buffer (e.g., 60 seconds) to 'now' to avoid immediate validation errors due to time elapsed while filling the form
      if (end < now - 60000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End time cannot be in the past",
        });
      }

      if (start !== null && start >= end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["startDate"],
          message: "Start time must be before end time",
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End time must be after start time",
        });
      }
    }
  });

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;

/** Strip non-API fields before sending to the server */
export type AnnouncementPayload = Omit<AnnouncementFormValues, "publishDateType">;
