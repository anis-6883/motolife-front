import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";

export async function getAllOffersByResource(slug: string, params: GetFilters = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });
  const url = `${apiRoutes.publicRoutes.getAllOffers(slug)}&${query.toString()}`;
  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.products, cacheTags.offersResourceProduct],
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
