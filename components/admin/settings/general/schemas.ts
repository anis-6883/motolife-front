import z from "zod";

export const generalSettingsSchema = z.object({
  tagline: z.string().min(3, "Tagline is required"),
  logo: z.string().url("Logo must be a valid URL"),
  favIcon: z.string().url("Favicon must be a valid URL"),
  openGraphImage: z.string().url().optional(),
  openGraphTitle: z.string().optional(),
  openGraphDescription: z.string().optional(),
});

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

export const authSettingsSchema = z.object({
  enableCustomerOtpLogin: z.boolean(),
  enableCustomerPasswordLogin: z.boolean(),

  enableSellerOtpLogin: z.boolean(),
  enableSellerPasswordLogin: z.boolean(),
  sellerApprovalRequired: z.boolean(),

  maxOtpHits: z.number().min(1),
  otpResendTime: z.number().min(1),
  otpBlockTime: z.number().min(1),

  maxLoginHits: z.number().min(1),
  loginBlockTime: z.number().min(1),
});

export type AuthSettingsFormValues = z.infer<typeof authSettingsSchema>;
