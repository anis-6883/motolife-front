"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function updateCustomer(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.customer.updateCustomer(id), {
      method: "PATCH",
      body: data,
    });
    if (res?.data) {
      updateTag(cacheTags.customers);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update Customer!",
      data: [],
    };
  }
}
