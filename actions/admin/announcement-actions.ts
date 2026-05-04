"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getAnnouncements(params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });

    const res = await apiClient(`${apiRoutes.privateRoutes.admin.announcement.get}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.announcement],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get announcements",
      data: {
        data: {
          docs: [],
          pagination: {
            totalDocs: 0,
          },
        },
      },
    };
  }
}

export async function createAnnouncement(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.announcement.create, {
      method: "POST",
      body: data,
    });
    if (res?.data) {
      updateTag(cacheTags.announcement);
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

export async function getAnnouncementById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.announcement.update(id), {
      method: "GET",
      tags: [`${cacheTags.announcement}-${id}`],
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get announcement!",
      data: [],
    };
  }
}

export async function updateAnnouncement(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.announcement.update(id), {
      method: "PATCH",
      body: data,
    });

    console.log({ res });

    if (res?.data) {
      updateTag(cacheTags.announcement);
      updateTag(`${cacheTags.announcement}-${id}`);
    }

    return res;
  } catch (error) {
    console.log({ error });
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update announcement!",
      data: [],
    };
  }
}

export async function deleteAnnouncement(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid announcement ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.announcement.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.announcement);
      updateTag(`${cacheTags.announcement}-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete announcement!",
      data: [],
    };
  }
}
