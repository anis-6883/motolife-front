"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";

export async function getMainCategories() {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.mainCategories}`, {
      method: "GET",
      tags: [cacheTags.mainCategories],
    });

    if (res.data.error) {
      return {
        ok: false,
        message: res.data.error ?? "Failed to get main categories list!",
        data: [],
      };
    }

    return res;
  } catch (error) {
    console.error({ error });
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get main categories list!",
      data: [],
    };
  }
}
