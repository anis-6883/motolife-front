import { addItemToCart, createCart, getCart, removeCartItem, updateCartItem } from "@/actions/cart/cart-actions";
import { CartItem, CartRaw, CreateCartPayload, MutateCartPayload, RemoveCartPayload } from "./Cart-types";

// ─── Normalise ────────────────────────────────────────────────────────────────

function normalise(raw: CartRaw): CartItem[] {
  return (raw.items?.product ?? []).map((p) => ({
    productId: p._id,
    variantSku: p.sku,
    thumbnail: p.thumbnail,
    variation: p.attributes?.map((a) => a.value).join(" / ") ?? "",
    attributes: p.attributes ?? [],
    isCombo: p.isCombo ?? false,
    quantity: 1, // replace once API returns quantity per item
    sellingPrice: p.sellingPrice,
    name: p.name,
  }));
}

// ─── Fetch cart ───────────────────────────────────────────────────────────────
// Used at login sync and at order time to get fresh cartId.

export async function fetchCart(userId: string): Promise<{ cartId: string | null; items: CartItem[] }> {
  const res = await getCart(userId);
  const raw: CartRaw | undefined = res?.data?.data ?? res?.data?.[0];
  if (!raw) return { cartId: null, items: [] };
  return { cartId: raw._id, items: normalise(raw) };
}

// ─── Mutations ────────────────────────────────────────────────────────────────
// These fire on every add/update/remove when user is signed in.
// Server creates the cart automatically on first add if none exists.

export type CartApiResult = "success" | "not_found" | "error";

export async function apiAddItem(payload: MutateCartPayload): Promise<CartApiResult> {
  const res = await addItemToCart(payload);
  if ((res as any)?.statusCode === 404 || (res as any)?.error === "Cart not found!") return "not_found";
  return res?.data?.status ? "success" : "error";
}

export async function apiUpdateItem(payload: MutateCartPayload): Promise<CartApiResult> {
  const res = await updateCartItem(payload);
  if ((res as any)?.statusCode === 404 || (res as any)?.error === "Cart not found!") return "not_found";
  return res?.data?.status ? "success" : "error";
}

export async function apiRemoveItem(payload: RemoveCartPayload): Promise<CartApiResult> {
  const res = await removeCartItem(payload);
  if ((res as any)?.statusCode === 404 || (res as any)?.error === "Cart not found!") return "not_found";
  return res?.data?.status ? "success" : "error";
}

export async function createServerCart(payload: CreateCartPayload): Promise<string> {
  const res = await createCart(payload);
  if (!res?.data?.status) throw new Error("Failed to create cart");

  const cartRes = await getCart(payload.userId);
  const cartId = cartRes?.data?.data?._id ?? cartRes?.data?.[0]?._id;
  if (!cartId) throw new Error("Failed to retrieve cartId after creation");

  return cartId;
}
