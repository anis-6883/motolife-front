"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";

export async function getActivityLog(resourceType: string, resourceId: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.activityLog.getActivityLog(resourceType, resourceId), {
      method: "GET",
      tags: [cacheTags.activityLog],
      //   tags: [`${cacheTags.activityLog}-${resourceType}-${resourceId}`],
      cache: "no-store",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get Activity Log!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}
