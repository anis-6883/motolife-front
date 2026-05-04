"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getVendors(params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });

    const res = await apiClient(`${apiRoutes.privateRoutes.admin.userManagement.vendor.get}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.vendors, query.toString()],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get vendor list!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}

export async function getVendorById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.userManagement.vendor.getById(id), {
      method: "GET",
      tags: [`${cacheTags.vendors}-${id}`],
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get vendor!",
      data: [],
    };
  }
}

export async function createVendor(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.userManagement.vendor.create, {
      method: "POST",
      body: data,
    });
    if (res?.data) {
      updateTag(cacheTags.vendors);
      updateTag(cacheTags.activeVendors);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create vendor!",
      data: [],
    };
  }
}

export async function updateVendor(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.userManagement.vendor.update(id), {
      method: "PATCH",
      body: data,
    });
    if (res?.data) {
      updateTag(cacheTags.vendors);
      updateTag(`${cacheTags.vendors}-${id}`);
      updateTag(cacheTags.activeVendors);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update vendor!",
      data: [],
    };
  }
}

export async function sortVendors(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.userManagement.vendor.sort, {
      method: "PATCH",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.vendors);
      updateTag(cacheTags.activeVendors);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to sort vendors",
      data: [],
    };
  }
}

export async function deleteVendor(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid vendor ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.userManagement.vendor.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.vendors);
      updateTag(`${cacheTags.vendors}-${id}`);
      updateTag(cacheTags.activeVendors);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete vendor!",
      data: [],
    };
  }
}
