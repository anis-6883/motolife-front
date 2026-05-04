"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { updateTag } from "next/cache";

export async function createComboOffer(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.comboOffer.create, {
      method: "POST",
      body: data,
    });

    if (res?.data) updateTag(cacheTags.comboOffers);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create combo offer!",
      data: [],
    };
  }
}

export async function updateComboOffer(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.comboOffer.update(id), {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.comboOffers);
      updateTag(`${cacheTags.comboOffers}-${id}`);
      updateTag(`${cacheTags.comboProducts}-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update combo offer!",
      data: [],
    };
  }
}

export async function getComboOffers(filters: GetFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const url = `${apiRoutes.privateRoutes.admin.productManagement.comboOffer.get}${query ? `?${query}` : ""}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.comboOffers],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get combo offers list!",
      data: [],
    };
  }
}

export async function getComboOfferById(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid combo offer ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.comboOffer.getById(id), {
      method: "GET",
      tags: [`${cacheTags.comboOffers}-${id}`, cacheTags.comboOffers],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get combo offer!",
      data: [],
    };
  }
}

export async function deleteComboOffer(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid combo offer ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.comboOffer.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.comboOffers);
      updateTag(`${cacheTags.comboOffers}-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete combo offer!",
      data: [],
    };
  }
}
