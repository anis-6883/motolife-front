"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { updateTag } from "next/cache";

export async function getProductFaqs(filters: GetFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const url = `${apiRoutes.privateRoutes.admin.productManagement.productQuestion.get}${query ? `?${query}` : ""}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.productFaqs],
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

export async function getProductFaqById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productQuestion.getById(id), {
      method: "GET",
      tags: [cacheTags.productFaqs, `product-faq-${id}`],
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

export async function createProductFaq(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productQuestion.create, {
      method: "POST",
      body: data,
    });

    if (res?.data) updateTag(cacheTags.productFaqs);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create product faq!",
      data: [],
    };
  }
}

export async function updateProductFaq(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productQuestion.update(id), {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.productFaqs);
      updateTag(`product-faq-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update product faq!",
      data: [],
    };
  }
}

export async function deleteProductFaq(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid attribute ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productQuestion.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.productFaqs);
      updateTag(`product-faq-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete product faq!",
      data: [],
    };
  }
}
