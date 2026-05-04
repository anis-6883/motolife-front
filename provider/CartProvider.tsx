"use client";

import { useSession } from "next-auth/react";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  // const syncOnLogin = useCartStore((s) => s.syncOnLogin);

  // useEffect(() => {
  //   if (session?.user?.id) {
  //     syncOnLogin(session.user.id);
  //   }
  // }, [session?.user?.id]);
  return <>{children}</>;
}
