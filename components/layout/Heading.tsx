"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { allRoutes } from "@/config/constant";
import routes from "@/config/routes";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { allProducts } from "@/lib/product-data";
import { IProductPublic } from "@/lib/types";
import { cn } from "@/lib/utils";
import useUserProfile from "@/store/useUserProfile";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import LoginModal from "../features/auth/LoginModal";
import StarsComp from "../features/public/shared/Stars";
import ImageWithFallback from "../shared/ImageWithFallback";
import Toast from "../shared/Toast";
import { Container } from "../ui/container";
import { Separator } from "../ui/separator";
import { CartDrawer } from "./CartDrawer";
import NavbarLogo from "./NavbarLogo";
import { UserDropdown } from "./UserDropdown";
import { WishlistDrawer } from "./WishlistDrawer";
import { useWishlistStore } from "@/store/wishlist/wishlistStore";

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

interface SubCategory {
  name: string;
  url: string;
}

interface CategoryItem {
  name: string;
  url: string;
  subCategories?: SubCategory[];
}

interface HeaderProps {
  categories?: CategoryItem[];
  items?: any[];
}

export function Heading({ categories, items }: HeaderProps) {
  const { userData, clearUserData } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  // const [logoutOpen, setLogoutOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isVendorLoginModalOpen, setIsVendorLoginModalOpen] = useState(false);

  useOnClickOutside(searchRef as React.RefObject<HTMLElement>, () => setShowResults(false));
  useOnClickOutside(categoryRef as React.RefObject<HTMLElement>, () => setIsCategoryOpen(false));

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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
      setSearchQuery("");
      setShowResults(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
    setSearchQuery("");
    setShowResults(false);
    setIsMobileSearchOpen(false);
  };
  const handleLogout = async () => {
    await signOut({ redirect: true });
    Toast.success({ title: "Success", description: "Logout Successfully!" });
    clearUserData();
  };
  const searchParams = useSearchParams();
  const curPath = usePathname();
  const [loginCallbackUrl, setLoginCallbackUrl] = useState<string | null>(null);

  // Auto-open login modal when redirected from protected user routes
  useEffect(() => {
    if (searchParams.get("login") === "required") {
      const callback = searchParams.get("callbackUrl");
      setLoginCallbackUrl(callback);
      setIsLoginModalOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      url.searchParams.delete("callbackUrl");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router]);
  const handleCategorySelect = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("category") === name) {
      params.delete("category");
    } else {
      params.set("category", name);
      params.delete("subCategory");
    }
    params.set("page", "1");
    router.push(`${routes.publicRoutes.productList}?${params.toString()}`, { scroll: false });
  };

  const handleSubCategorySelect = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("subCategory") === name) {
      params.delete("subCategory");
    } else {
      params.set("subCategory", name);
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`${routes.publicRoutes.productList}?${params.toString()}`, { scroll: false });
  };
  const initWishlist = useWishlistStore((state) => state.init);
  useEffect(() => {
    console.log("Initializing wishlist...");
    initWishlist();
  }, [initWishlist]);
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FEFEFE]">
      <Container>
        <div className="relative flex max-w-full items-center justify-between gap-2 md:py-3">
          {/* Logo section */}
          <NavbarLogo
            onOpenVendorModal={setIsVendorLoginModalOpen}
            categories={categories || []}
            onCategorySelect={handleCategorySelect}
            onSubCategorySelect={handleSubCategorySelect}
          />

          {/* {!curPath.includes("product") && <SearchProduct />} */}

          {/* Right - Action buttons */}
          <div className="z-20 flex items-center gap-3 md:gap-6">
            {/* <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button> */}
            {userData && <WishlistDrawer />}

            <div
              className={cn(
                (curPath.startsWith(`${routes.publicRoutes.productList}/`) &&
                  !curPath.startsWith(`${routes.publicRoutes.productList}/offers`) &&
                  !curPath.startsWith(`${routes.publicRoutes.productList}/best-deals`)) ||
                  curPath.startsWith(`${routes.publicRoutes.comboOffer}/`)
                  ? // ||
                    // curPath.startsWith(`${routes.publicRoutes.checkout}`) ||
                    // curPath.startsWith(`${routes.publicRoutes.orderNow}`)
                    "max-md:-translate-x-1 max-md:translate-y-1"
                  : "max-md:hidden"
              )}
            >
              <CartDrawer />
            </div>
            {/* {!!userData ? (
              <div className="md:hidden">
                <button
                  className="text-destructive flex items-center gap-2 p-2 sm:hidden" // sm:hidden = mobile only
                  onClick={() => setLogoutOpen(true)}
                >
                  <LogOut className="h-6 w-6" />
                  <span>Logout</span>
                </button>
              </div>
            ) : null} */}
            <div className="hidden sm:block">
              {!!userData ? (
                <UserDropdown user={userData} />
              ) : (
                <Button onClick={() => setIsLoginModalOpen(true)} type="submit" variant={"black"}>
                  Login/Signup
                </Button>
              )}
            </div>

            {/* <div className="hidden sm:block">
              <LanguageSwitcher />
            </div> */}

            <LoginModal
              open={isLoginModalOpen}
              onOpenChange={(open) => {
                setIsLoginModalOpen(open);
                if (!open) setLoginCallbackUrl(null);
              }}
              callbackUrl={loginCallbackUrl}
            />
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 fixed inset-0 z-50 bg-white duration-300 md:hidden">
            <div className="flex items-center gap-2 border-b p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery("");
                  setShowResults(false);
                }}
              >
                <X className="h-5 w-5" />
              </Button>
              <form className="flex flex-1 items-center gap-2 rounded-lg border bg-white px-3" onSubmit={handleSearchSubmit}>
                <Search className="h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search for products..."
                  className="flex-1 border-0 bg-transparent text-base shadow-none ring-0 ring-offset-0 outline-none placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                  autoComplete="off"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Mobile Search Results */}
            <div className="h-[calc(100vh-73px)] overflow-auto p-4">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 rounded-lg border p-3 active:bg-gray-50"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
                        <p className="text-muted-foreground mt-1 text-xs">{product.category}</p>
                        <p className="mt-1 text-sm font-semibold">
                          ${product.discount ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery("");
                      setShowResults(false);
                      setIsMobileSearchOpen(false);
                    }}
                  >
                    View all results
                  </Button>
                </div>
              ) : searchQuery ? (
                <div className="py-8 text-center text-gray-500">
                  <p>No products found</p>
                  <p className="mt-1 text-sm">Try a different search term</p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Container>

      <Separator />

      <div className="shadow">
        <Container>
          {/* Desktop Navigation - All Category Dropdown */}
          <div className="relative hidden md:block">
            <div className="flex h-14 items-center">
              <div
                ref={categoryRef}
                className="relative"
                onMouseLeave={() => setHoveredCategory(null)} // <-- hide submenu when mouse leaves
              >
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`flex items-center justify-between gap-2 rounded px-4 py-3 text-sm lg:w-60 ${isCategoryOpen ? "font-semibold" : "font-medium"} transition-colors`}
                >
                  <span className="p-text-16"> All Category</span>
                  <ChevronDown className={cn("size-5 transition-transform", isCategoryOpen && "rotate-180")} />
                </button>

                {/* Category Dropdown Menu */}
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 z-50 mt-0 min-w-56">
                    <div className="flex">
                      {/* Main Categories List */}
                      <div className="w-56 divide-y overflow-hidden overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                        {categories?.map((category: any) => (
                          <div className="py-1" key={category._id}>
                            {category.subCategories && category.subCategories.length > 0 ? (
                              <button
                                onMouseEnter={() => setHoveredCategory(category.name)}
                                className="flex h-12 w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[#A7A8AA4D]"
                              >
                                <span className="text-sm capitalize md:text-base">{category.name}</span>
                                {/* <ChevronRight className="h-4 w-4 text-gray-400" /> */}

                                <ChevronDown
                                  className={cn(
                                    "size-5 transition-transform",
                                    hoveredCategory &&
                                      categories?.find((c) => c.name === hoveredCategory && c.subCategories?.length)?.subCategories &&
                                      "-rotate-90"
                                  )}
                                />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  handleCategorySelect(category.name);
                                  setIsCategoryOpen(false);
                                }}
                                className="block h-12 w-full border-b border-gray-100 px-4 py-3 text-left text-sm capitalize transition-colors last:border-b-0 hover:bg-[#A7A8AA4D] md:text-base"
                                onMouseEnter={() => setHoveredCategory(category.name)}
                              >
                                {category.name}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {hoveredCategory && categories?.find((c) => c.name === hoveredCategory && c.subCategories?.length)?.subCategories && (
                        <div className="grid w-sm grid-cols-2 gap-4 overflow-hidden rounded-lg border border-gray-200 bg-white px-5 py-3 lg:w-4xl 2xl:px-10 2xl:py-7">
                          <div className="py-2">
                            {categories
                              .find((c) => c.name === hoveredCategory)
                              ?.subCategories?.map((sub: any) => (
                                <div className="py-1" key={sub._id}>
                                  <button
                                    onClick={() => {
                                      handleSubCategorySelect(sub.name);
                                      setIsCategoryOpen(false);
                                    }}
                                    className="block w-full px-2 py-2 text-left text-sm font-medium text-black transition-colors hover:bg-[#A7A8AA4D] hover:text-gray-900 md:text-base"
                                  >
                                    {sub.name}
                                  </button>
                                </div>
                              ))}
                          </div>

                          <div className="space-y-5 max-lg:hidden">
                            {(items ?? []).slice(0, 3).map((product, index) => (
                              <NavCardV product={product} key={index} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                <Link
                  href={allRoutes.brands}
                  className={cn(
                    "hover:text-primary p-text-16 font-medium transition-colors",
                    curPath === allRoutes.brands && "text-primary font-bold"
                  )}
                >
                  Brands
                </Link>
                <Link
                  href={allRoutes.products}
                  className={cn(
                    "hover:text-primary p-text-16 font-medium transition-colors",
                    curPath === allRoutes.products && "text-primary font-bold"
                  )}
                >
                  Products
                </Link>
                <Link
                  href={allRoutes.comboOffer}
                  className={cn(
                    "hover:text-primary p-text-16 font-medium transition-colors",
                    curPath === allRoutes.comboOffer && "text-primary font-bold"
                  )}
                >
                  Combo Offer
                </Link>
                <Link
                  href={allRoutes.trackOrder}
                  className={cn(
                    "hover:text-primary p-text-16 font-medium transition-colors",
                    curPath === allRoutes.trackOrder && "text-primary font-bold"
                  )}
                >
                  Track Order
                </Link>
                <Link
                  href={allRoutes.contact}
                  className={cn(
                    "hover:text-primary p-text-16 font-medium transition-colors",
                    curPath === allRoutes.contact && "text-primary font-bold"
                  )}
                >
                  Contact
                </Link>
                {/* <Link href={allRoutes.becomeASeller} className="hover:text-primary p-text-16 font-medium transition-colors">
                  Become a Seller
                </Link>  */}
                {/* <Button
                  onClick={() => {
                    setIsVendorLoginModalOpen(true);
                  }}
                  className="hover:text-primary h-max! p-0! font-normal text-black capitalize transition-colors hover:no-underline"
                  variant={"link"}
                >
                  Become a Seller
                </Button> */}
                {/* <VendorAuthModal initialStep={"signup-form"} open={isVendorLoginModalOpen} onOpenChange={setIsVendorLoginModalOpen} /> */}
              </div>
            </div>
          </div>
        </Container>
        {/* <DeleteConfirmModal
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          onConfirm={() => handleLogout()}
          title="Logout"
          description="Are you sure you want to logout?"
          confirmText="Logout"
        /> */}
      </div>
    </header>
  );
}

export function NavCardV({ product }: { product: IProductPublic }) {
  return (
    <Card className="relative overflow-hidden border-0 bg-transparent py-2 shadow-none transition-shadow">
      <div className="flex h-full max-md:flex-col">
        {/* Left Side - Image */}
        <div className="bg-dark-gray relative aspect-50/50 min-h-20 overflow-hidden rounded-lg max-md:max-h-15">
          <ImageWithFallback fallbackSrc="/images/auth/logo.png" src={product.thumbnail} alt={product.name} fill className="object-cover" />
        </div>

        {/* Right Side - Content */}
        <div className="relative flex flex-1 flex-col justify-between bg-white px-2.5">
          {product?.discountValue && product?.discountValue > 0 ? (
            <div className="absolute top-0 left-2 z-10">
              <div className="text-primary p-text-15 flex items-center gap-1.5 rounded-full bg-[#F4F4F4] px-3 py-1 font-semibold shadow">
                <div className="bg-primary size-2 rounded-full"></div>
                {product?.discountValue}
                {product?.discountType === "percentage" ? " %" : " BDT"} off
              </div>
            </div>
          ) : null}
          {/* <div className="text-destructive flex w-max items-center gap-2 rounded-full bg-[#F4F4F4] px-4 uppercase">
            <div className="bg-destructive size-2 rounded-full"></div> {product.} off
          </div> */}
          <Link href={`${allRoutes.products}/${product?.slug}`} className="mt-8 h-full">
            <h3 className="text-sm leading-5 font-semibold hover:underline md:text-base">{product.name}</h3>
          </Link>
          <span className="p-text-14 text-dark-gray flex items-center gap-1">
            <StarsComp rating={Number(product.rating)} />
            {/* {product.rating} */}
            {/* <Star className="size-4! fill-current text-[#FDAB00]" /> */}
          </span>
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div className="mt-3 flex items-baseline gap-2">
              <span className="p-text-20 font-semibold">{product?.discountPrice?.toFixed(2) ?? product?.sellingPrice?.toFixed(2)}</span>
              <span className="p-text-16 leading-5">BDT</span>
            </div>

            {product?.variants && product?.variants.length > 0 ? (
              <span className="p-text-16 text-light-gray line-through">
                {product?.variants[0]?.discountPrice && Number(product?.variants[0]?.discountPrice) > 0
                  ? product?.variants[0].discountPrice.toFixed(2)
                  : product?.variants[0].variantPrice.toFixed(2)}
                <span className="ml-0.5">BDT</span>
              </span>
            ) : product?.discountPrice && Number(product?.discountPrice) > 0 ? (
              <span className="p-text-16 text-light-gray line-through">
                {product?.discountPrice?.toFixed(2)}
                <span className="ml-0.5">BDT</span>
              </span>
            ) : (
              <span className="p-text-16 text-light-gray line-through">
                {product?.sellingPrice?.toFixed(2)}
                <span className="ml-0.5">BDT</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
