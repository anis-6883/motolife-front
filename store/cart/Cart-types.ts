// ─── Cart Item ────────────────────────────────────────────────────────────────

export interface CartAttribute {
  name: string;
  value: string;
}

export interface CartItem {
  productId: string;
  variantSku: string;
  thumbnail: string;
  variation: string; // e.g. "Red / L"
  attributes: CartAttribute[];
  isCombo: boolean;
  quantity: number;
  sellingPrice: number;
  name: string;
  hasDiscount?: boolean;
}

// ─── API Payloads ─────────────────────────────────────────────────────────────

export interface MutateCartPayload {
  productId?: string;
  comboProductId?: string;
  variantSku: string;
  quantity: number;
  userId: string;
  thumbnail: string;
}

export interface RemoveCartPayload {
  productId: string;
  variantSku: string;
  userId: string;
  isCombo?: boolean;
}

// ─── Raw API Response ─────────────────────────────────────────────────────────

export interface CartAttributeRaw {
  name: string;
  value: string;
}

export interface CartProductRaw {
  _id: string;
  name: string;
  sku: string;
  thumbnail: string;
  images: string[];
  sellingPrice: number;
  attributes?: CartAttributeRaw[];
  isCombo?: boolean;
}

export interface CartRaw {
  _id: string;
  userId: string;
  items: { product: CartProductRaw[] };
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export type ServerCartResponseItem = {
  product?: string;
  comboProduct?: string;
  productName: string;
  thumbnail?: string;
  seller: {
    _id: string;
    store: {
      storeName: string;
      logoImage: string;
    };
    name: string;
  };
  sku: string;
  attributes: {
    name: string;
    value: string;
  }[];
  variantSku: string;
  variation: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isCombo: boolean;
};

export interface GetCartResponse {
  status: boolean;
  message: string;
  data: CartRaw[];
}

// ─── Store Shape ──────────────────────────────────────────────────────────────

export type CheckoutSource = "cart" | "buy-now";

export interface CartStoreState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  isHydrated: boolean;
  isSyncing: boolean;
  cartId: string | null; // ← add this back
  checkoutItems: CartItem[];
  checkoutSource: CheckoutSource | null;
  isCreatingCart: boolean;
}

export interface CreateCartPayload {
  items: CartItem[];
  userId: string;
}

export interface CartItemResponse {
  product: string;
  productName: string;
  seller: {
    _id: string;
    store: {
      storeName: string;
      logoImage: string;
    };
    name: string;
  };
  sku: string;
  thumbnail: string;
  attributes: CartAttributeRaw[];
  variantSku: string;
  variation: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isCombo: boolean;
}
