import { IdentityType } from "@/config/constant";
import z from "zod";

export const baseSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email").optional(),

  // password: z.string().min(6, "Minimum 6 characters"),
  // confirmPassword: z.string().min(6, "Minimum 6 characters"),

  image: z.string().url("Invalid Profile Image"),

  store: z.object({
    storeName: z.string().min(1, "Shop name is required"),
    contactNumber: z.string().min(1, "Contact number is required"),
    address: z.string().min(1, "Address is required"),
    description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
    logoImage: z.string().url("Invalid Shop Logo"),
    coverImage: z.string().url("Invalid Shop Cover Image"),
    storeCategory: z.string().min(1, "Store category is required"),
    tradeLicenseNumber: z.string().min(1, "Trade license number is required"),
    tradeLicenseImage: z.string().url("Invalid Trade License image"),
    nidOrPassportNumber: z.string().min(1, "NID / Passport number is required"),
    nidOrPassportImage: z.string().url("Invalid NID Image"),
    tinNumber: z.string().min(1, "TIN number is required"),
    tinImage: z.string().url("Invalid TIN Image"),
    binNumber: z.string().optional().nullable(),
    binImage: z.string().optional().nullable(),
  }),
  manager: z.object({
    name: z.string().min(1, "Manager name is required").optional().nullable(),
    identityType: z.enum(IdentityType).optional().nullable(),
    identityNumber: z.string().min(1, "Identity number is required").optional().nullable(),
    identityImage: z.string().url("Invalid Identification Image").optional().nullable(),
  }),
  paymentMethods: z
    .array(
      z.object({
        methodType: z.literal("bank"),
        bankName: z.string().min(1),
        branchName: z.string().min(1),
        accountHolderName: z.string().min(1),
        accountNumber: z.string().min(1),
        isDefault: z.boolean(),
      })
    )
    .min(1),
});

export const createSchema = baseSchema
  .extend({
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const editSchema = baseSchema.extend({
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export type OrderSchema = {
  _id: string;
  orderId: string;
  customer: {
    _id: string;
    phone: string;
    email: string;
    isVerified: boolean;
    fullName: string;
  };
  subtotal: number;
  total: number;
  refundedAmount: number;
  status: string;
  totalItems: number;
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
};
