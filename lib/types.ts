import { Address, Seller } from "@/components/admin/order-management/order-details/schema";
import { IProdBenefit } from "@/components/features/public/product-detail/schemas";
import { Icons } from "@/components/icons";
import {
  AnnouncementTypeVariants,
  BusinessType,
  CouponType,
  DISCOUNT_TYPE,
  IdentityType,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  PaymentMethodType,
  PRODUCT_STATUS,
  SellerAccountStatus,
  SellerVerificationStatus,
  ShopType,
  UNIT,
  Weight,
} from "@/config/constant";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

export type SearchFormValues = { search: string };

export type PageSearchProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: number; limit?: number; search?: string; sortOrder?: "asc" | "desc" }>;
};

export type InputObject = { [key: string]: any };

export type PaymentItem = { label: string; value: string | number } | { label: string; icon: keyof typeof Icons };

export type VendorGroup = {
  vendorId: string;
  vendorName: string;
  items: OrderItemType[];
};

export type ToastMessageTypes =
  | string
  | {
      title?: string;
      description?: string;
      message?: string;
    };

export interface ToastOptions {
  duration?: number;
  id?: string;
  icon?: React.ReactElement | string | null;
}

export interface IPagination {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export type ProductCategory = {
  _id: string;
  name: string;
  image: string;
  status?: boolean;
  slug: string;
  subCategories?: ProductCategory[];
  totalProducts?: number;
};

export type SubcategorySheetProps = {
  showSubCategory: boolean;
  setShowSubCategory: (show: boolean) => void;
  selectedCategory: ProductCategory | null;
  columns: ColumnDef<ProductCategory>[];
  tableId: string;
  isLoading: boolean;
  handleSort: (sortedIds: string[]) => Promise<any>;
};

export type BrandDeleteModalProps = {
  trigger: ReactNode;
  brand: Brand;
};

export type Brand = {
  _id: string;
  name: string;
  status: boolean;
  image?: string;
  totalProducts?: number;
};

export type FiltersState = {
  category?: { value: string; type: "parent" | "child" };
  brands: string[];
  availability: string[];
  ratings: number[];
  vendors: string[];
  vendorTypes: string[];
  price?: { min?: string; max?: string };
  sortBy?: "popular" | "newest" | "rating" | "discount";
  priceSort?: "low" | "high";
};

export enum Availability {
  INSTOCK = "instock",
  UPCOMING = "upcoming",
  OUTOFSTOCK = "outofstock",
}

export type FiltersStateComboOffer = {
  category?: { value: string; type: "parent" | "child" };
  brands: string[];
  availability: string[];
  ratings: number[];
  price?: { min?: string; max?: string };
  sortBy?: "popular" | "newest" | "rating" | "discount";
  priceSort?: "low" | "high";
};

export type Attribute = {
  _id: string;
  name: string;
  values: string[];
  status: boolean;
};

export type TCoupon = {
  _id: string;
  title: string;
  type: keyof typeof CouponType;
  code: string;
  bearer: string;
  status: boolean;
  vendor: string;
  customer: string;
  endDate: string;
  startDate: string;
  discountValue: number;
  couponType: string;
  discountType: string;
  limit: number;
  sellerThreshold: number;
  pointsRequired: number;
};

export type CouponData = {
  docs: TCoupon[];
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

export type ProductBenefit = {
  _id: string;
  title: string;
  benefits: {
    heading: string;
    text: string;
  }[];
  status: boolean;
};

export type DamageProductUnit = {
  _id: string;
  category: {
    _id: string;
    name: string;
  };
  damagePercentage: number;
  damageDescription: string;
  isDamaged: boolean;
  sku: string;
  parentSku: string;
  product: {
    _id: string;
    name: string;
    thumbnail: string;
  };
  sellingPrice: boolean;
  createdAt: string;
};

export type DamageProductData = {
  docs: DamageProductUnit[];
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
type Benefit = {
  heading: string;
  text: string;
};

type BenefitData = {
  _id: string;
  title: string;
  benefits: Benefit[];
};
export type InHouseProduct = {
  _id: string;
  name: string;
  thumbnail: string;
  status: boolean;
  category: string;
  subCategory: string;
  brand: string;
  unit: string;
  sku: string;
  description: string;
  videoLinks: {
    title: string;
    url: string;
  }[];
  snapshotLink: string;
  benefit: string;
  benefitData: BenefitData;
  searchTags: string[];
  sizeGuide: {
    description: string;
    images: string[];
  };
  sellingPrice: number;
  images: string[];
  buyingPrice: number;
  stockQuantity: number;
  discountType: string;
  discountValue: number;
  discountPrice: number;
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrived: boolean;
  isUpcoming: boolean;
  showVariation: boolean;
  variants: {
    attributeName: string;
    attributeValue: string[];
    variantPrice: number;
    sku: string;
    stock: number;
    showColorWiseImages: boolean;
    images: string[];
  }[];
  variantCombinations: {
    attributeVariant: string;
    variantPrice: number;
    sku: string;
    stock: number;
  }[];
  colorWiseImages: {
    color: string;
    image: string;
  }[];
  createdAt: string;
};

export type ProductBenefitData = {
  docs: ProductBenefit[];
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

export type AttributeData = {
  docs: Attribute[];
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

export type ProductFAQ = {
  _id: string;
  questionId: string;
  product: {
    _id: string;
    name: string;
    thumbnail: string;
  };
  customerName: string;
  customerEmail: string;
  question: string;
  answer: string;
  date: string;
  status: boolean;
  createdAt: string;
};

export type ProductFAQData = {
  docs: ProductFAQ[];
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

export type InHouseProductData = {
  docs: InHouseProduct[];
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

export type RoleData = {
  docs: Role[];
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

export type BrandData = {
  docs: Brand[];
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

export type CategoryDeleteModalProps = {
  trigger: ReactNode;
  category: ProductCategory;
};

export type TDropzoneMultiple = {
  name: string;
  folderName?: string;
  maxNum?: number; // Max files to be uploaded, default is 5
  maxSize?: number; // Max file size (in bytes), default is 5MB
  accept?: Record<string, string[]>; // Accepted file types
  disabled?: boolean; // Disable the dropzone
  placeholder?: string;
  colors?: string[];
  uploadMultipleImageCredentials?: {
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }[];
  setIsImageUploading?: (value: boolean) => void;
  setUploadMultipleImageCredentials?: (
    value: {
      fileKey: string;
      publicUrl: string;
      uploaded?: boolean;
    }[]
  ) => void;
};

export interface GetFilters {
  search?: string;
  status?: boolean;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined; // allow future filters
}

export type Role = {
  _id: string;
  name: string;
  permissions: string[];
  status: boolean;
};

export type Vendor = {
  _id: string;
  status: boolean;
  name: string;
  phone: string;
  email: string;
  image: string;
  accountStatus: SellerAccountStatus;
  verificationStatus?: SellerVerificationStatus;
  totalRatings: number | string;
  averageRating: number | string;
  totalReviews: number | string;
  balance?: number;
  pendingWithdraws: number;
  totalWithdrawn?: number;
  shopType: ShopType;
  totalOrders: number;
  totalProducts: number;
  activeProducts?: number;
  totalSales?: number;
  softDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  commission?: number;
  gstNumber?: number;

  store: {
    storeName: string;
    contactNumber: string;
    address: string;
    description: string;
    logoImage: string;
    coverImage: string;
    storeCategory: string;
    tradeLicenseNumber: string;
    tradeLicenseImage: string;
    nidOrPassportNumber: string;
    nidOrPassportImage: string;
    tinNumber: string;
    tinImage: string;
    binNumber: string;
    binImage: string;
  };

  businessSettings: {
    businessType: BusinessType | string;
    isAvailable: boolean;
    vacation: {
      isOnVacation: boolean;
    };
    minOrderAmount: number;
    vacationDuration?: string;
    vacationNote?: string;
  };
  manager: {
    name: string;
    identityType: IdentityType;
    identityNumber: string;
    identityImage: string;
  };
  paymentMethods: Array<
    | {
        methodType: PaymentMethodType.BANK;
        isDefault: boolean;
        _id: string;
        bankName: string;
        accountHolderName: string;
        accountNumber: string;
        branchName: string;
      }
    | {
        methodType: PaymentMethodType.BKASH | PaymentMethodType.CASH | "rocket" | "nagad";
        isDefault: boolean;
        _id: string;
        phone: string;
      }
  >;
  showSellerName?: boolean;
};

export interface TiptapProps {
  name?: string; // React Hook Form field name
  value?: string; // Controlled value (without form context)
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  height?: number;
  className?: string;
  labelClassName?: string;
  tooltipContent?: string;
}

export interface CoreEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: number;
  className?: string;
  isError?: boolean;
}

export interface IOrderDetail {
  _id: string;
  orderId: string;
  createdAt: string;
  updatedAt?: string;
  status: ORDER_STATUS;
  customer: IOrderCustomer;
  items: IOrderItem[];
  shippingAddress: IOrderAddress;
  billingAddress: IOrderAddress;
  payment: {
    method: keyof typeof PAYMENT_METHOD;
    status: keyof typeof PAYMENT_STATUS;
    amountPaid: number;
    currency: string;
  };
  subtotal: number;
  tax: number;
  discount: number;
  couponDiscount?: number;
  total: number;
  refundedAmount?: number;
  shippingFee: number;

  customerNote?: string;
  totalItems?: number;
  totalQuantity?: number;

  sellers: IOrderSeller[];

  softDeleted?: boolean;
  cancellationNote?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  deliveredAt?: string;
  assignedTo?: string;
  prevSubTotal?: number;
  specialDiscount?: {
    discountType: "flat" | "percentage";
    discountValue: number;
    reason?: string;
  };
  hasRefunded?: boolean;
}

export interface IOrderCustomer {
  _id?: string;
  fullName: string;
  phone: string;
  email: string;
  totalOrders: number;
  addresses?: Address[];
}

export interface IOrderItem {
  product: string;
  productName: string;
  thumbnail: string;

  seller: {
    _id?: string;
    store: {
      storeName: string;
    };
    name: string;
  };

  sku: string;
  variantSku: string;
  quantity: number;
  unitPrice: number;
  sellingPrice?: number;
  discountPrice?: number;
  totalPrice: number;
}

export interface IOrderAddress {
  fullName: string;
  phone: string;
  email: string;
  district: string;
  thana: string;
  area: string;
  address: string;
}

export interface IOrderSeller {
  _id?: string;
  name: string;
  phone?: string;
  accountStatus?: string;
  totalOrders?: number;
  store?: {
    storeName?: string;
    address?: string;
  };
}

export interface IOrderActivityLog {
  _id: string;
  title: string;
  user: {
    name: string;
    role: "Admin" | "Manager";
  };
  createdAt: string;
}

export interface IProductListObjAdmin {
  _id: string;
  name: string;
  productId: string;
  description: string;
  sku: string;
  category: {
    _id: string;
    name: string;
    logo?: string;
  };
  subCategory?: {
    _id: string;
    name: string;
    logo?: string;
  };
  brand: string;
  unit: UNIT;
  shippingTime: string;
  searchTags: string[];
  thumbnail: string;
  images: string[];
  videoLinks: string[];
  sellingPrice: number;
  discountType: DISCOUNT_TYPE;
  discountPrice: number;
  buyingPrice: number;
  stockQuantity: number;
  weight: Weight;
  benefits: string;
  seller: string;
  sizeGuide: {
    images: string[];
    description: string;
  };
  colorWiseImages?: {
    color: string;
    image: string;
  }[];
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrived: boolean;
  isUpcoming: boolean;
  hasOffer: boolean;
  status: PRODUCT_STATUS;
  isDamaged: boolean;
  createdAt: string;
  quantitySold?: number;
  damageDescription?: string;
}
export interface IFlashSaleSeller {
  _id: string;
  name: string;
  verificationStatus: SellerVerificationStatus;
  store: {
    storeName: string;
  };
}

export interface IFlashSaleItem {
  _id: string;
  name: string;
  thumbnail: string;
  discountType: DISCOUNT_TYPE;
  discountPrice: number;
  discountValue: number;
  sellingPrice: number;
  status: "approved" | "pending";
  rating?: number;
  seller: IFlashSaleSeller[];
  slug: string;
  isNewArrived?: boolean;
  isFeatured?: boolean;
  isUpcoming?: boolean;
  sku?: string;
  isCombo?: boolean;
}

export interface IFlashSale {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: boolean;
  image: string;
  resourceType: string;
  createdAt: string;
  items: IFlashSaleItem[];
  slug: string;
}
export interface IProduct {
  _id: string;
  name: string;
  productId: string;
  description: string;
  sku: string;
  category: string;
  brand: string;
  subCategory: string;
  categoryName?: string;
  subCategoryName?: string;
  brandName?: string;
  unit: UNIT;
  shippingTime?: string;
  searchTags: string[];
  thumbnail: string;
  images: string[];
  videoLinks: { url: string; title: string; thumbnail: string }[];
  sellingPrice: number;
  discountType: DISCOUNT_TYPE;
  discountValue: number;
  discountPrice: number;
  buyingPrice: number;
  stockQuantity: number;
  weight?: Weight;
  benefit?: IProdBenefit;
  slug: string;
  seller: {
    _id: string;
    phone: string;
    image: string;
    store: {
      storeName: string;
      address: string;
      logoImage: string;
    };
    totalProducts?: number;
  };
  sizeGuide?: {
    images: string[];
    description: string;
  };
  colorWiseImages?: {
    color: string;
    image: string;
  }[];
  variants: any[];
  isPublished: boolean;
  isFeatured: boolean;
  benefitData: IProdBenefit;
  isNewArrived: boolean;
  isUpcoming: boolean;
  hasOffer?: boolean;
  status: PRODUCT_STATUS;
  isDamaged?: boolean;
  damageDescription?: string;
  quantitySold?: number;
  totalOrderAmount?: number;
  createdAt: string;
}

export interface IProductPublic {
  _id: string;
  name: string;
  productId: string;
  description: string;
  sku: string;

  category: {
    _id: string;
    name: string;
  };

  brand: {
    _id: string;
    name: string;
  };

  unit: string;

  searchTags: string[];

  thumbnail: string;
  images: string[];
  videoLinks: string[];

  sellingPrice: number;
  buyingPrice: number;
  stockQuantity: number;

  slug: string;

  seller: {
    _id: string;
    accountStatus: string;
    verificationStatus: string;
    store: {
      storeName: string;
      logoImage: string;
    };
  };

  colorWiseImages: {
    color: string;
    image: string;
  }[];

  variants: ProductVariant[];

  isPublished: boolean;
  isFeatured: boolean;
  isNewArrived: boolean;
  isUpcoming: boolean;

  status: string;

  /** Optional fields */
  hasDiscount?: boolean;
  discountPrice?: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;

  sizeGuide?: SizeGuide;

  rating?: number;
  quantitySold?: number;
}
export interface ProductVariant {
  attributes: VariantAttribute[];
  variation: string;
  variantPrice: number;
  sku: string;
  stock: number;
}

export interface VariantAttribute {
  name: string;
  value: string;
}

export interface ColorWiseImage {
  color: string;
  image: string;
}

export interface ProductVideo {
  url: string;
  title: string;
  thumbnail: string;
}

export interface SizeGuide {
  description: string;
  images: string[];
}
export interface ProductVariant {
  attributes: VariantAttribute[];
  variation: string;
  variantPrice: number;
  hasDiscount?: boolean;
  discountPrice?: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  sku: string;
  stock: number;
}

export interface VariantAttribute {
  name: string;
  value: string;
}
export interface IAdminUser {
  _id: string;
  name: string;
  phone: string;
  email: string;
  status: boolean;
  createdAt: string;
  role: {
    _id: string;
    name: string;
    permissions: string[];
    status: boolean;
    createdAt: string;
  };
}

export interface IAdminUserList {
  data: {
    _id: string;
    name: string;
    image?: string;
  }[];
}
export interface CustomerAddress {
  _id: string;
  title: string;
  area: string;
  thana: string;
  district: string;
  address: string;
  zipCode: string;
}

export interface CustomerPaymentMethod {
  _id: string;
  methodType: PaymentMethodType;
  isDefault: boolean;
  cardNumber?: string;
  cardHolderName?: string;
  expiry?: string;
  cvv?: string;
  phone?: string;
}

export interface IOrderDoc {
  _id: string;
  items: OrderItemType[];
  total: number;
  status: ORDER_STATUS;
  orderId: string;
  createdAt: string;
}

export type OrderItemType = {
  product?: string;
  comboProduct?: string;
  productName: string;
  thumbnail?: string;
  seller: Seller;
  sku: string;
  variantSku?: string;
  variation?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isCombo: boolean;
  attributes?: VariantAttribute[];
};
export type PaginationType = {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type AddressType = {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  thana: string;
  area: string;
  district: string;
};

export type ShippingSettings = {
  _id: string;
  shipping: {
    shippingZones: string[];
    shippingCosts: {
      zone: string;
      cost: number;
    }[];
    shippingTimeText: string;
  };
};

export type PaymentDetailsType = {
  method: PAYMENT_METHOD;
  status: PAYMENT_STATUS;
  transactionId?: string;
  paidAt?: Date | string;
  amountPaid: number;
  currency: string;
};

export type Order = {
  _id: string;
  orderId: string;
  customer: string;
  items: OrderItemType[];
  shippingAddress: AddressType;
  billingAddress?: AddressType;
  payment: PaymentDetailsType;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  couponDiscount: number;
  total: number;
  refundedAmount: number;
  status: ORDER_STATUS;
  customerNote?: string;
  totalItems: number;
  totalQuantity: number;
  sellers: string[];
  deliveredAt?: Date | string;
  cancelledAt?: Date | string;
  cancellationReason?: string;
  cancellationNote?: string;
  isCancellable: boolean; // Virtual
  createdAt: Date | string;
  updatedAt: Date | string;
};

export enum REFUND_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
}

export enum REFUND_ITEM_STATUS {
  PENDING = "pending",
  REJECTED = "rejected",
  REFUNDED = "refunded",
}

export type RefundItem = {
  product?: string;
  comboProduct?: string;
  productName: string;
  thumbnail?: string;
  seller: Vendor;
  sku: string;
  variantSku?: string;
  variation?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: REFUND_ITEM_STATUS;
  isCombo: boolean;
};

export type Refund = {
  _id: string;
  refundId: string;
  order: { orderId: string };
  customer: string;
  items: RefundItem[];
  refundReason?: string;
  images?: string[];
  details?: string;
  note?: string;
  refundMethod?: PAYMENT_METHOD;
  totalAmount: number;
  status: REFUND_STATUS;
  softDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TPageProps = {
  params: Promise<{ id: string }>;
};

export type Announcement = {
  _id: string;
  title: string;
  message: string;
  type: AnnouncementTypeVariants;
  displayStyle: string;
  startDate: string;
  endDate?: string;
  selectedSystem: string;
  status: boolean;
  createdAt: string;
};

export type ProductListVariant = "products" | "combo-offers" | "seller-profile" | "flash-sale";

export interface IStockUnit {
  _id: string;
  parentSku: string;
  sku: string;
  isDamaged: boolean;
  damagePercentage: number;
  sellingPrice: number;
  product: {
    _id: string;
    name: string;
    thumbnail: string;
  };
  category: {
    _id: string;
    name: string;
  };
}

export interface IReplyBy {
  storeName: string;
  storeLogo: string;
}

export interface IReviewP {
  _id: string;
  customerName: string;
  customerImage: string;
  images: string[];
  rating: number;
  review: string;
  reply?: string;
  replyBy?: IReplyBy;
  createdAt: string;
  updatedAt: string;
}

export type IOrder = {
  _id: string;
  customer: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponDiscount: number;
  tax?: number;
  total: number;
  status: keyof typeof ORDER_STATUS;
  totalItems: number;
  totalQuantity: number;
  sellers: string[];
  createdAt: string;
  orderId: string;
  payment: Payment;
  hasRefunded?: boolean;
};

export type OrderItem = BaseOrderItem & (SingleProduct | ComboProduct);

type BaseOrderItem = {
  productName: string;
  thumbnail: string;
  seller: Seller;
  sku: string;
  attributes: {
    name: string;
    value: string;
  }[];
  sellingPrice: number;
  hasDiscount: boolean;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type SingleProduct = {
  isCombo: false;
  product: string;
  variantSku: string;
  variation: string;
  comboProduct?: never;
};

type ComboProduct = {
  isCombo: true;
  comboProduct: string;
  product?: never;
  variantSku?: never;
  variation?: never;
};

export type Payment = {
  method: keyof typeof PAYMENT_METHOD;
  status: keyof typeof PAYMENT_STATUS;
  amountPaid: number;
  currency: "BDT";
};
