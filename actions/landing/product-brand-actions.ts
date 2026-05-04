"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";

export async function getProductBrands() {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.brands}`, {
      method: "GET",
      tags: [cacheTags.brands],
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get product brands list!",
      data: [],
    };
  }
}
