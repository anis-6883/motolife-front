"use client";

import type React from "react";

import { Icons } from "@/components/icons";
import { AutoMovingText } from "@/components/shared/AutoMovingText";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { allRoutes } from "@/config/constant";
import { IProductPublic } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CartItem } from "@/store/cart/Cart-types";
import { useCartStore } from "@/store/cart/cartStore";
import useUserProfile from "@/store/useUserProfile";
import { useWishlistStore } from "@/store/wishlist/wishlistStore";
import { BadgeCheck, Eye, Heart, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { RequestRestockModal } from "../product-detail/RequestRestockModal";
import { ProductQuickView } from "./QuickViewModal";

type ProductCardProps = {
  product: IProductPublic;
  isComboProduct?: boolean;
  className?: string;
  MobileGridVal?: number;
};

export function ProductCardVertical({ product, isComboProduct = false, className, MobileGridVal = 2 }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // const toggle = useWishlistStore((state) => state.toggle);
  // const toggle = useWishlistStore((state) => state.toggle);
  const [isViewHovered, setIsViewHovered] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);
  const [itemToRestock, setItemToRestock] = useState<CartItem | null>(null);
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);
  const firstVariant = product?.variants?.[0];
  const price = firstVariant?.discountPrice
    ? firstVariant.discountPrice
    : (firstVariant?.variantPrice ?? (product?.discountPrice ? product?.discountPrice : product?.sellingPrice));

  // const variantSku = firstVariant?.sku ?? product?.sku ?? "";
  const hasVariants = product?.variants && product.variants.length > 0;

  const variantSku = hasVariants ? (firstVariant?.sku ?? "") : "";

  const attributes =
    firstVariant?.attributes?.map((attr) => ({
      name: attr.name,
      value: attr.value,
    })) ?? [];
  const buildCartItem = (): CartItem => ({
    productId: product._id,
    variantSku,
    thumbnail: product?.thumbnail ?? "",
    variation: attributes.map((a) => a.value).join(" / "),
    attributes,
    isCombo: isComboProduct ?? false,
    quantity: 1,
    sellingPrice: Number(price),
    name: product.name,
    ...(product?.discountPrice && { hasDiscount: true }),
  });
  const { userData, clearUserData } = useUserProfile();
  const { addToOrderNow } = useCartStore();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem: CartItem = {
      productId: product._id,
      variantSku,
      thumbnail: product?.thumbnail ?? "",
      variation: attributes.map((a) => a.value).join(" / "),
      attributes,
      isCombo: isComboProduct,
      quantity: 1,
      sellingPrice: Number(price),
      name: product.name,
    };

    addToOrderNow(cartItem);
    router.push(allRoutes.orderNow);
  };
  const stock = product?.variants?.length
    ? product.variants.reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0)
    : (product?.stockQuantity ?? 0);

  const toggle = useWishlistStore((state) => state.toggle);
  const wishlisted = useWishlistStore((state) => state.isWishlisted(product._id));
  const wishlistLoading = useWishlistStore((state) => state.isLoading(product._id));

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlistLoading) return;
    const wasWishlisted = wishlisted;

    await toggle(product._id, isComboProduct);

    toast.success(wasWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };
  let prodPrice: number | undefined;
  let prodLineThroughPrice: number | undefined;
  let discountValue: number | undefined;
  if (product?.variants?.length) {
    const variant = product.variants[0];
    prodPrice = variant?.discountPrice ? variant.discountPrice : variant?.variantPrice;
    prodLineThroughPrice = variant?.discountPrice ? variant.variantPrice : undefined;
    discountValue = variant?.discountValue;
  } else if (product?.discountValue && product?.discountValue > 0 && product?.discountPrice && product.discountPrice > 0) {
    prodPrice = product.discountPrice;
    prodLineThroughPrice = product?.sellingPrice;
    discountValue = product?.discountValue;
  } else {
    prodPrice = product?.sellingPrice;
  }
  return (
    <>
      <Link href={`${isComboProduct ? allRoutes.comboOffer : allRoutes.products}/${product?.slug}`} className={`h-full ${className}`}>
        <Card
          className={cn(
            "group relative h-full max-w-full cursor-pointer gap-0 overflow-hidden border bg-white py-0 shadow-none transition-all duration-300 max-md:justify-evenly"
            // stock === 0 && "opacity-50"
          )}
        >
          <div
            className={cn(
              "relative overflow-hidden bg-gray-100 transition-all duration-300",
              MobileGridVal === 2 ? "h-30 md:h-70" : "h-20 md:h-70"
            )}
          >
            {/* Badge */}
            {product && discountValue && discountValue > 0 ? (
              <div className="absolute top-1 left-1 z-10 md:top-4 md:left-4">
                <div className="text-primary md:p-text-15 flex items-center gap-1.5 rounded-full bg-[#F4F4F4] px-3 py-1 font-semibold shadow max-md:text-xs">
                  <div className="bg-primary size-2 rounded-full"></div>
                  {discountValue}
                  {product?.discountType === "percentage" ? " %" : " ৳"} off
                </div>
              </div>
            ) : null}

            {/* Main Image */}
            <ImageWithFallback
              fallbackSrc="/images/placeholders/product.png"
              src={product?.thumbnail}
              alt={product?.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-125"
            />

            <div className="absolute top-1 right-6 z-20 flex translate-x-5 flex-col items-end gap-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:top-4 md:right-8 lg:right-4 lg:opacity-0">
              {userData && (
                <div className="relative" onMouseEnter={() => setIsWishlistHovered(true)} onMouseLeave={() => setIsWishlistHovered(false)}>
                  <Button
                    variant="secondary"
                    disabled={wishlistLoading}
                    className={`hover:border-primary h-10 border border-black bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white ${
                      isWishlistHovered ? "w-auto pr-4 pl-3" : "w-10 px-0"
                    }`}
                    onClick={handleWishlist}
                  >
                    {isWishlistHovered && (
                      <span className="ml-2 text-sm font-medium whitespace-nowrap max-lg:hidden">
                        {wishlisted ? "Unfavourite" : "Favourite"}
                      </span>
                    )}
                    {wishlistLoading ? (
                      <Icons.spinner className="size-5 animate-spin" />
                    ) : wishlisted ? (
                      <Heart className="size-5 fill-current text-red-500" />
                    ) : (
                      <Heart className="size-5" />
                    )}
                  </Button>
                </div>
              )}
              <div
                className="relative max-lg:hidden"
                onMouseEnter={() => setIsViewHovered(true)}
                onMouseLeave={() => setIsViewHovered(false)}
              >
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true);
                  }}
                  variant="secondary"
                  className={`hover:border-primary h-10 overflow-hidden border border-black bg-white text-black shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:text-white ${
                    isViewHovered ? "w-[140px] pr-4 pl-3" : "w-10 px-0"
                  }`}
                >
                  {isViewHovered && (
                    <span
                      className={`ml-2 transform text-sm font-medium whitespace-nowrap uppercase transition-all duration-300 max-lg:hidden ${
                        isViewHovered ? "translate-x-0 opacity-100" : "hidden -translate-x-2 opacity-0"
                      }`}
                    >
                      Quick View
                    </span>
                  )}
                  <Eye className="size-4!" />
                </Button>
              </div>
            </div>

            {/* Action Buttons - Show on Hover */}

            {product.isUpcoming ? (
              <div className="absolute right-0 -bottom-px left-0 transition-all duration-300 max-md:hidden lg:translate-y-full lg:opacity-0 group-hover:lg:translate-y-0 group-hover:lg:opacity-100">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="bg-primary hover:bg-primary border-primary h-7 w-full rounded-none font-semibold text-white"
                >
                  Upcoming
                </Button>
              </div>
            ) : stock > 0 ? (
              <div className="absolute right-0 -bottom-px left-0 transition-all duration-300 max-md:hidden lg:translate-y-full lg:opacity-0 group-hover:lg:translate-y-0 group-hover:lg:opacity-100">
                <Button
                  className="bg-primary hover:bg-primary border-primary h-7 w-full rounded-none font-semibold text-white"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   e.stopPropagation();
                  //   handleAddToCart(e);
                  // }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true);
                  }}
                >
                  Order now
                </Button>
              </div>
            ) : (
              <div className="absolute right-0 -bottom-px left-0 transition-all duration-300 max-md:hidden lg:translate-y-full lg:opacity-0 group-hover:lg:translate-y-0 group-hover:lg:opacity-100">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRestockOpen(true);
                    setItemToRestock(buildCartItem());
                  }}
                  className="bg-primary hover:bg-primary border-primary h-7 w-full rounded-none font-semibold text-white"
                >
                  Request Restock
                </Button>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="relative flex min-h-10 flex-col justify-between bg-white p-2.5 transition-all duration-300 md:min-h-25 md:space-y-1.5 md:p-4 md:pb-0">
            {product?.seller && Array.isArray(product?.seller) && product?.seller.length > 0 ? (
              <p className="p-text-16 text-dark-gray flex items-center gap-1 max-md:hidden">
                {product?.seller?.[0]?.store.storeName}{" "}
                {product?.seller?.[0]?.verificationStatus === "verified" ? (
                  <BadgeCheck className="size-5! fill-[#3E70EF] text-white" />
                ) : null}
              </p>
            ) : null}
            <h3 className="p-text-16 line-clamp-2 max-md:line-clamp-2 max-md:overflow-hidden max-md:pt-1 max-md:text-base md:mb-1 md:font-semibold">
              {product?.name}
            </h3>

            <AutoMovingText
              className="flex-wrap items-baseline max-md:w-full max-md:flex-col md:flex md:gap-x-2"
              maxWClassName="max-md:w-full"
            >
              <span className="p-text-20 text-primary font-semibold max-md:text-lg">
                {prodPrice?.toFixed(2)}
                <span className="ml-0.5">৳</span>
              </span>
              {prodLineThroughPrice ? (
                <div className="items-center justify-between max-md:flex max-md:w-full">
                  <span className="p-text-16 text-light-gray flex-1 line-through max-md:w-full max-md:text-base">
                    {prodLineThroughPrice?.toFixed(2)}
                    <span className="ml-0.5">৳</span>
                  </span>
                  {product.rating && product.rating > 0 ? (
                    <p className="p-text-14 text-dark-gray flex items-center gap-1 md:hidden">
                      {product?.rating.toFixed(1)}
                      <Star className="size-4! fill-current text-[#FDAB00]" />
                    </p>
                  ) : (
                    <div />
                  )}
                </div>
              ) : null}
            </AutoMovingText>
            {product?.seller && Array.isArray(product?.seller) && product?.seller.length > 0 ? (
              <p className="text-dark-gray flex items-center gap-1 text-xs md:hidden">
                {product?.seller?.[0]?.store.storeName}{" "}
                {product?.seller?.[0]?.verificationStatus === "verified" ? (
                  <BadgeCheck className="size-5! fill-[#3E70EF] text-white" />
                ) : null}
              </p>
            ) : null}
            <div className="flex flex-1 items-center justify-between">
              {product.rating && product.rating > 0 ? (
                <p className="p-text-14 text-dark-gray flex items-center gap-1 max-md:hidden">
                  {product?.rating.toFixed(1)}
                  <Star className="size-4! fill-current text-[#FDAB00]" />
                </p>
              ) : (
                <div />
              )}
              {/* <div className="relative" onMouseEnter={() => setIsCartHovered(true)} onMouseLeave={() => setIsCartHovered(false)}>
              <Button
                variant="secondary"
                className={`hover:border-primary h-10 border border-black bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white ${
                  isCartHovered ? "w-auto pr-4 pl-3" : "w-10 px-0"
                }`}
              >
                {isCartHovered && <span className="ml-2 text-sm font-medium whitespace-nowrap max-lg:hidden">Add To Cart</span>}{" "}
                <Icons.cartAddIcon className="size-4!" />
              </Button>
            </div> */}
              <div
                className="relative max-md:flex-1"
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true);
                  }}
                  className={`hover:border-primary border-primary h-8 overflow-hidden border bg-black text-white shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:text-white max-lg:w-full lg:h-10 lg:border-black lg:bg-white lg:text-black ${
                    isCartHovered ? "pr-4 pl-3 lg:w-[140px]" : "px-0 lg:w-10"
                  }`}
                >
                  <span
                    className={`ml-2 transform text-sm font-medium whitespace-nowrap uppercase transition-all duration-300 max-lg:hidden ${
                      isCartHovered ? "translate-x-0 opacity-100" : "hidden -translate-x-2 opacity-0"
                    }`}
                  >
                    Add To Cart
                  </span>
                  <span className="lg:hidden">Add To Cart</span>

                  <Icons.cartAddIcon className="size-4!" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>

      <ProductQuickView open={open} onOpenChange={setOpen} product_slug={product?.slug} isComboProduct={isComboProduct} />
      {itemToRestock ? <RequestRestockModal item={itemToRestock} open={restockOpen} onClose={() => setRestockOpen(false)} /> : null}
    </>
  );
}
