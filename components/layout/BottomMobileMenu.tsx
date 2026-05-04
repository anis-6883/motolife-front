"use client";

import { allRoutes } from "@/config/constant";
import routes from "@/config/routes";
import { cn } from "@/lib/utils";
import useUserProfile from "@/store/useUserProfile";
import { Grid3x3, Home, Package, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import LoginModal from "../features/auth/LoginModal";
import { CartDrawer } from "./CartDrawer";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function BottomMobileMenu() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("home");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { userData } = useUserProfile();

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: "brands",
        label: "Brands",
        href: routes.publicRoutes.brands,
        icon: <Grid3x3 size={20} />,
      },
      {
        id: "products",
        label: "Products",
        href: routes.publicRoutes.productList,
        icon: <Package size={20} />,
      },
      {
        id: "home",
        label: "Home",
        href: routes.publicRoutes.home,
        icon: <Home size={20} />,
      },
      {
        id: "cart",
        label: "Cart",
        href: routes.publicRoutes.cart,
        icon: <ShoppingCart size={20} />,
      },
      {
        id: "profile",
        label: "Profile",
        href: routes.privateRoutes.user.profile,
        icon: <User size={20} />,
      },
    ],
    []
  );

  // ✅ Sync active item with route
  useEffect(() => {
    if (!pathname) return;

    // Handle home separately
    if (pathname === "/") {
      setActiveItem("home");
      return;
    }

    const matched = menuItems.find(
      (item) =>
        item.href !== "/" &&
        (pathname.startsWith(item.href) ||
          (item.id === "cart" && (pathname.includes("/cart") || pathname.includes("/checkout"))) ||
          (item.id === "products" && pathname.startsWith(allRoutes.products)))
    );

    if (matched) {
      setActiveItem(matched.id);
    }
  }, [pathname, menuItems]);

  const activeIndex = menuItems.findIndex((item) => item.id === activeItem);
  const itemWidth = 100 / menuItems.length;
  const notchPosition = activeIndex * itemWidth + itemWidth / 2;

  return (
    <div
      className={cn(
        "pointer-events-none fixed right-0 bottom-0 left-0 z-20 flex items-end justify-center px-4 lg:hidden",
        (pathname.startsWith(`${routes.publicRoutes.productList}/`) &&
          !pathname.startsWith(`${routes.publicRoutes.productList}/offers`) &&
          !pathname.startsWith(`${routes.publicRoutes.productList}/best-deals`)) ||
          pathname.startsWith(`${routes.publicRoutes.comboOffer}/`) ||
          pathname.startsWith(`${routes.publicRoutes.checkout}`) ||
          pathname.startsWith(`${routes.publicRoutes.orderNow}`) ||
          pathname.startsWith(`${routes.publicRoutes.cart}`)
          ? "hidden"
          : ""
      )}
    >
      <div className="pointer-events-auto relative w-full">
        {/* Floating Active Button */}
        <div
          className="absolute -top-3 z-20 transition-all duration-500 ease-out"
          style={{
            left: `calc(${notchPosition}% - 32px)`,
          }}
        >
          <div className="bg-primary flex size-12 items-center justify-center rounded-full shadow-2xl ring-4 ring-white transition-all duration-300">
            <div className="scale-110 text-white">{menuItems[activeIndex]?.icon}</div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="relative rounded-full border border-gray-200 bg-white shadow-xl">
          <div className="relative z-10 flex h-10">
            {menuItems.map((item) => (
              <Fragment key={item.id}>
                {/* CART */}
                {item.id === "cart" ? (
                  pathname === routes.publicRoutes.checkout ? (
                    <Link
                      href={item.href}
                      onClick={() => setActiveItem(item.id)}
                      className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-all duration-300 ${
                        activeItem === item.id ? "text-primary -translate-y-8 opacity-0" : "hover:text-primary text-gray-600"
                      }`}
                    >
                      <div className="flex size-5 items-center justify-center">{item.icon}</div>
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <div
                      className={`flex flex-1 flex-col items-center justify-center transition-all duration-300 ${
                        activeItem === item.id ? "text-primary -translate-y-8 opacity-0" : "hover:text-primary text-gray-600"
                      }`}
                    >
                      <CartDrawer isOnNav={false} />
                      <span className="-translate-y-0.5 text-[10px] font-medium">{item.label}</span>
                    </div>
                  )
                ) : /* PROFILE */
                item.id === "profile" ? (
                  userData ? (
                    // <div
                    //   className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-all duration-300 ${
                    //     activeItem === item.id ? "text-primary -translate-y-8 opacity-0" : "hover:text-primary text-gray-600"
                    //   }`}
                    // >
                    //   <UserSidebarTriggerBtn />
                    // </div>
                    <Link
                      href={item.href}
                      onClick={() => setActiveItem(item.id)}
                      className={`flex flex-1 flex-col items-center justify-center transition-all duration-300 ${
                        activeItem === item.id ? "text-primary -translate-y-8 opacity-0" : "hover:text-primary text-gray-600"
                      }`}
                    >
                      <div className="flex size-4 items-center justify-center">{item.icon}</div>
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-all duration-300 ${
                        activeItem === item.id ? "text-primary -translate-y-8 opacity-0" : "hover:text-primary text-gray-600"
                      }`}
                    >
                      <div className="flex size-4 items-center justify-center">{item.icon}</div>
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                  )
                ) : (
                  /* DEFAULT */
                  <Link
                    href={item.href}
                    onClick={() => setActiveItem(item.id)}
                    className={`flex flex-1 flex-col items-center justify-center transition-all duration-300 ${
                      activeItem === item.id ? "text-primary -translate-y-8 opacity-0" : "hover:text-primary text-gray-600"
                    }`}
                  >
                    <div className="flex size-4 items-center justify-center">{item.icon}</div>
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </Link>
                )}
              </Fragment>
            ))}
          </div>
        </nav>
      </div>

      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </div>
  );
}
