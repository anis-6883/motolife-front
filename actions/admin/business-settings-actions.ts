"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getBusinessSettings() {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.businessSettings.get, {
      method: "GET",
      tags: [cacheTags.businessSettings],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get business settings",
      data: [],
    };
  }
}

export async function updateBusinessSettings(data: any, tab: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.businessSettings.update(tab), {
      method: "PATCH",
      body: data,
      cache: "no-store",
    });

    if (res.data) {
      updateTag(cacheTags.businessSettings);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : `Failed to update ${tab.split("-").join(" ")} settings`,
      data: null,
    };
  }
}
