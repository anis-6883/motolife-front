"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { getYouTubeVideoId } from "@/lib/utils";
import { updateTag } from "next/cache";

export async function getProductById(id: string) {
  try {
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.productManagement.product.getById(id)}`, {
      method: "GET",
      tags: [cacheTags.products, cacheTags.inHouseProducts],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get product!",
      data: [],
    };
  }
}

export async function updateProduct(productId: string, data: any) {
  try {
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.productManagement.product.update(productId)}`, {
      method: "PATCH",
      tags: [cacheTags.products, cacheTags.inHouseProducts],
      body: data,
    });
    if (res.data) {
      updateTag(cacheTags.products);
      updateTag(cacheTags.inHouseProducts);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update product!",
      data: [],
    };
  }
}

export async function getYoutubeVideoTitle(videoUrl: string) {
  try {
    const videoId = getYouTubeVideoId(videoUrl);

    if (!videoId) {
      throw new Error("Invalid YouTube URL: video ID not found");
    }
    const url = apiRoutes.privateRoutes.others.youtubeTitle(videoId);
    console.log(url);
    const res = await apiClient(url, {
      method: "GET",
    });

    // const data = await res.json();
    const title = res.data?.data || "Video title not found";

    if (!title) {
      return {
        ok: false,
        message: "Unable to fetch video title. Please check the link and try again.",
        data: {},
      };
    }

    return {
      status: true,
      message: "Video title retrieved successfully!",
      data: { title },
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to fetch video title. Please check the link and try again.",
      data: {},
    };
  }
}
