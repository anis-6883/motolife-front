"use server";

import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";

export async function handleSendOtp(data: { phone: string }) {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.customerSendOtp, {
      method: "POST",
      body: { phone: data.phone },
      cache: "no-store",
    });
    if (!res?.data) {
      return {
        status: false,
        error: res?.error || "Invalid credentials!",
      };
    }

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred!";
    return { status: false, error: errorMessage };
  }
}

export async function handleSendSignupOtp(data: { phone: string }) {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.customerSendSignupOtp, {
      method: "POST",
      body: { phone: data.phone },
      cache: "no-store",
    });

    if (!res?.data) {
      return {
        status: false,
        error: res?.error || "Invalid credentials!",
      };
    }

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred!";
    return { status: false, error: errorMessage };
  }
}

export async function verifyOtp(data: { phone: string; otp: string; sentOtp: string }) {
  try {
    const res = await apiClient(`${apiRoutes.publicRoutes.customerVerifyOtp}?moto_otp=${data.sentOtp}`, {
      method: "POST",
      body: { phone: data.phone, otp: data.otp },
      cache: "no-store",
    });

    if (!res?.data) {
      return {
        status: false,
        error: res?.error || "Invalid Otp!",
      };
    }

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred!";
    return { status: false, error: errorMessage };
  }
}

export async function verifySignupOtp(data: { phone?: string; otp: string; sentOtp?: string; fullName?: string; email?: string }) {
  try {
    const { sentOtp, ...rest } = data;
    const res = await apiClient(`${apiRoutes.publicRoutes.customerSignupVerifyOtp}?moto_otp=${sentOtp}`, {
      method: "POST",
      body: rest,
      cache: "no-store",
    });

    if (!res?.data) {
      return {
        status: false,
        error: res?.error || "Invalid Otp!",
      };
    }

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred!";
    return { status: false, error: errorMessage };
  }
}
