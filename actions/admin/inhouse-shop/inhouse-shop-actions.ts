"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getInHouseShop() {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.inHouseShopManagement.get, {
      method: "GET",
      tags: [cacheTags.inHouseShop],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get vendor!",
      data: [],
    };
  }
}
export async function updateInHouseShop(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.inHouseShopManagement.update, {
      method: "PATCH",
      body: data,
    });

    updateTag(cacheTags.inHouseShop);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update vendor!",
      data: [],
    };
  }
}

export async function getShopStats() {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.inHouseShopManagement.stats, {
      method: "GET",
      tags: [cacheTags.inHouseShop],
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get vendor!",
      data: [],
    };
  }
}
