import { clearCart as clearCartAction, createCart, getCart } from "@/actions/cart/cart-actions";
import Toast from "@/components/shared/Toast";
import { deleteCookie, setCookie } from "cookies-next/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { getCurrentUserId } from "../useUserProfile";
import { apiAddItem, apiRemoveItem } from "./api";
import { CartItem, CartStoreState, CheckoutSource, ServerCartResponseItem } from "./Cart-types";
// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0);
  return { subtotal, tax: 0, total: subtotal };
}

function matchItem(a: CartItem, b: CartItem) {
  return a.productId === b.productId && a.variantSku === b.variantSku;
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface CartStore extends CartStoreState {
  // ── Mutations ─────────────────────────────────────────────────────────────
  // No API calls unless cartId is set (cart created at checkout init).
  addItem: (item: CartItem) => Promise<void>;
  updateItem: (productId: string, variantSku: string, quantity: number) => Promise<void>;
  removeItem: (productId: string, variantSku: string) => Promise<void>;
  clearCart: () => Promise<void>;
  addToOrderNow: (item: CartItem) => void;
  clearOrderNow: () => void;
  minAmount: number;
  // ── Checkout ──────────────────────────────────────────────────────────────
  // Creates the server cart, stores cartId, sets checkout context.
  // Call this before pushing to checkout route.
  initCheckoutAndNavigate: (source: CheckoutSource, items: CartItem[]) => Promise<{ success: boolean }>;
  clearCheckout: () => void;

  // ── Login sync ────────────────────────────────────────────────────────────
  syncOnLogin: (userId: string) => Promise<void>;

  // ── Helpers ───────────────────────────────────────────────────────────────
  recalculate: () => void;
  setHydrated: (v: boolean) => void;
  orderNowItem: CartItem | null;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (v: boolean) => void;
  setMinAmount: (v: number) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      minAmount: 0,
      tax: 0,
      total: 0,
      isHydrated: false,
      isSyncing: false,
      cartId: null,
      checkoutItems: [],
      checkoutSource: null,
      isCreatingCart: false,
      orderNowItem: null,
      cartDrawerOpen: false,
      setCartDrawerOpen: (v: boolean) => set({ cartDrawerOpen: v }),
      setMinAmount: (v: number) => set({ minAmount: v }),
      addToOrderNow: (item) => set({ orderNowItem: item }),
      clearOrderNow: () => {
        set({ orderNowItem: null });
        deleteCookie("guestId");
        deleteCookie("cartId");
      },
      // ── Add item ───────────────────────────────────────────────────────────
      // Local-only unless cartId exists (post checkout-init).
      // addItem: async (item) => {
      //   const existing = get().items.find((i) => matchItem(i, item));
      //   const newQty = existing ? existing.quantity + item.quantity : item.quantity;

      //   const updatedItems = existing
      //     ? get().items.map((i) => (matchItem(i, item) ? { ...i, quantity: newQty } : i))
      //     : [...get().items, item];

      //   set({ items: updatedItems, ...calcTotals(updatedItems) });

      //   const userId = getCurrentUserId();
      //   if (
      //     userId
      //     //  && get().cartId
      //   ) {
      //     const result = await apiAddItem({
      //       ...(item.isCombo ? { comboProductId: item.productId } : { productId: item.productId }),
      //       ...(item.isCombo ? { variantSku: "" } : { variantSku: item.variantSku }),
      //       quantity: newQty,
      //       userId,
      //       thumbnail: item.thumbnail,
      //       ...(item.isCombo && { isCombo: true }),
      //     });
      //     if (result === "not_found") {
      //       set({ items: [], subtotal: 0, tax: 0, total: 0, cartId: null });
      //     }
      //   }
      // },
      addItem: async (item) => {
        const state = get();
        const existing = state.items.find((i) => matchItem(i, item));

        let updatedItems;

        // CASE 1: New item → add + call API
        if (!existing) {
          updatedItems = [...state.items, item];

          set({ items: updatedItems, ...calcTotals(updatedItems) });

          const userId = getCurrentUserId();

          if (userId) {
            const result = await apiAddItem({
              ...(item.isCombo ? { comboProductId: item.productId } : { productId: item.productId }),
              ...(item.isCombo ? { variantSku: "" } : { variantSku: item.variantSku }),
              quantity: item.quantity,
              userId,
              thumbnail: item.thumbnail,
              ...(item.isCombo && { isCombo: true }),
            });

            if (result === "not_found") {
              set({ items: [], subtotal: 0, tax: 0, total: 0, cartId: null });
            }
          }

          return;
        }

        // CASE 2: Existing item → increment locally only
        updatedItems = state.items.map((i) => (matchItem(i, item) ? { ...i, quantity: i.quantity + item.quantity } : i));

        set({ items: updatedItems, ...calcTotals(updatedItems) });
      },
      // ── Update quantity ────────────────────────────────────────────────────
      updateItem: async (productId, variantSku, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantSku);
          return;
        }

        const updatedItems = get().items.map((i) => (i.productId === productId && i.variantSku === variantSku ? { ...i, quantity } : i));

        set({ items: updatedItems, ...calcTotals(updatedItems) });

        // const userId = getCurrentUserId();
        // if (userId && get().cartId) {
        //   const result = await apiUpdateItem({ productId, variantSku, quantity, userId });
        //   if (result === "not_found") {
        //     set({ items: [], subtotal: 0, tax: 0, total: 0, cartId: null });
        //   }
        // }
      },

      // ── Remove item ────────────────────────────────────────────────────────
      // removeItem: async (productId, variantSku) => {
      //   const updatedItems = get().items.filter((i) => !(i.productId === productId && i.variantSku === variantSku));

      //   set({ items: updatedItems, ...calcTotals(updatedItems) });

      //   const userId = getCurrentUserId();
      //   if (
      //     userId
      //     //  && get().cartId
      //   ) {
      //     const result = await apiRemoveItem({ productId, variantSku, userId });
      //     if (result === "not_found") {
      //       set({ items: [], subtotal: 0, tax: 0, total: 0, cartId: null });
      //     }
      //   }
      // },
      removeItem: async (productId, variantSku) => {
        const isCombo = get().items.find((i) => i.productId === productId)?.isCombo;
        const updatedItems = get().items.filter((i) => !(i.productId === productId && i.variantSku === variantSku));
        set({ items: updatedItems, ...calcTotals(updatedItems) });
        const userId = getCurrentUserId();
        if (userId) {
          try {
            const result = await apiRemoveItem({ productId, variantSku, userId, isCombo });

            if (result === "not_found") {
              if (updatedItems.length === 0) {
                set({ items: [], subtotal: 0, tax: 0, total: 0, cartId: null });
              }
              //  else {
              //   console.warn("API returned not_found but local cart has items. Ignoring to prevent wipe.");
              // }
            }
          } catch (err) {
            console.error("Failed to remove item from server cart:", err);
          }
        }
      },
      // ── Clear cart ─────────────────────────────────────────────────────────
      clearCart: async () => {
        const userId = getCurrentUserId();
        set({ items: [], subtotal: 0, tax: 0, total: 0, cartId: null });
        if (userId) await clearCartAction(userId);
      },

      // ── Init checkout ──────────────────────────────────────────────────────
      // Creates server cart with current items, stores returned cartId.
      // After this, add/update/remove will sync with API.
      initCheckoutAndNavigate: async (source, items) => {
        const userId = getCurrentUserId();
        const total = get().total ?? 0; // fetch total directly from store
        const minAmount = get().minAmount ?? 0; // fetch minAmount from store

        if (total < minAmount) {
          Toast.error(`Minimum order amount is ${minAmount} BDT`);
          return { success: false }; // stop execution
        }
        set({ checkoutSource: source, checkoutItems: items, isCreatingCart: true });
        try {
          const res = await createCart(
            { items }
            // userId ? { items, userId } : { items }
          );

          if ((res as any)?.error || (res as any)?.statusCode === 400) {
            // console.error((res as any)?.error);

            // show toast / UI message
            Toast.error((res as any)?.error || "Failed to create cart");

            return { success: false }; // stop execution
          }

          if (userId) {
            const cartRes = await getCart(userId);
            const cartId = cartRes?.data?.data?._id ?? cartRes?.data?.[0]?._id ?? null;

            set({ cartId });
          }
          if (res?.data?.data?.guestId) {
            setCookie("guestId", res?.data?.data?.guestId);
          }
          setCookie("cartId", res?.data?.data?._id);
          return { success: true };
        } catch (err) {
          // console.error("Failed to create cart:", err);
          Toast.error("Something went wrong. Please try again.");
          return { success: false };
        } finally {
          set({ isCreatingCart: false });
        }
      },

      // ── Clear checkout ─────────────────────────────────────────────────────
      clearCheckout: () => set({ checkoutSource: null, checkoutItems: [], cartId: null }),

      // ── Sync on login ──────────────────────────────────────────────────────
      // Merges server cart items into local state. No cart creation here.
      syncOnLogin: async (userId) => {
        set({ isSyncing: true });
        try {
          const res = await getCart(userId);
          const raw = res?.data?.data ?? res?.data?.[0];
          if (!raw) return;
          const serverItems: CartItem[] = (raw.items ?? []).map((p: ServerCartResponseItem) => ({
            productId: p.product ?? p.comboProduct,
            variantSku: p.variantSku,
            thumbnail: p.thumbnail ?? "",
            variation: p.attributes?.map((a: any) => a.value).join(" / ") ?? "",
            attributes: p.attributes ?? [],
            isCombo: p.isCombo ?? false,
            quantity: 1,
            sellingPrice: p.unitPrice,
            name: p.productName,
          }));
          if (serverItems.length > 0) {
            const merged = mergeItems(get().items, serverItems);
            set({ items: merged, ...calcTotals(merged) });
          }
        } catch (err) {
          Toast.error("Something went wrong. Please try again.");
          // console.error("Cart sync failed:", err);
        } finally {
          set({ isSyncing: false });
        }
      },

      // ── Recalculate totals ─────────────────────────────────────────────────
      // Called after rehydration so totals are correct on page load.
      recalculate: () => {
        const { items, tax } = get();
        const subtotal = items.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0);
        set({ subtotal, tax, total: subtotal + tax });
      },

      setHydrated: (v) => set({ isHydrated: v }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        orderNowItem: state.orderNowItem,
        minAmount: state.minAmount,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.setHydrated(true);
        state.recalculate();
      },
    }
  )
);

// ─── Merge helper ─────────────────────────────────────────────────────────────

function mergeItems(local: CartItem[], server: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of server) map.set(`${item.productId}-${item.variantSku}`, item);
  for (const item of local) {
    const key = `${item.productId}-${item.variantSku}`;
    if (map.has(key)) {
      map.set(key, {
        ...map.get(key)!,
        quantity: Math.max(map.get(key)!.quantity, item.quantity),
      });
    } else {
      map.set(key, item);
    }
  }
  return Array.from(map.values());
}

// ─── Selector hooks ───────────────────────────────────────────────────────────

export const useCartItems = () => useCartStore((s) => s.items);
export const useCartCount = () => useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
export const useCartIsHydrated = () => useCartStore((s) => s.isHydrated);
export const useCartIsSyncing = () => useCartStore((s) => s.isSyncing);
export const useCartTotals = () => useCartStore(useShallow((s) => ({ subtotal: s.subtotal, tax: s.tax, total: s.total })));
export const useCheckout = () => useCartStore(useShallow((s) => ({ checkoutItems: s.checkoutItems, checkoutSource: s.checkoutSource })));
