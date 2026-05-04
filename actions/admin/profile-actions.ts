"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getAdminProfile() {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.profile, {
      method: "GET",
      cache: "no-store",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get admin profile",
      data: [],
    };
  }
}

export async function updateAdminPassword(data: any) {
  try {
    const res = await apiClient(`/api/v1/admin/auth/change-password`, {
      method: "PUT",
      body: data,
      cache: "no-store",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update admin password",
      data: null,
    };
  }
}

export async function updateAdminProfile(data: any) {
  try {
    const res = await apiClient(`/api/v1/admin/auth/profile`, {
      method: "PUT",
      body: data,
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.adminProfile);
    }
    return {};
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update admin profile",
      data: null,
    };
  }
}

export async function getAdminList() {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.adminListNoPagination, {
      method: "GET",
      tags: [cacheTags.admins],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get admin list",
      data: [],
    };
  }
}
