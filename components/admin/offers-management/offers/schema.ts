import z from "zod";

export const offersSchema = z
  .object({
    title: z.string().min(1, "Sale title is required!"),
    startDate: z.string().min(1, "Start date is required!"),
    endDate: z.string().min(1, "End date is required!"),
    resourceType: z
      .enum(["category", "flash_sale", "todays_deal"])
      .optional()
      .refine((value) => !!value, "Resource type is required!"),
    // bannerUrl: z.string().optional(),
    image: z.string().min(1, "Banner image is required!"),
    status: z.boolean(),
    categoryId: z.string().optional(),
    sellerId: z.string().optional(),
    comboProductId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    // const isInternalPath = data.bannerUrl?.startsWith("/");

    // if (data.bannerUrl && !urlRegex.test(data.bannerUrl) && !isInternalPath) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Please enter a valid URL or path (e.g., /product-list)",
    //     path: ["bannerUrl"],
    //   });
    // }

    if (data.resourceType === "category") {
      if (!data.categoryId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Category is required",
          path: ["categoryId"],
        });
      }
    }

    // if (data.resourceType === "store") {
    //   if (!data.sellerId) {
    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: "Store is required",
    //       path: ["sellerId"],
    //     });
    //   }
    // }
    // if (data.resourceType === "combo") {
    //   if (!data.comboProductId) {
    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: "Combo offer is required",
    //       path: ["comboProductId"],
    //     });
    //   }
    // }
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date!",
        path: ["endDate"],
      });
    }
  });
