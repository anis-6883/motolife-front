"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFirstPermittedRoute } from "@/lib/permission-helper";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleRedirect = () => {
    const permissions = (session?.user as any)?.permissions ?? [];
    const firstRoute = getFirstPermittedRoute(permissions);

    router.push(firstRoute);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <ShieldX className="h-8 w-8 text-red-500" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>

      <p className="max-w-sm text-sm text-gray-500">You don't have permission to access this page. Please contact your administrator.</p>

      <Button onClick={handleRedirect} variant="black" className="rounded-full px-6">
        Go to Your Dashboard
      </Button>
    </div>
  );
}
