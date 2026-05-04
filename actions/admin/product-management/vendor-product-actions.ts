"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { revalidatePath, updateTag } from "next/cache";

export async function createVendorProduct(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.vendorProduct.create, {
      method: "POST",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.vendorProducts);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create vendor product!",
      data: [],
    };
  }
}

export async function updateVendorProduct(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.vendorProduct.update(id), {
      method: "PUT",
      body: data,
    });
    console.log("res from vendor update", res);
    if (res?.data) {
      updateTag(cacheTags.vendorProducts);
      updateTag(`${cacheTags.vendorProducts}-${id}`);
      updateTag(`${cacheTags.products}-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update vendor product!",
      data: [],
    };
  }
}

export async function getAllVendorProducts(filters: GetFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const url = `${apiRoutes.privateRoutes.admin.productManagement.vendorProduct.get}${query ? `?${query}` : ""}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.vendorProducts, query],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get vendor product list!",
      data: [],
    };
  }
}

export async function getVendorProductById(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid product ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.vendorProduct.getById(id), {
      method: "GET",
      tags: [`${cacheTags.vendorProducts}-${id}`, cacheTags.vendorProducts],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get vendor product!",
      data: [],
    };
  }
}

export async function getVendorStockUnits(filters: GetFilters = {}) {
  try {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });

    const res = await apiClient(`${apiRoutes.privateRoutes.admin.productManagement.vendorProduct.get}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.vendorProducts, query.toString()],
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

export async function deleteVendorProduct(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid product ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.vendorProduct.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.vendorProducts);
      updateTag(`${cacheTags.vendorProducts}-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete vendor product!",
      data: [],
    };
  }
}

export async function deleteVendorStockUnit(id: string) {
  try {
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.productManagement.vendorProduct.getStockUnits}/${id}`, {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.vendorProducts);
      updateTag(`${cacheTags.vendorProducts}-${id}`);
      revalidatePath("/", "layout");
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete vendor stock unit!",
      data: [],
    };
  }
}

export async function updateVendorStockUnit(id: string, data: any) {
  try {
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.productManagement.vendorProduct.getStockUnits}/${id}`, {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.vendorProducts);
      updateTag(`${cacheTags.vendorProducts}-${id}`);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update vendor stock unit!",
      data: [],
    };
  }
}
