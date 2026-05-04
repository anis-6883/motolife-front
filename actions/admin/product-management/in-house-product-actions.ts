"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { revalidatePath, updateTag } from "next/cache";

export async function createInHouseProduct(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.inHouseProduct.create, {
      method: "POST",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.inHouseProducts);
      updateTag(cacheTags.damagedStockUnits);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create in-house product!",
      data: [],
    };
  }
}

export async function updateInHouseProduct(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.inHouseProduct.update(id), {
      method: "PUT",
      body: data,
    });
    console.log("res from in-house update", res);
    if (res?.data) {
      updateTag(cacheTags.inHouseProducts);
      updateTag(`${cacheTags.inHouseProducts}-${id}`);
      updateTag(`${cacheTags.products}-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update in-house product!",
      data: [],
    };
  }
}

export async function getInHouseProducts(filters: GetFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const url = `${apiRoutes.privateRoutes.admin.productManagement.inHouseProduct.get}${query ? `?${query}` : ""}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.inHouseProducts, query],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get in-house product list!",
      data: [],
    };
  }
}

export async function getInHouseProductById(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid product ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.inHouseProduct.getById(id), {
      method: "GET",
      tags: [`${cacheTags.inHouseProducts}-${id}`, cacheTags.inHouseProducts],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get in-house product!",
      data: [],
    };
  }
}

export async function getStockUnits(filters: GetFilters = {}) {
  try {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });

    const res = await apiClient(`${apiRoutes.privateRoutes.admin.productManagement.inHouseProduct.getStockUnits}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.stockUnits, query.toString()],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get stock units!",
      data: [],
    };
  }
}

export async function deleteInHouseProduct(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid product ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.inHouseProduct.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.inHouseProducts);
      updateTag(`${cacheTags.inHouseProducts}-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete in-house product!",
      data: [],
    };
  }
}

export async function deleteStockUnit(id: string) {
  try {
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.productManagement.inHouseProduct.getStockUnits}/${id}`, {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.stockUnits);
      updateTag(`${cacheTags.stockUnits}-${id}`);
      revalidatePath("/", "layout");
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete stock unit!",
      data: [],
    };
  }
}

export async function updateStockUnit(id: string, data: any) {
  try {
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.productManagement.inHouseProduct.getStockUnits}/${id}`, {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.stockUnits);
      updateTag(`${cacheTags.stockUnits}-${id}`);
      updateTag(cacheTags.inHouseProducts);
      updateTag(`${cacheTags.inHouseProducts}-${id}`);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update stock unit!",
      data: [],
    };
  }
}
