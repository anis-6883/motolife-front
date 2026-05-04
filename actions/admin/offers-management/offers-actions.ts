"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getOffersList(params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });

    console.log(`url ${apiRoutes.privateRoutes.admin.offersManagement.offersList.get}?${query.toString()}`);
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.offersManagement.offersList.get}?${query.toString()}`, {
      method: "GET",
      //   tags: [cacheTags.offers],
      cache: "no-store",
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get offers list!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
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

export async function getVendorById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.userManagement.vendor.getById(id), {
      method: "GET",
      tags: [cacheTags.vendors, `vendor-${id}`],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get vendor!",
      data: [],
    };
  }
}

export async function createSalesOffer(data: any) {
  try {
    const res: any = await apiClient(apiRoutes.privateRoutes.admin.offersManagement.offersList.create, {
      method: "POST",
      body: data,
    });

    // Check if response contains error indicators
    if (!res || res.error || res.statusCode >= 400 || res.success === false) {
      return {
        ok: false,
        message: res?.message || res?.error || "Failed to create offer!",
        data: [],
      };
    }

    // Success case
    if (res?.data) {
      updateTag(cacheTags.offers);
      updateTag(cacheTags.flashSaleProducts);
    }

    return {
      ok: true,
      ...res,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create vendor!",
      data: [],
    };
  }
}
export async function createOfferProduct(data: any, id: string) {
  const url = apiRoutes.privateRoutes.admin.offersManagement.offersList.createProduct(id);
  try {
    const res: any = await apiClient(url, {
      method: "PATCH",
      body: data,
    });

    if (!res || res.error || res.statusCode >= 400 || res.success === false) {
      return {
        ok: false,
        message: res?.message || res?.error || "Failed to create offer!",
        data: [],
      };
    }

    // Success case
    if (res?.data) {
      updateTag(cacheTags.offersById);
      updateTag(cacheTags.flashSaleProducts);
    }

    return {
      ok: true,
      ...res,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create vendor!",
      data: [],
    };
  }
}

export async function updateOffers(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.offersManagement.offersList.update(id), {
      method: "PATCH",
      body: data,
    });
    if (res?.data) {
      updateTag(cacheTags.offers);
      updateTag(cacheTags.flashSaleProducts);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update Offers!",
      data: [],
    };
  }
}

export async function deleteOffers(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid Offer ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.offersManagement.offersList.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.offers);
      updateTag(cacheTags.flashSaleProducts);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete offers!",
      data: [],
    };
  }
}
export async function removeProductFromOffer(OfferId: string, productId: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.offersManagement.offersList.removeProduct(OfferId, productId), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.offersById);
      updateTag(cacheTags.flashSaleProducts);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete product!",
      data: [],
    };
  }
}
