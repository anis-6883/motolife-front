"use server";

import { ReStockFormValues, TotalStockFormValues } from "@/components/admin/restock-rquest/type";
import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { updateTag } from "next/cache";

export async function getRequestRestockList(filters: GetFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  const url = `${apiRoutes.privateRoutes.admin.productManagement.requestRestock.get}${query ? `?${query}` : ""}`;
  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.requestReStock],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get request restock list!",
      data: [],
    };
  }
}
export async function stockAttributeUpdateAction({ id, formData }: { id: string; formData: ReStockFormValues }) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.requestRestock.update(id), {
      method: "PATCH",
      body: formData,
    });
    if (res?.data) updateTag(cacheTags.requestReStock);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update product attributes!",
      data: [],
    };
  }
}
export async function productStockUpdate({ id, formData }: { id: string; formData: TotalStockFormValues }) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.requestRestock.update(id), {
      method: "PUT",
      body: formData,
    });
    if (res?.data) updateTag(cacheTags.requestReStock);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update product stock!",
      data: [],
    };
  }
}
export async function updateRequestVisibility({ id, isPublished }: { id: string; isPublished: boolean }) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.requestRestock.update(id), {
      method: "PUT",
      body: { isPublished },
    });
    if (res?.data) updateTag(cacheTags.requestReStock);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update product stock!",
      data: [],
    };
  }
}
export async function deleteRestockRequest(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.requestRestock.delete(id), {
      method: "DELETE",
    });
    if (res?.data) updateTag(cacheTags.requestReStock);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to Delete Restock Request!",
      data: [],
    };
  }
}
