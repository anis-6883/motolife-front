"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getFlashSaleProducts() {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.flashSaleProducts}`, {
      method: "GET",
      tags: [cacheTags.flashSaleProducts],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get flash sale products!",
      data: [],
    };
  }
}

export async function getProducts(params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.publicRoutes.getProducts}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.products, query.toString()],
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get products!",
      data: [],
    };
  }
}

export async function getComboProducts(params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.publicRoutes.getComboProducts}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.comboProducts, query.toString()],
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get products!",
      data: [],
    };
  }
}

export async function getAllOfferProducts(params: Record<string, string | number | undefined>, slug?: string) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.publicRoutes.allOfferProducts(slug || "")}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.flashSaleProducts, query.toString(), cacheTags.products],
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get all offer products!",
      data: [],
    };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.getProductBySlug(slug)}`, {
      method: "GET",
      tags: [`${cacheTags.products}-${slug}`],
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get product by slug!",
      data: [],
    };
  }
}
export async function getRelatedProducts(slug: string) {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.getRelatedProducts(slug)}`, {
      method: "GET",
      tags: [cacheTags.products],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get related products!",
      data: [],
    };
  }
}
export async function getReviewsByProdSlug(slug: string, type?: string, params?: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.publicRoutes.getReviewsByProdSlug(slug, type)}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.reviews, slug, query.toString()],
      cache: "no-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get reviews by product slug!",
      data: [],
    };
  }
}
export async function getFAQByProdSlug(slug: string, type?: string, params?: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.publicRoutes.getFAQByProdSlug(slug, type)}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.productFaqs],
      cache: "no-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get product faqs!",
      data: [],
    };
  }
}

export async function createReview(data: any) {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.createReview}`, {
      method: "POST",
      body: data,
      tags: [cacheTags.reviews],
      cache: "force-cache",
    });

    if (res?.data) {
      updateTag(cacheTags.reviews);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create review!",
      data: [],
    };
  }
}

export async function createQA(data: any) {
  console.log(data, "qa data");
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.createQA}`, {
      method: "POST",
      body: data,
      cache: "force-cache",
    });

    if (res?.data) {
      updateTag(cacheTags.productFaqs);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create QA!",
      data: [],
    };
  }
}

export async function getComboProductBySlug(slug: string) {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.getComboProductBySlug(slug)}`, {
      method: "GET",
      tags: [`${cacheTags.comboProducts}-${slug}`],
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get product by slug!",
      data: [],
    };
  }
}

export async function requestRestock(productId: string, sku?: string) {
  try {
    const body = {
      productId,
      ...(sku && { variantRequest: { sku } }),
    };
    const res = await apiClient(`${apiRoutes.publicRoutes.requestRestock}`, {
      method: "POST",
      body,
      cache: "force-cache",
    });
    if (res?.data) {
      updateTag(cacheTags.restockRequest);
      updateTag(cacheTags.requestReStock);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to request restock!",
      data: [],
    };
  }
}
