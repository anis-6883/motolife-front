import { z } from "zod";

export const bankAccountSchema = z.object({
  type: z.literal("bankAcc"),
  cardNumber: z.string().min(6, "Card number is required").max(16, "Card number length cannot be exceeded 16"),
  cardHolderName: z.string().min(1, "Card holder name is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  cvv: z.string().min(3, "CVV is required"),
});

export const bkashSchema = z.object({
  type: z.literal("bkash"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
});

export const paymentSchema = z.discriminatedUnion("type", [bankAccountSchema, bkashSchema]);

export type PaymentFormData = z.infer<typeof paymentSchema>;
