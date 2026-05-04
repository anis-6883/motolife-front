"use server";

import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";

//! create or update combo banner
export async function createOrUpdate(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.comboOfferBanner.createOrUpdate, {
      method: "POST",
      body: data,
    });

    return res;
  } catch (error: any) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update banner details!",
      data: [],
    };
  }
}

//! get combo banner
export async function getComboBanner() {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.comboOfferBanner.get, {
      method: "GET",
    });

    return res;
  } catch (error: any) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get banner details!",
      data: [],
    };
  }
}

//! delete combo banner
export async function deleteComboBanner(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.comboOfferBanner.delete(id), {
      method: "DELETE",
    });

    return res;
  } catch (error: any) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete banner details!",
      data: [],
    };
  }
}
