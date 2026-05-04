"use server";
import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";
import { WishlistType } from "@/types/wishlist-types";

// export enum WishlistType {
//   PRODUCT = "product",
//   COMBO = "combo",
// }

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

// POST /wishlist — toggle add/remove
export async function createWishList(data: CreateWishlistPayload): Promise<WishlistResponse> {
  try {
    console.log(data);
    const res = await apiClient(apiRoutes.publicRoutes.createWishList, {
      method: "POST",
      body: data,
    });
    return {
      ok: true,
      message: res?.data?.wishlisted ? "Added to wishlist!" : "Removed from wishlist!",
      data: res,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update wishlist!",
      data: null,
    };
  }
}

// GET /wishlist — paginated wishlist list
export async function getWishList(): Promise<WishlistResponse> {
  try {
    // const query = new URLSearchParams({
    //   page: String(params.page ?? 1),
    //   limit: String(params.limit ?? 10),
    // });
    const res = await apiClient(`${apiRoutes.publicRoutes.getWishList}`, { method: "GET" });
    // console.log("Wishlist fetched:", res);

    return {
      ok: true,
      message: "Wishlist fetched successfully!",
      data: res,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to fetch wishlist!",
      data: null,
    };
  }
}

// GET /wishlist/status?productId=&variantSku=&isCombo= — check if item is wishlisted
export async function checkWishlistStatus(params: WishlistStatusParams): Promise<WishlistResponse> {
  try {
    const query = new URLSearchParams({
      productId: params.productId,
      ...(params.variantSku && { variantSku: params.variantSku }),
      ...(params.isCombo !== undefined && { isCombo: String(params.isCombo) }),
    });
    const res = await apiClient(`${apiRoutes.publicRoutes.createWishList}/status?${query}`, { method: "GET" });
    return {
      ok: true,
      message: "Wishlist status fetched!",
      data: res,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to check wishlist status!",
      data: { wishlisted: false }, // safe fallback — heart stays empty on error
    };
  }
}

// DELETE /wishlist/product/:id — remove by product or combo product ID
export async function removeFromWishlistByProductId(productId: string): Promise<WishlistResponse> {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.createWishList}/product/${productId}`, { method: "DELETE" });
    return {
      ok: true,
      message: "Removed from wishlist!",
      data: res,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to remove from wishlist!",
      data: null,
    };
  }
}

// DELETE /wishlist/:id — remove by wishlist document _id
export async function removeFromWishlistById(wishlistId: string): Promise<WishlistResponse> {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.createWishList}/${wishlistId}`, { method: "DELETE" });
    return {
      ok: true,
      message: "Removed from wishlist!",
      data: res,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to remove from wishlist!",
      data: null,
    };
  }
}
