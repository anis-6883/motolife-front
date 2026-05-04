"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { updateTag } from "next/cache";

export async function getAllBannersForAdmin(filters: GetFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const url = `${apiRoutes.privateRoutes.admin.offersManagement.banner.get}${query ? `?${query}` : ""}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.banners, query],
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get banner list!",
      data: [],
    };
  }
}

export async function getBannerById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.offersManagement.banner.getById(id), {
      method: "GET",
      tags: [cacheTags.banners, `banner-${id}`],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get banner!",
      data: [],
    };
  }
}

export async function createBanner(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.offersManagement.banner.create, {
      method: "POST",
      body: data,
      tags: [cacheTags.banners],
    });

    if (res?.data) updateTag(cacheTags.banners);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create banner!",
      data: [],
    };
  }
}

export async function updateBanner(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.offersManagement.banner.update(id), {
      method: "PATCH",
      body: data,
      tags: [cacheTags.banners],
    });

    if (res?.data) {
      updateTag(cacheTags.banners);
      updateTag(`${cacheTags.banners}-${id}`);
    }
    console.log({ res });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update banner!",
      data: [],
    };
  }
}

export async function deleteBanner(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid banner ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.offersManagement.banner.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.banners);
      updateTag(`banner-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete banner!",
      data: [],
    };
  }
}
