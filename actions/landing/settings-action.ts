"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";

export async function getSettings() {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.settings, { method: "GET", tags: [cacheTags.settings] });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get settings!",
      data: [],
    };
  }
}

export async function getBusinessSettings(slug: string) {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.businessSettings(slug), { method: "GET", tags: [cacheTags.businessSettings] });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get business settings!",
      data: [],
    };
  }
}
