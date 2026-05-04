"use client";

import routes from "@/config/routes";
import { useSettings } from "@/provider/SettingsProvider";
import groovyWalkAnimation from "@/public/old-rider.json";
import useUserProfile from "@/store/useUserProfile";
import Lottie from "lottie-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { fetchAdminProfileData, userData, statusCode } = useUserProfile();
  const token = session?.user?.token;
  const settings = useSettings();
  const logoSrc = settings?.logo || "/images/auth/logo.png";

  useEffect(() => {
    const logout = async () => {
      await signOut({
        redirect: false,
      });

      push(routes.publicRoutes.home);
    };

    if (statusCode === 401) {
      logout();
    }
  }, [statusCode, push]);

  useEffect(() => {
    if (token && !userData) fetchAdminProfileData();
    if (userData) {
      setIsLoading(false);
      // new Promise((resolve) => setTimeout(resolve, 2000)).then(() => setIsLoading(false));
    }
  }, [fetchAdminProfileData, token, userData]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#1a1a1a_0%,#2d1616_25%,#4a1c1c_50%,#a31a23_75%,#1f1f1f_100%)]">
        <div className="relative flex flex-col items-center">
          <div className="flex items-center justify-center">
            <img src={logoSrc} alt="Logo" className="w-32 object-contain" />
          </div>
          <Lottie animationData={groovyWalkAnimation} loop={true} className="size-52" />
          <p className="text-lg font-semibold text-white">Please take a while...⏳</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
