"use client";

import Toast from "@/components/shared/Toast";
import routes from "@/config/routes";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useHandleClientLogout() {
  const router = useRouter();

  const handleClientLogout = async (title?: string, message?: string) => {
    Toast.error({
      title: title ?? "Unauthorized",
      description: message ?? "Session expired!",
    });

    await signOut({ redirect: false });
    router.push(routes.publicRoutes.home);
  };

  return handleClientLogout;
}
