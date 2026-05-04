"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { updateTag } from "next/cache";

export async function getProductCategories(filters: GetFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const url = `${apiRoutes.privateRoutes.admin.productManagement.productCategory.get}${query ? `?${query}` : ""}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.productCategories],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get category list!",
      data: [],
    };
  }
}

export async function getProductCategoryById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productCategory.getById(id), {
      method: "GET",
      tags: [cacheTags.productCategories, `category-${id}`],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get category!",
      data: [],
    };
  }
}

export async function createProductCategory(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productCategory.create, {
      method: "POST",
      body: data,
    });
    if (res?.data) {
      updateTag(cacheTags.productCategories);
      updateTag(cacheTags.mainCategories);
      updateTag(cacheTags.activeProductCategories);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create category!",
      data: [],
    };
  }
}

export async function updateProductCategory(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productCategory.update(id), {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.productCategories);
      updateTag(`category-${id}`);
      updateTag(cacheTags.mainCategories);
      updateTag(cacheTags.activeProductCategories);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update category!",
      data: [],
    };
  }
}

export async function sortProductCategories(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productCategory.sort, {
      method: "PATCH",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.productCategories);
      updateTag(cacheTags.mainCategories);
      updateTag(cacheTags.activeProductCategories);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to shorts product category",
      data: [],
    };
  }
}

export async function deleteProductCategory(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid category ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productCategory.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.productCategories);
      updateTag(`category-${id}`);
      updateTag(cacheTags.mainCategories);
      updateTag(cacheTags.activeProductCategories);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete category!",
      data: [],
    };
  }
}
