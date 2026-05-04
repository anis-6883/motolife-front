"use client";

import { Icons } from "@/components/icons";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { allRoutes } from "@/config/constant";
import { IProductPublic } from "@/lib/types";
import { CartItem } from "@/store/cart/Cart-types";
import { useCartStore } from "@/store/cart/cartStore";
import { Eye, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ProductQuickView } from "./QuickViewModal";

type ProductCardHProps = {
  product: IProductPublic;
  isComboProduct?: boolean;
  dir?: "rtl" | "ltr";
  MobileGridVal?: number;
};

const ProductCardH = ({ product, isComboProduct = false, dir = "ltr", MobileGridVal = 2 }: ProductCardHProps) => {
  const [open, setOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);
  const [isViewHovered, setIsViewHovered] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);

  const router = useRouter();
  const { addToOrderNow } = useCartStore();

  const firstVariant = product?.variants?.[0];

  const resolvedPrice =
    firstVariant?.discountPrice && firstVariant?.discountPrice > 0
      ? firstVariant.discountPrice
      : (firstVariant?.variantPrice ??
        (product?.discountPrice && product?.discountPrice > 0 ? product?.discountPrice : product?.sellingPrice));

  const originalPrice = product?.variants?.length > 0 ? firstVariant?.variantPrice : product?.sellingPrice;

  // ✅ FINAL PRICE (what user pays)
  const finalPrice =
    product?.variants?.length > 0
      ? firstVariant?.discountPrice && firstVariant?.discountPrice > 0
        ? firstVariant?.discountPrice
        : firstVariant?.variantPrice
      : product?.discountPrice && product?.discountPrice > 0
        ? product?.discountPrice
        : product?.sellingPrice;

  // ✅ DISPLAY
  const displayPrice = Number(finalPrice || 0).toFixed(2);

  // ✅ STRIKETHROUGH (ONLY original)
  const strikethroughPrice = Number(originalPrice || 0).toFixed(2);

  // ✅ HAS DISCOUNT
  const hasDiscount =
    product?.variants?.length > 0
      ? firstVariant?.discountPrice && firstVariant?.discountPrice > 0
      : product?.discountPrice && product?.discountPrice > 0;
  const discountPrice = product?.variants?.length > 0 ? firstVariant?.discountPrice : product?.discountPrice;
  const discountValue = product?.variants?.length > 0 ? firstVariant?.discountValue : product?.discountValue;
  const discountType = product?.variants?.length > 0 ? firstVariant?.discountType : product?.discountType;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variantSku = firstVariant?.sku ?? product?.sku ?? "";
    const attributes =
      firstVariant?.attributes?.map((attr) => ({
        name: attr.name,
        value: attr.value,
      })) ?? [];

    const cartItem: CartItem = {
      productId: product._id,
      variantSku,
      thumbnail: product?.thumbnail ?? "",
      variation: attributes.map((a) => a.value).join(" / "),
      attributes,
      isCombo: isComboProduct,
      quantity: 1,
      sellingPrice: Number(resolvedPrice),
      name: product.name,
    };

    addToOrderNow(cartItem);
    router.push(allRoutes.orderNow);
  };
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const sellerEntry = Array.isArray(product?.seller) ? product.seller[0] : product?.seller;

  const storeName = sellerEntry?.store?.storeName ?? "Unknown";
  const isVerified = sellerEntry?.verificationStatus === "verified";
  const rating = product?.rating ?? 0;

  return (
    <>
      <Link href={`${isComboProduct ? allRoutes.comboOffer : allRoutes.products}/${product.slug}`} className="max-md:h-full md:h-max">
        <Card className="group relative grid cursor-pointer gap-0 overflow-hidden rounded-lg bg-transparent p-0 shadow-none transition-shadow hover:shadow max-md:h-full md:p-3 md:pb-2">
          <div className="relative flex items-center max-md:flex-col md:items-start">
            <div
              className={`bg-dark-gray relative aspect-square overflow-hidden rounded-lg max-md:w-full max-md:rounded-b-none xl:h-24 xl:max-h-full ${MobileGridVal === 3 ? "max-h-18 min-h-18" : "max-h-26 min-h-26"}`}
            >
              <ImageWithFallback
                fallbackSrc="/images/placeholders/product.png"
                src={product.thumbnail}
                alt={product.name}
                fill
                className="relative z-0 object-cover transition-transform duration-500 group-hover:scale-125"
              />

              {hasDiscount ? (
                <div className="absolute top-1 left-1 z-10 md:top-2 md:left-2">
                  <div className="text-primary flex items-center gap-1.5 rounded-full bg-[#F4F4F4] px-2 py-1 text-xs font-semibold shadow">
                    <div className="bg-primary size-2 rounded-full md:hidden"></div>
                    {discountValue}
                    {discountType === "percentage" ? " %" : " ৳"} off
                  </div>
                </div>
              ) : null}

              {/* Action buttons overlay (wishlist + quick view) */}
              <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 lg:right-1 lg:opacity-0">
                {/* Wishlist */}
                {/* <div className="relative" onMouseEnter={() => setIsWishlistHovered(true)} onMouseLeave={() => setIsWishlistHovered(false)}>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleWishlist}
                className={`hover:border-primary w-auto border border-black bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white ${
                  isWishlistHovered ? "lg:px-1!" : "lg:px-0"
                }`}
              >
                {isWishlistHovered && <span className="text-sm font-medium whitespace-nowrap max-lg:hidden">Favourite</span>}{" "}
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`} />
              </Button>
            </div> */}

                <div
                  className="relative max-lg:hidden"
                  onMouseEnter={() => setIsViewHovered(true)}
                  onMouseLeave={() => setIsViewHovered(false)}
                >
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(true);
                    }}
                    variant="secondary"
                    className={`hover:border-primary h-7 overflow-hidden border border-black bg-white text-black shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:text-white ${
                      isViewHovered ? "w-[85px] px-2" : "w-10 px-0"
                    }`}
                  >
                    {isViewHovered && (
                      <span
                        className={`transform text-[10px] font-medium whitespace-nowrap uppercase transition-all duration-300 max-lg:hidden ${
                          isViewHovered ? "translate-x-0 opacity-100" : "hidden -translate-x-2 opacity-0"
                        }`}
                      >
                        Quick View
                      </span>
                    )}{" "}
                    <Eye className="size-3!" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Right: Content ───────────────────────────────────────────── */}
            <div
              className={`flex flex-1 flex-col bg-white p-2.5 max-md:w-full lg:pb-0 ${dir === "rtl" ? "lg:order-first lg:justify-end" : "justify-between"}`}
            >
              {/* Badge */}
              <div className={`flex flex-1 max-md:hidden ${dir === "rtl" ? "lg:justify-end" : ""}`}>
                <ProductBadge
                  isNew={product?.isNewArrived ?? false}
                  isFeatured={product?.isFeatured ?? false}
                  isUpcoming={product?.isUpcoming ?? false}
                />
              </div>

              {/* Product name */}
              <h3
                className={`line-clamp-2 text-base leading-5 hover:underline max-md:pt-1 md:font-semibold xl:line-clamp-2 ${dir === "rtl" ? "lg:text-right" : ""}`}
              >
                {product.name}
              </h3>

              {/* Rating + Separator + Brand */}
              <div
                className={`flex max-lg:flex-col max-md:hidden xl:items-center xl:gap-3 ${dir === "rtl" ? "w-full lg:flex-row lg:justify-end" : ""}`}
              >
                {rating && rating > 0 ? (
                  <p className="p-text-14 text-dark-gray flex items-center gap-1">
                    {rating.toFixed(1)}
                    <Star className="size-4! fill-current text-[#FDAB00]" />
                  </p>
                ) : null}
                {rating && rating > 0 ? <Separator orientation="vertical" className="max-h-2.5 max-xl:hidden" /> : null}
                {/* {storeName ? (
                  <p className="p-text-16 text-dark-gray flex items-center gap-1 max-md:hidden">
                    {storeName}
                    {isVerified ? <BadgeCheck className="size-5! fill-[#3E70EF] text-white" /> : null}
                  </p>
                ) : null} */}
              </div>

              {/* Price */}
              <div
                className={`flex flex-col items-baseline gap-x-1.5 max-md:pb-1 md:hidden lg:flex-row ${dir === "rtl" ? "w-full lg:justify-end lg:text-end" : ""}`}
              >
                <div className="flex items-baseline gap-1 xl:mt-3">
                  <span className="p-text-20 text-primary xl:font-semibold">{displayPrice}</span>
                  <span className="p-text-16 leading-4 md:leading-5">৳</span>
                </div>
                <div className="flex w-full justify-between">
                  {hasDiscount && Number(originalPrice) > Number(finalPrice) ? (
                    <span className="flex items-baseline gap-1 text-sm text-gray-400 line-through md:text-base">
                      {strikethroughPrice}
                      <span className="leading-5">৳</span>
                    </span>
                  ) : null}
                  {rating && rating > 0 ? (
                    <p className="p-text-14 text-dark-gray flex items-center gap-1 md:hidden">
                      {rating.toFixed(1)}
                      <Star className="size-4! fill-current text-[#FDAB00]" />
                    </p>
                  ) : null}
                </div>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(true);
                }}
                className={`hover:border-primary border-primary h-8 overflow-hidden border bg-black text-white shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:text-white max-md:w-full md:hidden md:h-10 md:border-black md:bg-white md:text-black`}
              >
                <span>Add To Cart</span>

                <Icons.cartAddIcon className="size-4!" />
              </Button>
            </div>
          </div>
          {/* Price */}
          <div className={`flex flex-col items-baseline gap-x-1.5 max-md:hidden md:flex-row ${dir === "rtl" ? "lg:justify-end" : ""}`}>
            <div className="flex items-baseline gap-1">
              <span className="p-text-20 text-primary max-md:leading-4 xl:font-semibold">{displayPrice}৳</span>
              {/* <span className="p-text-16 leading-4 md:leading-5"></span> */}
            </div>

            {hasDiscount && Number(originalPrice) > Number(finalPrice) ? (
              <span className="flex items-baseline gap-1 text-[8px] text-gray-400 line-through max-md:leading-2 md:text-base">
                {strikethroughPrice}
                <span className="md:p-text-16 leading-5 max-md:text-[8px] max-md:leading-2">৳</span>
              </span>
            ) : null}
          </div>
          <div
            className={`absolute bottom-2 z-10 flex flex-col items-end gap-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 lg:opacity-0 ${dir === "rtl" ? "right-1 lg:right-auto lg:left-2" : "right-1 lg:right-2"}`}
          >
            <div
              className="relative max-lg:hidden"
              onMouseEnter={() => setIsCartHovered(true)}
              onMouseLeave={() => setIsCartHovered(false)}
            >
              <Button
                size="sm"
                variant="secondary"
                // onClick={handleAddToCart}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(true);
                }}
                className={`hover:border-primary overflow-hidden border border-black bg-white text-black shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:text-white ${
                  isCartHovered ? "w-[130px] pr-4 pl-3" : "w-10 px-0"
                }`}
              >
                {isCartHovered && (
                  <span
                    className={`transform text-sm font-medium whitespace-nowrap uppercase transition-all duration-300 max-lg:hidden ${
                      isCartHovered ? "translate-x-0 opacity-100" : "hidden -translate-x-2 opacity-0"
                    }`}
                  >
                    Add to cart
                  </span>
                )}{" "}
                <Icons.cartAddIcon className="size-4!" />
              </Button>
            </div>
          </div>
        </Card>
      </Link>

      <ProductQuickView open={open} onOpenChange={setOpen} product_slug={product?.slug} isComboProduct={isComboProduct} />
    </>
  );
};

export default ProductCardH;

// ── Badge ──────────────────────────────────────────────────────────────────────
export const ProductBadge = ({ isNew, isFeatured, isUpcoming }: { isNew: boolean; isFeatured: boolean; isUpcoming: boolean }) => {
  const BADGE_VARIANTS = {
    new: { label: "New arrival", textColor: "text-blue-dark", dotColor: "bg-blue-dark/10" },
    bestSeller: { label: "Featured", textColor: "text-green-dark", dotColor: "bg-green-dark/10" },
    upcoming: { label: "Upcoming", textColor: "text-secondary", dotColor: "bg-secondary/10" },
  };

  let variant = null;
  if (isUpcoming) variant = BADGE_VARIANTS.upcoming;
  else if (isFeatured) variant = BADGE_VARIANTS.bestSeller;
  else if (isNew) variant = BADGE_VARIANTS.new;

  if (!variant) return null;

  return (
    <div
      className={`flex w-max items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase ${variant.textColor} ${variant.dotColor}`}
    >
      {/* <div className={`size-2 rounded-full ${variant.dotColor}`} /> */}
      {variant.label}
    </div>
  );
};
