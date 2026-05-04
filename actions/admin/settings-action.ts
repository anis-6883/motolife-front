"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getGeneralSettings() {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.settings.get, {
      method: "GET",
      tags: [cacheTags.settings],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get general settings",
      data: [],
    };
  }
}

export async function updateGeneralSettings(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.settings.get, {
      method: "PATCH",
      body: data,
      cache: "no-store",
    });
    if (res.data) {
      updateTag(cacheTags.settings);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update general settings",
      data: null,
    };
  }
}

export async function updatePolicy(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.settings.updatePolicy(id), {
      method: "PATCH",
      body: data,
      cache: "no-store",
    });
    if (res.data) {
      updateTag(cacheTags.settings);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update general settings",
      data: null,
    };
  }
}

export async function deletePolicy(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.settings.updatePolicy(id), {
      method: "DELETE",
      cache: "no-store",
    });
    if (res.data) {
      updateTag(cacheTags.settings);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete policy",
      data: null,
    };
  }
}

export async function addPolicy(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.settings.addPolicy, {
      method: "POST",
      body: data,
    });
    if (res?.data) {
      updateTag(cacheTags.settings);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create policy!",
      data: [],
    };
  }
}
