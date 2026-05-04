"use server";
import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getOrdersByVendorId(params: Record<string, string | number | undefined>, id: string) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && key !== "tab") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.userManagement.vendor.orders(id)}?${query.toString()}`, {
      method: "GET",
      tags: [`${cacheTags.orders}-${id}`],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get orders list of this vendor!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}

export async function getOrderById(id: string, vendorId?: string) {
  try {
    if (vendorId) {
      const res = await apiClient(apiRoutes.privateRoutes.admin.orderManagement.getOrderByVendorId(id, vendorId), {
        method: "GET",
        tags: [cacheTags.orders, id, vendorId],
      });
      return res;
    } else {
      const res = await apiClient(apiRoutes.privateRoutes.admin.orderManagement.getOrderById(id), {
        method: "GET",
        tags: [cacheTags.orders, id],
      });
      return res;
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get order details!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}

export async function updateOrderById(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.orderManagement.updateOrderById(id), {
      method: "PATCH",
      body: data,
    });

    if (res?.data) {
      updateTag(`${cacheTags.orders}-${id}-stats`);
      updateTag(cacheTags.orders);
      updateTag(`${cacheTags.orders}-${id}`);
      updateTag(cacheTags.inHouseProducts);
      updateTag(cacheTags.activityLog);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update order!",
      data: [],
    };
  }
}

export async function updateRefundById(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.orderManagement.updateRefundById(id), {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.orders);
      updateTag(`${cacheTags.refundRequests}-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update refund data!",
      data: [],
    };
  }
}

export async function getOrders(params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && key !== "tab") {
        query.append(key, String(value));
      }
    });

    const res = await apiClient(`${apiRoutes.privateRoutes.admin.orderManagement.getOrders}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.orders, query.toString()],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get orders list!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}

export async function getRefundRequests(params: Record<string, string | number | undefined>) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && key !== "tab") {
        query.append(key, String(value));
      }
    });
    const res = await apiClient(`${apiRoutes.privateRoutes.admin.orderManagement.getRefundRequests()}?${query.toString()}`, {
      method: "GET",
      tags: [cacheTags.refundRequests],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get refund requests list!",
      data: {
        docs: [],
        pagination: {
          totalDocs: 0,
        },
      },
    };
  }
}

export async function getRefundRequestById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.orderManagement.getRefundRequests(id), {
      method: "GET",
      tags: [`${cacheTags.refundRequests}-${id}`],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get refund request details!",
      data: [],
    };
  }
}

export async function refundAllById(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.orderManagement.refundAllById(id), {
      method: "PATCH",
      body: data,
    });

    if (res?.data?.status) {
      updateTag(cacheTags.refundRequests);
      updateTag(`${cacheTags.refundRequests}-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to refund all!",
      data: [],
    };
  }
}

export async function refundPartially(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.orderManagement.refundPartially(id), {
      method: "PATCH",
      body: data,
    });
    if (res?.data?.status || res?.data) {
      updateTag(cacheTags.refundRequests);
      updateTag(`${cacheTags.refundRequests}-${id}`);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to refund partially!",
      data: [],
    };
  }
}

export async function rejectRefundAllById(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.orderManagement.rejectRefundAllById(id), {
      method: "PATCH",
      body: data,
    });

    if (res?.data?.status || res?.data) {
      updateTag(cacheTags.refundRequests);
      updateTag(`${cacheTags.refundRequests}-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to reject refund all!",
      data: [],
    };
  }
}

export async function rejectRefundPartially(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.orderManagement.rejectRefundPartially(id), {
      method: "PATCH",
      body: data,
    });
    if (res?.data?.status || res?.data) {
      updateTag(cacheTags.refundRequests);
      updateTag(`${cacheTags.refundRequests}-${id}`);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to reject refund partially!",
      data: [],
    };
  }
}

export async function updateSpecialDiscount(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.orderManagement.specialDiscount(id), {
      method: "PATCH",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.orders);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update special discount!",
      data: [],
    };
  }
}

//!order stats
export async function getOrderStats() {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.orderManagement.getOrderStats, {
      method: "GET",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get order stats!",
      data: [],
    };
  }
}
