import { SizeGuide } from "@/components/admin/restock-rquest/type";
import { z } from "zod";

export const ReviewSchema = z.object({
  review: z.string().min(10, "Review must be at least 10 characters").max(500, "Review must be at most 500 characters"),
  customerName: z.string().min(2, "Name is required"),
  productId: z.string().optional(),
  comboProductId: z.string().optional(),
  rating: z.number().min(1, "Rating is required"),
  customerPhone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[0-9\s-]{8,15}$/.test(val), "Invalid phone number"),
  images: z.array(z.any()).optional(),
  saveInfo: z.boolean().optional(),
});

export type ReviewFormSchema = z.infer<typeof ReviewSchema>;
export interface IFaq {
  _id: string;
  customerName: string;
  customerEmail: string;
  question: string;
  answer: string;
  createdAt: string;
  product?: {
    _id: string;
    name: string;
  };
}
export interface ProductDetailObj {
  _id: string;
  name: string;
  productId: string;
  description: string;
  sku: string;
  isCombo?: boolean;
  category: Category;
  subCategory: Category;
  brand: Brand;

  benefit: IProdBenefit;

  unit: string;
  searchTags: string[];

  thumbnail: string;
  images: string[];
  videoLinks: VideoLink[];

  sellingPrice: number;
  buyingPrice: number;
  stockQuantity: number;

  slug: string;

  seller: Seller[];

  colorWiseImages: ColorWiseImage[];
  variants: Variant[];
  faq: IFaq[];
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrived: boolean;
  isUpcoming: boolean;

  discountPrice: string;
  discountType: "flat" | "percentage";
  discountValue: string;
  hasDiscount: boolean;

  quantitySold: string;

  rating: number;
  sizeGuide: SizeGuide;
  reviewCount: number;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Brand {
  _id: string;
  name: string;
}

export interface IProdBenefit {
  _id: string;
  title: string;
  benefits: BenefitItem[];
}

export interface BenefitItem {
  heading: string;
  text: string;
}

export interface VideoLink {
  url: string;
  title: string;
  thumbnail: string;
}

export interface Seller {
  _id: string;
  phone: string;
  image: string;
  verificationStatus: string;
  store: Store;
  businessSettings: BusinessSettings;
}

export interface BusinessSettings {
  minOrderAmount: number;
  isAvailable?: boolean;
  vacation?: {
    isOnVacation: boolean;
    durationType: string | null;
    startAt: string | null;
    endsAt: string | null;
    note: string | null;
  };
}

export interface Store {
  storeName: string;
  address: string;
  logoImage: string;
}

export interface ColorWiseImage {
  color: string;
  image: string;
}

export interface Variant {
  attributes?: VariantAttribute[];
  variation?: string;
  variantPrice?: number;
  sku?: string;
  stock?: number;
  discountPrice?: number;
  hasDiscount?: number;
}

export interface VariantAttribute {
  name: string;
  value: string;
}
