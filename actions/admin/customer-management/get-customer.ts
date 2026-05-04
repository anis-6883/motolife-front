import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";

export async function getCustomerList(params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.customer.getCustomers}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.customer],
      cache: "no-store",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get customer list!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}
export async function getCustomerById(id: string, params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.customer.getSingleCustomer(id)}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.customer],
      cache: "no-store",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get customer!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}
export async function getCustomerOrdersById(id: string, params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.customer.getSingleCustomerOrders(id)}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.order],
      cache: "no-store",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get customer!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}
export async function getCustomerOrdersDetailsById(id: string, orderId: string) {
  try {
    const query = new URLSearchParams();

    const res = await apiClient(`${apiRoutes.privateRoutes.admin.customer.getSingleCustomerOrdersDetails(id, orderId)}`, {
      method: "GET",
      tags: [cacheTags.order],
      cache: "no-store",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get order details!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}
export async function getCustomerWishlistById(id: string) {
  try {
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.customer.getSingleCustomerWishlist(id)}`, {
      method: "GET",
      // tags: [cacheTags.wishlist],
      // cache: "no-store",
    });
    console.log("res", res);
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get wishlist!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}
