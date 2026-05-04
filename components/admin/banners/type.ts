import z from "zod";

export interface BannersData {
  docs: BannerItem[];
  pagination: Pagination;
}

export interface BannerItem {
  //   bgColor: string;
  _id: string;
  type: string;
  resourceType: string;
  image: string;
  status: boolean;
  product?: { name: string; _id: string; thumbnail: string };
  bannerUrl?: string;
  //   title?: string;
  //   description?: string;
  category?: { name: string; _id: string; thumbnail: string };
  seller?: { name: string; _id: string; logoImage: string };
  comboProduct?: { name: string; _id: string; thumbnail: string };
}

export interface Pagination {
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: any;
  nextPage: any;
}

// ─── Form Schema ───────────────────────────────────────────────
export const bannerFormSchema = z
  .object({
    // title: z.string().optional(),
    // description: z.string().optional(),
    // bgColor: z.string().optional(),
    bannerUrl: z.string().optional(),
    image: z.string().min(1, "Banner image is required"),
  })
  .superRefine((data, ctx) => {
    // if (!data.title || data.title.trim() === "") {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Title is required",
    //     path: ["title"],
    //   });
    // }

    // if (!data.description || data.description.trim() === "") {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Description is required",
    //     path: ["description"],
    //   });
    // }

    // if (!data.bgColor) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Background color required",
    //     path: ["bgColor"],
    //   });
    // }

    const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    const isInternalPath = data.bannerUrl?.startsWith("/");

    if (data.bannerUrl && !urlRegex.test(data.bannerUrl) && !isInternalPath) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid URL or path (e.g., /combo-offers)",
        path: ["bannerUrl"],
      });
    }
  });

export type BannerFormValues = z.infer<typeof bannerFormSchema>;
