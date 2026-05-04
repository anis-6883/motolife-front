"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { updateTag } from "next/cache";

export async function getProductAttributes(filters: GetFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();

  const url = `${apiRoutes.privateRoutes.admin.productManagement.attribute.get}${query ? `?${query}` : ""}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.productAttributes],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get attribute list!",
      data: [],
    };
  }
}

export async function getProductAttributeById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.attribute.getById(id), {
      method: "GET",
      tags: [cacheTags.productAttributes, `product-attribute-${id}`],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get attribute!",
      data: [],
    };
  }
}

export async function createProductAttribute(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.attribute.create, {
      method: "POST",
      body: data,
    });

    if (res?.data) updateTag(cacheTags.productAttributes);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create attribute!",
      data: [],
    };
  }
}

export async function updateProductAttribute(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.attribute.update(id), {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.productAttributes);
      updateTag(`product-attribute-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update attribute!",
      data: [],
    };
  }
}

export async function deleteProductAttribute(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid attribute ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.attribute.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.productAttributes);
      updateTag(`product-attribute-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete attribute!",
      data: [],
    };
  }
}
