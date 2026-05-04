"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { updateTag } from "next/cache";

export async function getDamagedStockUnits(filters: GetFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const url = `${apiRoutes.privateRoutes.admin.productManagement.damageProduct.get}${query ? `?${query}` : ""}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.damagedStockUnits, query],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get damaged stock units!",
      data: [],
    };
  }
}

export async function updateDamageUnit(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.damageProduct.update(id), {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.damagedStockUnits);
      updateTag(cacheTags.inHouseProducts);
      updateTag(cacheTags.stockUnits);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update damaged stock unit!",
      data: [],
    };
  }
}

export async function updateDamageUnitsBulk(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.damageProduct.updateBulk, {
      method: "PUT",
      body: data,
    });

    console.log({ res });

    if (res?.data) {
      updateTag(cacheTags.damagedStockUnits);
      updateTag(cacheTags.inHouseProducts);
      updateTag(cacheTags.stockUnits);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update damaged stock units!",
      data: [],
    };
  }
}

export async function deleteDamageUnit(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.damageProduct.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.damagedStockUnits);
      updateTag(cacheTags.inHouseProducts);
      updateTag(cacheTags.stockUnits);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete damaged stock unit!",
      data: [],
    };
  }
}
