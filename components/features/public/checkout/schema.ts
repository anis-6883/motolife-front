import { z } from "zod";

const billingSchema = z.object({
  fullName: z.string().min(1, "Name is required!").max(50, "Name must be at most 50 characters!"),
  phone: z.string().min(10, "Phone number must be at least 10 digits!").max(15, "Phone number must be at most 15 digits!"),
  // email: z.string().email("Invalid email!"),
  address: z.string().min(5, "Address is required!").max(150, "Address can't be more than 150 characters").trim(),
  district: z.string().min(1, "District is required!").max(50, "District must be at most 50 characters!"),
  thana: z.string().min(1, "Thana is required!").max(50, "Thana must be at most 50 characters!"),
  // area: z.string().min(1, "Area is required!").max(50, "Area must be at most 50 characters!"),
  // zipCode: z.string().optional(),
  // .min(1, "ZIP Code is required!").max(6, "ZIP Code must be at most 6 characters!"),
});

export const checkoutFormSchema = z
  .object({
    // emailOffers: z.boolean(),

    fullName: z.string().min(1, "Name is required!").max(50, "Name must be at most 50 characters!"),
    phone: z.string().min(10, "Phone number must be at least 10 digits!").max(15, "Phone number must be at most 15 digits!"),
    // email: z.string().email("Invalid email!"),
    address: z.string().min(5, "Address is required!").max(150, "Address can't be more than 150 characters").trim(),
    district: z.string().min(1, "District is required!").max(50, "District must be at most 50 characters!"),
    thana: z.string().min(1, "Thana is required!").max(50, "Thana must be at most 50 characters!"),
    // area: z.string().min(1, "Area is required!").max(50, "Area must be at most 50 characters!"),
    // zipCode: z.string().optional(),
    // .min(1, "ZIP Code is required!").max(6, "ZIP Code must be at most 6 characters!"),

    deliveryType: z.string({ error: "Please select a delivery type!" }).min(1, "Please select a delivery type!"),
    addressType: z.string().optional(),
    // saveInfo: z.boolean(),
    // smsOffers: z.boolean(),
    agreeToPolicies: z.boolean(),

    billingAddress: z.enum(["same", "different"]),

    billing: billingSchema.partial().optional(),

    // paymentMethod: z.enum(["cash", "mb"]).refine((val) => val, {
    //   message: "Please select a payment method!",
    // }),

    orderNote: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.agreeToPolicies) {
      ctx.addIssue({
        code: "custom",
        message: "Please agree to the policies!",
        path: ["agreeToPolicies"],
      });
    }
    if (data.billingAddress === "different") {
      const result = billingSchema.safeParse(data.billing);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ["billing", ...(issue.path ?? [])],
          });
        });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
// const addressRegex = /^[A-Za-z0-9\s,.'#/-]+$/;
export const addressSchema = z.object({
  title: z.string().min(1, "First name is required!"),
  //   area: z.string().min(1, "Area is required"),
  district: z.string().min(1, "District is required!"),
  thana: z.string().min(1, "Thana is required!"),
  // country: z.string().min(1, "Country is required!"),
  address: z.string().min(5, "Address is required!").max(150, "Address can't be more than 150 characters").trim(),
  // city: z.string().min(1, "City is required!"),
  //   zipCode: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export const cancelOrderSchema = z.object({
  cancellationReason: z.string().min(1, "Please select a reason!"),
  cancellationNote: z.string().optional(),
});

export type CancelOrderFormValues = z.infer<typeof cancelOrderSchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating!"),
  reviewText: z.string().min(1, "Please write a review!"),
  images: z.any().optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export const refundRequestSchema = z.object({
  items: z
    .array(
      z.union([
        z.object({
          productId: z.string(),
          variantSku: z.string().optional(),
          isCombo: z.literal(false).optional(),
          quantity: z.number().min(1),
        }),
        z.object({
          comboProductId: z.string(),
          isCombo: z.literal(true),
          quantity: z.number().min(1),
        }),
      ])
    )
    .min(1, "Please select at least one item"),
  reason: z.string().min(1, "Please select a reason"),
  details: z.string().optional(),
  images: z.array(z.string()).min(1, "Please upload at least one image"),
});

export type RefundRequestFormValues = z.infer<typeof refundRequestSchema>;

export const REFUND_REASONS = [
  "Received damaged item",
  "Item defective or not working",
  "Received wrong item",
  "Item not as described",
  "Changed my mind",
  "Found a better price",
  "Quality not satisfactory",
  "Other",
];
