"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function addItemToCart(data: any) {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.cart, {
      method: "POST",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.cart);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to add item to cart!",
      data: [],
    };
  }
}

export async function updateCartItem(data: any) {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.cart, {
      method: "PATCH",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.cart);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update cart item!",
      data: [],
    };
  }
}

export async function removeCartItem(data: any) {
  try {
    let payload;
    if (data.isCombo) {
      const { productId, ...rest } = data;
      payload = {
        ...rest,
        comboProductId: productId,
      };
    } else {
      payload = data;
    }

    const res = await apiClient(apiRoutes.publicRoutes.cart, {
      method: "DELETE",
      body: payload,
    });
    // console.log(res, "remove cart item response", payload);
    if (res?.data) {
      updateTag(cacheTags.cart);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to remove cart item!",
      data: [],
    };
  }
}

export async function clearCart(userId: string) {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.clearCart(userId), {
      method: "DELETE",
    });
    if (res?.data) {
      updateTag(cacheTags.cart);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to clear cart!",
      data: [],
    };
  }
}

export async function getCart(guestId?: string, isGuest?: boolean) {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.getCart(guestId, isGuest), { method: "GET", tags: [cacheTags.cart] });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get cart!",
      data: [],
    };
  }
}

export async function createCart(data: any) {
  try {
    // const items = data.items.map((item: any) => {
    //   if (item.isCombo) {
    //     const { productId, ...rest } = item;
    //     return {
    //       ...rest,
    //       comboProductId: productId,
    //     };
    //   }
    //   return item;
    // });
    const items = data.items.map((item: any) => {
      if (item.isCombo) {
        const { productId, variantSku, ...rest } = item;

        return {
          ...rest,
          comboProductId: productId,
        };
      }

      return item;
    });
    const total = items.reduce((sum: number, item: any) => sum + item.sellingPrice * item.quantity, 0);

    const payload = {
      ...data,
      items,
      total,
    };
    // console.log(JSON.stringify(payload), "cart payload");
    const res = await apiClient(apiRoutes.publicRoutes.createCart, {
      method: "POST",
      body: payload,
      credentials: "include",
    });
    if (res?.data) {
      updateTag(cacheTags.cart);
    }
    // console.log(res, "cart response");
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create cart!",
      data: [],
    };
  }
}
export async function createOrder(data: any) {
  try {
    let payload = data;

    if (data?.items) {
      const items = data.items.map((item: any) => {
        if (item.isCombo) {
          const { productId, ...rest } = item;
          return {
            ...rest,
            comboProductId: productId,
          };
        }
        return item;
      });

      payload = {
        ...data,
        items,
      };
    }
    // console.log(JSON.stringify(payload), "order payload");
    const res = await apiClient(apiRoutes.publicRoutes.createOrder, {
      method: "POST",
      body: payload,
    });

    if (res?.data) {
      updateTag(cacheTags.cart);
      updateTag(cacheTags.orders);
      updateTag(cacheTags.products);
      updateTag(cacheTags.comboProducts);
      updateTag(cacheTags.stockUnits);
      updateTag(cacheTags.comboOffers);
      updateTag(cacheTags.inHouseProducts);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create order!",
      data: [],
    };
  }
}

export async function getShippingSettings() {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.shippingSettings, { method: "GET", tags: [cacheTags.shippingSettings] });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get shipping settings!",
      data: [],
    };
  }
}
