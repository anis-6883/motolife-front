"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export const getRefunds = async (params: Record<string, string | number | undefined>) => {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.privateRoutes.customer.account.getRefunds(query.toString())}`, {
      method: "GET",
      tags: [cacheTags.customerRefunds],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get refunds list!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
};

export const requestRefund = async (orderId: string, data: any) => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.requestRefund(orderId), {
      method: "POST",
      body: data,
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.customerRefunds);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to request refund",
      data: null,
    };
  }
};
