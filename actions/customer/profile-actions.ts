"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getCustomerProfile() {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.profile, {
      method: "GET",
      tags: [cacheTags.customerProfile],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get customer profile",
      data: [],
    };
  }
}

export const updateCustomerProfile = async (data: any) => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.update, {
      method: "PUT",
      body: data,
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.customerProfile);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update customer profile",
      data: null,
    };
  }
};

export const getCustomerAddress = async () => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.getAddress, {
      method: "GET",
      tags: [cacheTags.customerAddress],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get customer address",
      data: [],
    };
  }
};

export const addCustomerAddress = async (data: any) => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.addAddress, {
      method: "POST",
      body: data,
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.customerAddress);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to add customer address",
      data: null,
    };
  }
};

export const updateCustomerAddress = async (id: string, data: any) => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.updateAddress(id), {
      method: "PUT",
      body: data,
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.customerAddress);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update customer address",
      data: null,
    };
  }
};

export const deleteCustomerAddress = async (id: string) => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.deleteAddress(id), {
      method: "DELETE",
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.customerAddress);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete customer address",
      data: null,
    };
  }
};

export const getCustomerPaymentMethods = async () => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.getPaymentMethods, {
      method: "GET",
      tags: [cacheTags.customerPaymentMethods],
    });

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get customer payment methods",
      data: [],
    };
  }
};

export const addCustomerPaymentMethod = async (data: any) => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.addPaymentMethod, {
      method: "POST",
      body: data,
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.customerPaymentMethods);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to add customer payment method",
      data: null,
    };
  }
};

export const updateCustomerPaymentMethod = async (id: string, data: any) => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.updatePaymentMethod(id), {
      method: "PUT",
      body: data,
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.customerPaymentMethods);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update customer payment method",
      data: null,
    };
  }
};

export const deleteCustomerPaymentMethod = async (id: string) => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.deletePaymentMethod(id), {
      method: "DELETE",
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.customerPaymentMethods);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete customer payment method",
      data: null,
    };
  }
};

export const setDefaultCustomerPaymentMethod = async (id: string) => {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.setDefaultPaymentMethod(id), {
      method: "PUT",
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.customerPaymentMethods);
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to set default customer payment method",
      data: null,
    };
  }
};

export async function sendPhoneChangeOtp(data: { phone: string }) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.customer.account.sendPhoneChangeOtp, {
      method: "POST",
      body: { phone: data.phone },
      cache: "no-store",
    });

    if (!res?.data) {
      return {
        status: false,
        error: res?.error || "Send otp failed!",
      };
    }

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred!";
    return { status: false, error: errorMessage };
  }
}

export async function verifyPhoneChangeOtp(data: { phone: string; otp: string; sentOtp: string }) {
  try {
    const res = await apiClient(`${apiRoutes.privateRoutes.customer.account.verifyPhoneChangeOtp}?moto_otp=${data.sentOtp}`, {
      method: "POST",
      body: { phone: data.phone, otp: data.otp },
      cache: "no-store",
    });

    if (!res?.data) {
      return {
        status: false,
        error: res?.error || "Verify otp failed!",
      };
    }

    if (res?.data) {
      updateTag(cacheTags.customerProfile);
    }

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred!";
    return { status: false, error: errorMessage };
  }
}
