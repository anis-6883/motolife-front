"use client";
import { Icons } from "@/components/icons";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { allRoutes } from "@/config/constant";
import { IFlashSaleItem } from "@/lib/types";
import { BadgeCheck, Eye, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductQuickView } from "./QuickViewModal";

type Props = {
  product: IFlashSaleItem;
  slug: string;
};

const ProductCardHOffer = ({ product, slug }: Props) => {
  const [isViewHovered, setIsViewHovered] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Link href={`${allRoutes.products}/${product?.slug}`}>
        <Card
          key={product?._id}
          className="group relative grid h-full cursor-pointer overflow-hidden rounded-lg border-0 bg-transparent p-0 transition-shadow hover:shadow lg:shadow-none"
        >
          <div className="relative flex items-center">
            <div className="absolute right-1 bottom-2 z-10 flex flex-col items-end gap-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 lg:right-2 lg:opacity-0">
              {/* <div className="relative" onMouseEnter={() => setIsCartHovered(true)} onMouseLeave={() => setIsCartHovered(false)}>
            <Button
              size={"sm"}
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (cartItem) {
                  removeItem(cartItem);
                } else {
                  addItem({
                    productId: product?._id,
                    variantSku: product?.sku ?? "",
                    thumbnail: product?.thumbnail ?? "",
                    variation: "",
                    attributes: [],
                    isCombo: product?.isCombo ?? false,
                    quantity: 1,
                    sellingPrice: product?.discountPrice > 0 ? product?.discountPrice : product?.sellingPrice,
                    name: product?.name,
                  });
                }
              }}
              className={`hover:border-primary border border-black bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white ${
                isCartHovered ? "lg:px-1!" : "lg:px-0"
              }`}
            >
              {isCartHovered && (
                <span className="ml-2 text-sm font-medium whitespace-nowrap max-lg:hidden">{cartItem ? "Remove" : "Add To Cart"}</span>
              )}
              {cartItem ? <Trash2 className="size-4!" /> : <Icons.cartAddIcon className="size-4!" />}
            </Button>
          </div> */}
              <div className="relative" onMouseEnter={() => setIsCartHovered(true)} onMouseLeave={() => setIsCartHovered(false)}>
                <Button
                  size={"sm"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true);
                  }}
                  variant="secondary"
                  className={`hover:border-primary border border-black bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white ${
                    isCartHovered ? "w-auto lg:px-1!" : "lg:px-0"
                  }`}
                >
                  {isCartHovered && <span className="text-sm font-medium whitespace-nowrap capitalize max-lg:hidden">Add To Cart</span>}{" "}
                  <Icons.cartAddIcon className="size-4!" />
                </Button>
              </div>
            </div>
            {/* Left Side - Image */}
            <div className="bg-dark-gray relative aspect-132/140 max-h-35 min-h-35 overflow-hidden rounded-lg xl:h-full xl:max-h-full">
              <ImageWithFallback
                fallbackSrc="/images/auth/logo.png"
                src={product?.thumbnail}
                alt={product?.name}
                fill
                className="relative z-0 object-cover transition-transform duration-500 group-hover:scale-125"
              />
              {/* Action Buttons - Show on Hover */}
              <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 lg:right-2 lg:opacity-0">
                {/* <div className="relative" onMouseEnter={() => setIsWishlistHovered(true)} onMouseLeave={() => setIsWishlistHovered(false)}>
              <Button
                size={"sm"}
                variant="secondary"
                className={`hover:border-primary w-auto border border-black bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white ${
                  isWishlistHovered ? "lg:px-1!" : "lg:px-0"
                }`}
                onClick={handleWishlist}
              >
                {isWishlistHovered && (
                  <span className="text-sm font-medium whitespace-nowrap max-lg:hidden">{isWishlisted ? "Favourite" : "Favourite"}</span>
                )}{" "}
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`} />
              </Button>
            </div> */}

                <div className="relative" onMouseEnter={() => setIsViewHovered(true)} onMouseLeave={() => setIsViewHovered(false)}>
                  <Button
                    size={"sm"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(true);
                    }}
                    variant="secondary"
                    className={`hover:border-primary border border-black bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white ${
                      isViewHovered ? "w-auto lg:px-1!" : "lg:px-0"
                    }`}
                  >
                    {isViewHovered && <span className="text-sm font-medium whitespace-nowrap max-lg:hidden">Quick View</span>}{" "}
                    <Eye className="size-4!" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-1 flex-col justify-between bg-white p-2.5 max-lg:pb-10">
              {/* <ProductBadge isNew={product?.} isBestSeller={product?.isBestSeller} isLimited={product?.isLimited} />{" "} */}

              <h3 className="line-clamp-1 text-sm leading-5 font-semibold hover:underline md:text-base xl:line-clamp-2">{product?.name}</h3>
              {/* </Link> */}
              <div className="flex max-xl:flex-col xl:items-center xl:gap-3">
                {product?.rating && product?.rating > 0 ? (
                  <>
                    <p className="p-text-14 text-dark-gray flex items-center gap-1">
                      {product?.rating}
                      <Star className="size-4! fill-current text-[#FDAB00]" />
                    </p>
                    <Separator orientation="vertical" className="max-h-2.5 max-xl:hidden" />
                  </>
                ) : null}
                {product?.seller && product?.seller.length > 0 && product?.seller[0]?.name ? (
                  <p className="p-text-16 text-dark-gray flex items-center gap-1">
                    {product?.seller[0]?.name}{" "}
                    {product?.seller[0]?.verificationStatus === "verified" && <BadgeCheck className="size-5! fill-[#3E70EF] text-white" />}
                  </p>
                ) : null}
              </div>
              {/* Price */}
              <div className="flex flex-col items-baseline gap-x-1.5 xl:flex-row">
                <div className="flex items-baseline gap-1 xl:mt-3">
                  <span className="p-text-20 xl:font-semibold">
                    {product?.discountPrice > 0 ? (product?.discountPrice).toFixed(2) : product?.sellingPrice.toFixed(2)}
                  </span>
                  <span className="p-text-16 leading-5">BDT</span>
                </div>

                {product?.discountPrice > 0 && (
                  <span className="flex items-baseline gap-1 text-sm text-gray-400 line-through xl:text-base">
                    {product?.sellingPrice.toFixed(2)}
                    <span className="p-text-16 leading-5">BDT</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>

      <ProductQuickView open={open} onOpenChange={setOpen} product_slug={product?.slug || ""} />
    </>
  );
};

export default ProductCardHOffer;

export const ProductBadge = ({ isNew, isBestSeller, isLimited }: { isNew: boolean; isBestSeller: boolean; isLimited: boolean }) => {
  const BADGE_VARIANTS = {
    new: {
      label: "New arrival",
      textColor: "text-blue-dark",
      dotColor: "bg-blue-dark",
    },
    bestSeller: {
      label: "Best Seller",
      textColor: "text-green-dark",
      dotColor: "bg-green-dark",
    },
    limited: {
      label: "Limited",
      textColor: "text-secondary",
      dotColor: "bg-secondary",
    },
  };
  let variant = null;

  if (isLimited) variant = BADGE_VARIANTS.limited;
  else if (isBestSeller) variant = BADGE_VARIANTS.bestSeller;
  else if (isNew) variant = BADGE_VARIANTS.new;

  if (!variant) return null;

  return (
    <div
      className={`flex w-max items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase ${variant.textColor} bg-[#F4F4F4]`}
    >
      <div className={`size-2 rounded-full ${variant.dotColor}`} />
      {variant.label}
    </div>
  );
};
