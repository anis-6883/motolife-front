export enum WishlistType {
  PRODUCT = "product",
  COMBO = "combo",
}

export interface CreateWishlistPayload {
  product?: string;
  comboProduct?: string;
  type?: WishlistType;
  variantSku?: string;
}

export interface WishlistStatusParams {
  productId: string;
  variantSku?: string;
  isCombo?: boolean;
}

export interface WishlistResponse {
  ok: boolean;
  message: string;
  data: any;
}
