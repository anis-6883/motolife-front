"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";

export async function getProductCategoriesList(isActive: boolean = false) {
  const url = isActive
    ? `${apiRoutes.privateRoutes.admin.productManagement.productCategory.get}?status=true`
    : `${apiRoutes.privateRoutes.admin.productManagement.productCategory.get}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [isActive ? cacheTags.activeProductCategories : cacheTags.productCategories],
      cache: "force-cache",
    });
    if (res?.statusCode === 200) {
      return {
        ok: true,
        message: "list fetched successfully",
        data:
          res?.data?.data?.map((item: any) => ({
            label: item?.name,
            image: item?.image,
            value: item?._id,
          })) || [],
      };
    } else {
      throw new Error(res?.error ?? "Failed to load categories");
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get category list!",
      data: [],
    };
  }
}
export async function getStoreList(params: GetFilters) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });
  const url = `${apiRoutes.privateRoutes.dropdownList.store}?${query.toString()}`;
  try {
    const res = await apiClient(url, {
      method: "GET",
      cache: "no-store",
    });
    if (res?.statusCode === 200) {
      return {
        ok: true,
        message: "list fetched successfully",
        data: {
          docs:
            res?.data?.data?.docs?.map((item: any) => ({
              label: item?.store?.storeName,
              image: item?.store?.logoImage,
              value: item?._id,
            })) || [],
          pagination: res?.data?.data?.pagination,
        },
      };
    } else {
      throw new Error(res?.error ?? "Failed to load categories");
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get category list!",
      data: [],
    };
  }
}
export async function getProductList(params: GetFilters) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });
  const url = `${apiRoutes.privateRoutes.dropdownList.products}?${query.toString()}`;
  try {
    const res = await apiClient(url, {
      method: "GET",
      cache: "no-store",
    });
    if (res?.statusCode === 200) {
      return {
        ok: true,
        message: "list fetched successfully",
        data: {
          docs:
            res?.data?.data?.docs?.map((item: any) => ({
              _id: item?._id,
              label: item?.name,
              image: item?.thumbnail,
              value: item?._id,
              sellingPrice: item?.sellingPrice,
              isOffer: item?.isOffer,
            })) || [],
          pagination: res?.data?.data?.pagination,
        },
      };
    } else {
      throw new Error(res?.error ?? "Failed to load categories");
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get category list!",
      data: [],
    };
  }
}
export async function getComboOfferList(params: GetFilters) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });
  const url = `${apiRoutes.privateRoutes.dropdownList.comboOffers}?${query.toString()}`;
  try {
    const res = await apiClient(url, {
      method: "GET",
      cache: "no-store",
    });
    if (res?.statusCode === 200) {
      return {
        ok: true,
        message: "list fetched successfully",
        data: {
          docs:
            res?.data?.data?.docs?.map((item: any) => ({
              label: item?.name,
              image: item?.thumbnail,
              value: item?._id,
            })) || [],
          pagination: res?.data?.data?.pagination,
        },
      };
    } else {
      throw new Error(res?.error ?? "Failed to load categories");
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get category list!",
      data: [],
    };
  }
}
