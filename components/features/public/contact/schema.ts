import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters!"),
  email: z.string().trim().min(1, "Email is required!").email("Please enter a valid email address!"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required!")
    .regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, "Please enter a valid Bangladeshi phone number!"),
  subject: z.string().trim().min(1, "Subject is required!").max(100, "Subject cannot exceed 100 characters!"),
  message: z.string().trim().min(1, "Message is required!").max(500, "Message cannot exceed 500 characters!"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
