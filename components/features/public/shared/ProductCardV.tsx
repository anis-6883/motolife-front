"use client";

import type React from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { allRoutes } from "@/config/constant";
import { BadgeCheck, Eye, Heart, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AutoMovingText } from "@/components/shared/AutoMovingText";
import { ProductQuickView } from "./QuickViewModal";

type ProductCardProps = {
  product: any;
  isComboProduct?: boolean;
};

export function ProductCardV({ product, isComboProduct = false }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);
  const [isViewHovered, setIsViewHovered] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);

  console.log(product);
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic here
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
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
    <Card className="group relative h-full max-w-full cursor-pointer gap-0 overflow-hidden border bg-white py-0 shadow-none transition-all duration-300">
      <div className="relative h-70 overflow-hidden bg-gray-100 transition-all duration-300">
        {/* Badge */}
        {product.discount > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <div className="text-primary p-text-15 flex items-center gap-1.5 rounded-full bg-[#F4F4F4] px-3 py-1 font-semibold shadow">
              <div className="bg-primary size-2 rounded-full"></div>
              {product.discount}% off
            </div>
          </div>
        )}

        {/* Main Image */}
        <Image
          src={product.thumbnail || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-125"
        />

        {/* Action Buttons - Show on Hover */}
        <div className="absolute top-4 right-8 flex translate-x-5 flex-col items-end gap-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 lg:right-4 lg:opacity-0">
          {/* <div className="relative" onMouseEnter={() => setIsWishlistHovered(true)} onMouseLeave={() => setIsWishlistHovered(false)}>
            <Button
              variant="secondary"
              className={`hover:border-primary h-10 border border-black bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white ${
                isWishlistHovered ? "w-auto pr-4 pl-3" : "w-10 px-0"
              }`}
              onClick={handleWishlist}
            >
              {isWishlistHovered && (
                <span className="ml-2 text-sm font-medium whitespace-nowrap max-lg:hidden">{isWishlisted ? "Favourite" : "Favourite"}</span>
              )}{" "}
              {isWishlisted ? <Trash2 className="size-5" /> : <Heart className={`size-5`} />}
            </Button>
          </div> */}

          <div className="relative" onMouseEnter={() => setIsViewHovered(true)} onMouseLeave={() => setIsViewHovered(false)}>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }}
              variant="secondary"
              className={`hover:border-primary h-10 border border-black bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white ${
                isViewHovered ? "w-auto pr-4 pl-3" : "w-10 px-0"
              }`}
            >
              {isViewHovered && <span className="ml-2 text-sm font-medium whitespace-nowrap max-lg:hidden">Quick View</span>}{" "}
              <Eye className="size-4!" />
            </Button>
          </div>
        </div>

        {/* Add to Bag Button */}
        <div className="absolute right-0 -bottom-px left-0 transition-all duration-300 lg:translate-y-full lg:opacity-0 group-hover:lg:translate-y-0 group-hover:lg:opacity-100">
          <Button
            className="bg-primary hover:bg-primary border-primary h-7 w-full rounded-none font-semibold text-white"
            onClick={handleAddToCart}
          >
            Order now
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative flex min-h-30 flex-col justify-between space-y-1.5 bg-white p-4 transition-all duration-300">
        <p className="p-text-16 text-dark-gray flex items-center gap-1">
          {product?.seller?.store?.storeName || ""}
          {product?.seller?.verificationStatus === "verified" && <BadgeCheck className="size-5! fill-[#3E70EF] text-white" />}
          {/* <BadgeCheck className="size-5! fill-[#3E70EF] text-white" /> */}
        </p>
        <Link href={`${allRoutes.products}/${product.id}`} className="h-full">
          <h3 className="p-text-16 mb-1 line-clamp-2 font-semibold hover:underline">{product.name}</h3>
        </Link>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {/* MAIN PRICE */}
          <span className="p-text-20 text-primary font-semibold whitespace-nowrap">
            {prodPrice?.toFixed(2)}
            <span className="ml-0.5">৳</span>
          </span>

          {/* STRIKE PRICE */}
          {prodLineThroughPrice ? (
            <span className="text-light-gray text-sm whitespace-nowrap line-through">
              {prodLineThroughPrice?.toFixed(2)}
              <span className="ml-0.5">৳</span>
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 items-center justify-between">
          <div className="relative" onMouseEnter={() => setIsCartHovered(true)} onMouseLeave={() => setIsCartHovered(false)}>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }}
              variant="secondary"
              className={`hover:border-primary h-10 border border-black bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white ${
                isCartHovered ? "w-auto pr-4 pl-3" : "w-10 px-0"
              }`}
            >
              {isCartHovered && <span className="ml-2 text-sm font-medium whitespace-nowrap max-lg:hidden">Add To Cart</span>}{" "}
              <Icons.cartAddIcon className="size-4!" />
            </Button>
          </div>
        </div>
      </div>
      {/* {console.log("Rendering ProductCardV for product:", product)} */}
      <ProductQuickView open={open} onOpenChange={setOpen} product_slug={product?.slug} isComboProduct={isComboProduct} />
    </Card>
  );
}
