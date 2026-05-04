import z from "zod";

export type ReStockRequestListData = {
  docs: RestockRequest[];
  pagination: {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: null;
    nextPage: null;
  };
};

export interface RestockRequest {
  _id: string;
  productId: string;
  createdAt: string;
  totalRequests: number;
  updatedAt: string;
  variantRequests: VariantRequest[];
  product: Product;
}

export interface VariantRequest {
  sku: string;
  requests: number;
}

export interface Product {
  _id: string;
  name: string;
  productId: string;
  description: string;
  sku: string;
  category: string;
  subCategory: string;
  brand: string;
  unit: string;
  shippingTime: string;
  searchTags: string[];
  thumbnail: string;
  images: string[];
  videoLinks: string[];
  sellingPrice: number;
  discountType: string;
  discountPrice: number;
  buyingPrice: number;
  stockQuantity: number;
  weight: string;
  benefits: string;
  seller: string;
  sizeGuide: SizeGuide;
  variants: Variant[];
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrived: boolean;
  isUpcoming: boolean;
  hasOffer: boolean;
  status: string;
  isDamaged: boolean;
  __v: number;
  updatedAt: string;
  quantitySold: number;
  damageDescription: string;
}

export interface SizeGuide {
  images: string[];
  description: string;
}

export interface Variant {
  variation: string;
  variantPrice: number;
  sku: string;
  stock: number;
  isDamaged: boolean;
  discountType?: string;
  discountPrice?: number;
  damageDescription: string;
  damagePercentage: number;
  damageType?: string;
}

const variantSchema = z.object({
  variation: z.string(),
  variantPrice: z.number().min(0, "Price must be 0 or more"),
  sku: z.string(),
  stock: z.number().min(0, "Stock must be 0 or more"),
  isDamaged: z.boolean().optional(),
  discountType: z.string().optional(),
  discountPrice: z.number().optional(),
  damageDescription: z.string().optional(),
  damagePercentage: z.number().optional(),
});

export const restockAttributeFormSchema = z.object({
  variants: z.array(variantSchema),
});

//Total stock form schema
export const TotalStockFormSchema = z.object({
  sellingPrice: z.number().min(0, "Selling price must be 0 or more"),
  stockQuantity: z.number().min(0, "Stock must be 0 or more"),
});

export type ReStockFormValues = z.infer<typeof restockAttributeFormSchema>;
export type TotalStockFormValues = z.infer<typeof TotalStockFormSchema>;
