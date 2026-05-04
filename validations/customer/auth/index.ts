import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().min(14, "Please enter a valid phone number").max(15, "Please enter a valid phone number"),
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Please enter a valid phone number").max(15, "Please enter a valid phone number"),
  // email: z.string().email("Invalid email").optional().or(z.literal("")),
});

export const vendorRegisterSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Phone must be at least 10 digits")
      .max(15, "Phone number too long")
      .regex(/^\d+$/, "Phone must contain digits only"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const storeSetupSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  storeCategory: z.string().min(1, "Please select a category"),
  tradeLicenseNo: z.string().min(1, "Trade license number is required"),
  tradeLicenseFile: z
    .instanceof(typeof window !== "undefined" ? FileList : Object)
    .optional()
    .nullable(),
  nidPassportNo: z.string().min(1, "NID/Passport number is required"),
  nidPassportFile: z
    .instanceof(typeof window !== "undefined" ? FileList : Object)
    .optional()
    .nullable(),
  businessType: z.string().min(1, "Please select a business type"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms & conditions",
  }),
});

export type StoreSetupValues = z.infer<typeof storeSetupSchema>;

/* ── Login ────────────────────────────────────────────── */
export const vendorLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type VendorLoginValues = z.infer<typeof vendorLoginSchema>;
export type VendorRegisterValues = z.infer<typeof vendorRegisterSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;
export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
