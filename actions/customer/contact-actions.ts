"use server";

import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";

export async function sendContactMessage(data: any) {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.contact}`, {
      method: "POST",
      body: data,
    });
    return res;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to send message!",
      statusCode: 500,
    };
  }
}
