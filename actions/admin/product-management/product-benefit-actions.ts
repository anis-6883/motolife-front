"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { revalidatePath, updateTag } from "next/cache";

export async function getProductBenefit(filters: GetFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const url = `${apiRoutes.privateRoutes.admin.productManagement.benefit.get}${query ? `?${query}` : ""}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.productBenefit],
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

export async function getProductBenefitById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.benefit.getById(id), {
      method: "GET",
      tags: [cacheTags.productBenefit, `product-benefit-${id}`],
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

export async function createProductBenefit(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.benefit.create, {
      method: "POST",
      body: data,
    });

    if (res?.data) updateTag(cacheTags.productBenefit);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create benefit!",
      data: [],
    };
  }
}

export async function updateProductBenefit(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.benefit.update(id), {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.productBenefit);
      updateTag(`product-benefit-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update benefit!",
      data: [],
    };
  }
}

export async function deleteProductBenefit(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid benefit ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.benefit.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.productBenefit);
      updateTag(`product-benefit-${id}`);
      updateTag(cacheTags.inHouseProducts);
      updateTag(cacheTags.comboOffers);
      revalidatePath("/", "layout");
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete benefit!",
      data: [],
    };
  }
}
