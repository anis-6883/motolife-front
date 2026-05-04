"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function createReview(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productReview.create, {
      method: "POST",
      body: data,
    });
    if (res?.data) {
      updateTag(cacheTags.review);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create Review!",
      data: [],
    };
  }
}
export async function updateReview(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productReview.updateReview(id), {
      method: "PATCH",
      body: data,
    });
    if (res?.data) {
      updateTag(cacheTags.review);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update Review!",
      data: [],
    };
  }
}
export async function deleteReview(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productReview.deleteReview(id), {
      method: "DELETE",
    });
    if (res?.data) {
      updateTag(cacheTags.review);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete Review!",
      data: [],
    };
  }
}
