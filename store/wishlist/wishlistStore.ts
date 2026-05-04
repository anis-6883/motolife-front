import { createWishList, getWishList } from "@/actions/landing/wishList-action";
import { WishlistType } from "@/types/wishlist-types";
import { create } from "zustand";

interface WishlistStore {
  wishlisted: Record<string, boolean>;
  loading: Record<string, boolean>;
  initialized: boolean;

  init: () => Promise<void>;
  toggle: (productId: string, isCombo?: boolean) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  isLoading: (productId: string) => boolean;
  totalCount: () => number;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlisted: {},
  loading: {},
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    try {
      const result = await getWishList();
      const docs = result?.data?.data?.data?.docs || [];
      const map: Record<string, boolean> = {};
      docs.forEach((item: any) => {
        const id = item.type === WishlistType.PRODUCT ? item.product?._id : item.comboProduct?._id;
        if (id) map[id] = true;
      });

      set({
        wishlisted: map,
        initialized: true,
      });
    } catch (err) {
      console.error("Wishlist init failed:", err);
    }
  },

  toggle: async (productId, isCombo = false) => {
    const prev = get().wishlisted[productId];

    set((state) => ({
      wishlisted: {
        ...state.wishlisted,
        [productId]: !prev,
      },
      loading: {
        ...state.loading,
        [productId]: true,
      },
    }));

    try {
      const res = await createWishList({
        type: isCombo ? WishlistType.COMBO : WishlistType.PRODUCT,
        ...(isCombo ? { comboProduct: productId } : { product: productId }),
      });

      const success = !!res?.ok;

      set((state) => ({
        wishlisted: {
          ...state.wishlisted,
          [productId]: success ? !prev : prev,
        },
        loading: {
          ...state.loading,
          [productId]: false,
        },
      }));
    } catch (err) {
      set((state) => ({
        wishlisted: {
          ...state.wishlisted,
          [productId]: prev,
        },
        loading: {
          ...state.loading,
          [productId]: false,
        },
      }));
    }
  },

  isWishlisted: (productId) => {
    return !!get().wishlisted[productId];
  },

  isLoading: (productId) => !!get().loading[productId],
  totalCount: () => Object.values(get().wishlisted).filter(Boolean).length,
}));
