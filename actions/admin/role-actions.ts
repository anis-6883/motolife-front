"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getRoles(page: number = 1, limit: number = 10, search: string = "", ...filters: any) {
  try {
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.userRole.get}?page=${page}&limit=${limit}&search=${search}${filters}`, {
      method: "GET",
      tags: [cacheTags.userRoles],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get role list!",
      data: [],
    };
  }
}

export async function getRoleById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.userRole.getById(id), {
      method: "GET",
      tags: [cacheTags.userRoles, `user-role-${id}`],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get role!",
      data: [],
    };
  }
}

export async function createRole(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.userRole.create, {
      method: "POST",
      body: data,
    });
    if (res?.data) updateTag(cacheTags.userRoles);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create role!",
      data: [],
    };
  }
}

export async function updateRole(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.userRole.update(id), {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.userRoles);
      updateTag(`user-role-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update role!",
      data: [],
    };
  }
}

export async function deleteRole(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid role ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.userRole.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.userRoles);
      updateTag(`user-role-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete role!",
      data: [],
    };
  }
}
