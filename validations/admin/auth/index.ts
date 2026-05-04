import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().min(1, "Email is required!").email("Invalid email address!"),
  password: z.string().min(1, "Password is required!"),
});

export const passwordChangeSchema = z
  .object({
    oldPassword: z.string("Required").min(1, "Required!"),
    newPassword: z.string("Required").min(6, "Password must be at least 6 characters long!"),
    confirmPassword: z.string("Required").min(1, "Required!"),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;
