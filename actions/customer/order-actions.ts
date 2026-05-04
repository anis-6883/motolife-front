"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export const getCustomerOrders = async (params: Record<string, string | number | undefined>) => {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.privateRoutes.customer.account.getOrders}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.customerOrders, cacheTags.orders],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get customer orders",
      data: [],
    };
  }
};

export const getCustomerOrder = async (orderId: string) => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.getOrder(orderId), {
      method: "GET",
      tags: [`${cacheTags.customerOrders}-${orderId}`],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get customer order",
      data: null,
    };
  }
};

export const cancelOrder = async (id: string, data: any) => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.cancelOrder(id), {
      method: "PUT",
      body: data,
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.customerOrders);
      updateTag(cacheTags.orders);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to cancel order",
      data: null,
    };
  }
};

export const trackOrderAction = async (orderId: string) => {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.trackOrder(orderId), {
      method: "GET",
      // No tags or cache specified for now as tracking is typically real-time
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to track order",
      data: null,
    };
  }
};
