"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { allProducts } from "@/lib/product-data";
import { cn } from "@/lib/utils";
import { useSettings } from "@/provider/SettingsProvider";
import useUserProfile from "@/store/useUserProfile";
import { Loader2, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import LoginModal from "../features/auth/LoginModal";
import { Icons } from "../icons";
import { CartDrawer } from "./CartDrawer";
import { menuItems, userObj } from "./sampleData";
import { UserDropdown } from "./UserDropdown";
import { WishlistDrawer } from "./WishlistDrawer";
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function UserHeading() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { userData, clearUserData } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const settings = useSettings();
  const logoSrc = settings?.logo || "/images/auth/logo.png";

  // Close search results when clicking outside
  useOnClickOutside(searchRef as React.RefObject<HTMLElement>, () => setShowResults(false));

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter products based on search query
  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        const filtered = allProducts.filter((product) => product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
        setSearchResults(filtered.slice(0, 5));
        setIsSearching(false);
        setShowResults(true);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [debouncedSearchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setShowResults(false);
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setShowResults(false);
  };
  const isLoggedIn = true;

  return (
    <header className="bg-background sticky top-0 z-40 w-full">
      <div className="mx-auto border-b-2 border-black px-4 md:px-8 xl:w-full 2xl:px-0">
        <div className="relative flex max-w-full items-center justify-between py-2 xl:px-10">
          {/* Logo section */}
          <div className="z-20 flex items-center max-md:gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-75 overflow-y-auto sm:w-100">
                <SheetHeader className="mb-3 border-b">
                  <SheetTitle className="">
                    <div className="mb-6 flex items-center">
                      <div className="relative aspect-square size-10">
                        <Image src={logoSrc} fill alt="Logo" className="object-contain" />
                      </div>
                    </div>
                  </SheetTitle>
                  <div className="flex min-w-0 flex-1 items-center gap-3 pb-3">
                    <div className="relative aspect-square size-20 overflow-hidden rounded-full">
                      <Image src={userObj.imgURL} fill alt={userObj.name} />
                    </div>
                    <Link href={"/profile"} className="min-w-0 flex-1">
                      <h3 className="p-text-20 truncate font-medium capitalize">{userObj.name}</h3>
                      <p className="text-muted-foreground truncate text-xs">{userObj.email}</p>
                    </Link>
                  </div>
                </SheetHeader>

                <nav className="flex flex-col gap-2">
                  <div className="flex-1 overflow-y-auto">
                    <div className=" ">
                      <p className="p-text-12 px-2.5 py-1 text-[#777] uppercase">My Items</p>

                      <nav className="space-y-2">
                        {menuItems.map((item, index) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.id;

                          return (
                            <Link key={index} href={item.id}>
                              <button
                                className={`p-text-16 flex w-full items-center gap-3 rounded-md px-2.5 py-5 transition-colors ${
                                  isActive ? "bg-primary/5 text-primary font-medium" : "text-foreground hover:bg-secondary"
                                }`}
                                title={item.label}
                              >
                                <Icon className="size-6! shrink-0" />
                                <span>{item.label}</span>
                              </button>
                            </Link>
                          );
                        })}
                      </nav>
                    </div>

                    {/* Settings Section */}
                    <div>
                      <p className="p-text-12 px-2.5 py-1 text-[#777] uppercase">Settings</p>

                      <nav className="space-y-2">
                        <Link
                          href="/settings"
                          className={`p-text-16 hover:bg-secondary flex w-full items-center gap-3 rounded-md px-2.5 py-5 transition-colors`}
                          title={"Account Settings"}
                        >
                          <Icons.settings className="size-6! shrink-0" />
                          <span>Account Settings</span>
                        </Link>
                        <button
                          className={`p-text-16 text-destructive flex w-full items-center gap-3 rounded-md px-2.5 py-5 transition-colors hover:bg-red-50`}
                          title={"Logout"}
                        >
                          <LogOut className="size-6! shrink-0" />
                          <span>Logout</span>
                        </button>
                      </nav>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center">
              <div className="relative aspect-square size-10 md:size-14 lg:size-12">
                <Image src={logoSrc} fill alt="Logo" className="object-contain" />
              </div>
            </Link>
          </div>

          {/* Action buttons */}
          <div className="z-20 flex flex-1 items-center justify-end gap-2 md:relative">
            <div className="md:relative">
              {isSearchOpen ? (
                <form
                  className="animate-in fade-in max-md:slide-in-from-top-2 md:slide-in-from-right-2 flex w-full max-w-2xl items-center duration-300 max-md:absolute max-md:top-15 max-md:left-0 max-md:rounded-lg max-md:border max-md:bg-white max-md:p-2 max-md:shadow-md md:relative"
                  onSubmit={handleSearchSubmit}
                >
                  <Input
                    type="search"
                    name="search"
                    placeholder="Search product..."
                    className="text-md:flex-1 relative z-50 w-[90vw] text-sm max-md:h-8 md:w-60 lg:w-lg 2xl:w-xl"
                    autoFocus
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        setShowResults(false);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                    type="button"
                    className="bg-destructive absolute -top-1.5 -right-1.5 z-50 rounded-full text-white md:hidden"
                  >
                    <X className="size-4" />
                  </button>
                  <Button
                    type="button"
                    variant="link"
                    size="icon"
                    className="right-0 z-50 max-md:hidden md:absolute"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  {isSearchOpen ? <X className="h-5 w-5" /> : <Icons.search className="size-7!" />}
                  <span className="sr-only">{isSearchOpen ? "Close search" : "Search"}</span>
                </Button>
              )}
              {/* Search bar - centered and full width when open */}
              <div
                className={cn(
                  "absolute top-32 right-0 left-0 z-30 transition-all duration-200 md:top-10 md:left-auto xl:top-12",
                  isSearchOpen ? "h-auto py-2 opacity-100" : "pointer-events-none h-0 overflow-hidden opacity-0"
                )}
              >
                <div ref={searchRef} className="flex w-full justify-end pr-2 md:px-4" style={{ width: "calc(100% - 140px)" }}>
                  {/* Search Results Dropdown */}
                  {showResults && (searchResults.length > 0 || isSearching) && (
                    <Card className="absolute -top-6 right-0 left-0 z-50 mt-1 max-h-100 overflow-auto p-2 md:top-0 md:left-auto md:w-60 lg:w-lg 2xl:w-xl">
                      {isSearching ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          <span>Searching...</span>
                        </div>
                      ) : (
                        <>
                          {searchResults.map((product) => (
                            <div
                              key={product.id}
                              className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-md p-2"
                              onClick={() => handleProductClick(product.id)}
                            >
                              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{product.name}</p>
                                <p className="text-muted-foreground text-xs">{product.category}</p>
                              </div>
                              <div className="text-sm font-medium">
                                ${product.discount ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price.toFixed(2)}
                              </div>
                            </div>
                          ))}
                          <div className="mt-2 border-t pt-2 text-center">
                            <Button
                              variant="link"
                              className="text-xs"
                              onClick={() => {
                                router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
                                setIsSearchOpen(false);
                                setSearchQuery("");
                                setShowResults(false);
                              }}
                            >
                              View all results
                            </Button>
                          </div>
                        </>
                      )}
                    </Card>
                  )}
                </div>
              </div>
            </div>
            <WishlistDrawer />

            <CartDrawer />
            {isLoggedIn ? (
              <UserDropdown user={userData} />
            ) : (
              <Button
                onClick={() => setIsLoginModalOpen(true)}
                type="submit"
                className="border-primary/80 text-primary hover:bg-primary/80 border bg-transparent px-2 py-5 text-sm transition-colors hover:text-white md:px-8"
              >
                LOGIN
              </Button>
            )}

            <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
          </div>
        </div>
      </div>
    </header>
  );
}
