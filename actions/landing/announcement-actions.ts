"use server";

import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";

export async function getCustomerAnnouncements() {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.announcements, {
      method: "GET",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get announcements",
      data: [],
    };
  }
}
