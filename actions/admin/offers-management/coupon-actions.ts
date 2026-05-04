"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getCoupons(params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.offersManagement.coupons.get}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.coupons],
      cache: "no-store",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get coupons list!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}

export async function updateCoupon(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.offersManagement.coupons.update(id), {
      method: "PATCH",
      body: data,
    });
    if (res?.data) {
      updateTag(cacheTags.coupons);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update coupon!",
      data: [],
    };
  }
}
