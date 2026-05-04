"use server";
import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";

//! manger and user same api as per i know that's why use adminList api
export async function getManager() {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.managerManagement.get, {
      method: "GET",
      // tags: [cacheTags.inhouseShop],//todo need to add cache
      // cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get manager!",
      data: [],
    };
  }
}

//! add ,amager
export async function createManager(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.managerManagement.create, {
      method: "POST",
      body: data,
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create manager!",
      data: [],
    };
  }
}

//! update manager
export async function updateManager(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.managerManagement.update(id), {
      method: "PUT",
      body: data,
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update manager!",
      data: [],
    };
  }
}
//! get single
export async function getManagerById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.managerManagement.getById(id), {
      method: "GET",
      // tags: [cacheTags.inhouseShop],
      // cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get manager!",
      data: [],
    };
  }
}

//!delete
export async function deleteManager(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.managerManagement.delete(id), {
      method: "DELETE",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete manager!",
      data: [],
    };
  }
}
