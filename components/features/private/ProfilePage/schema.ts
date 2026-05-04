import z from "zod";

export const profileSchema = z.object({
  // email: z.email("Invalid email!").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits!").optional(),
  fullName: z.string().min(1, "Full name is required!"),
  image: z.union([z.instanceof(File), z.string()]).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
