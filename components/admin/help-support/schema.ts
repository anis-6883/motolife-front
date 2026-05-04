import { z } from "zod";

export const contactReplySchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(3, "Subject must be at least 3 characters")
    .max(255, "Subject must be at most 255 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be at most 5000 characters"),
});

export type ContactReplyFormValues = z.infer<typeof contactReplySchema>;
