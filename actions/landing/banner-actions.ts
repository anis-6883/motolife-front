"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";

export async function getBanners(type: string) {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.banners}?type=${type}`, {
      method: "GET",
      tags: [cacheTags.banners],
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get banners list!",
      data: [],
    };
  }
}

//combo offer banner
export async function getComboOfferBanner() {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.getComboBanner, {
      method: "GET",
      // tags: [cacheTags.comboOffers],//to need to add cache
      //   cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get banner details!",
      data: [],
    };
  }
}
