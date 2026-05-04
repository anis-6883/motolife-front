"use client";

import { useCartStore } from "@/store/cart/cartStore";
import useUserProfile from "@/store/useUserProfile";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function CustomerProfileProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { fetchCustomerProfileData, userData } = useUserProfile();
  const syncOnLogin = useCartStore((s) => s.syncOnLogin);
  const token = session?.user?.token;
  useEffect(() => {
    if (token && !userData) fetchCustomerProfileData();
  }, [fetchCustomerProfileData, token, userData]);

  useEffect(() => {
    if (userData?._id) syncOnLogin(userData._id);
  }, [userData]);

  return <>{children}</>;
}
