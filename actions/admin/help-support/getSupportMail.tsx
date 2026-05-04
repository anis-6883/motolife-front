"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getSupportMailList(params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.helpSupport.getSupportMail}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.helpSupport],
      cache: "no-store",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get help and support list!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}

export async function deleteContact(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.helpSupport.deleteContact(id), {
      method: "DELETE",
    });
    if (res?.data) {
      updateTag(cacheTags.helpSupport);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete contact!",
      data: [],
    };
  }
}

export async function getContactById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.helpSupport.getContactById(id), {
      method: "GET",
      tags: [cacheTags.helpSupport, id],
      cache: "no-store",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get contact!",
      data: null,
    };
  }
}

export async function replyContact(id: string, body: { subject: string; message: string }) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.helpSupport.reply(id), {
      method: "PATCH",
      body,
    });
    if (res?.data) {
      updateTag(cacheTags.helpSupport);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to send reply!",
      data: null,
    };
  }
}

export async function getProductsListById(id: string) {
  try {
    const query = new URLSearchParams();

    // Object.entries(params).forEach(([key, value]) => {
    //   if (value !== undefined && value !== "") {
    //     query.append(key, String(value));
    //   }
    // });
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.offersManagement.offersList.getById(id)}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.offersById],
      cache: "no-store",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get offer products list!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}
export async function getOffersListById(offerId: string, params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(
      `${apiRoutes.privateRoutes.admin.offersManagement.offersList.getOffersItemsById(offerId)}?${query.toString()}`,
      {
        method: "GET",
        tags: [cacheTags.offersById],
        cache: "no-store",
      }
    );
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get offer products list!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}
