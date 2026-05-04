"use client";

import { Icons } from "@/components/icons";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { allRoutes } from "@/config/constant";
import { formatNumber } from "@/lib/formatters";
import { CartItem } from "@/store/cart/Cart-types";
import { useCartStore } from "@/store/cart/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RequestRestockModal } from "./RequestRestockModal";
import { ProductDetailObj } from "./schemas";

interface StickyProductBarProps {
  product: ProductDetailObj;
  matchedVariant?: any;
  isCompleteSelection?: boolean;
  selectedQuantity?: number;
  stock: number;
  isComboProduct?: boolean;
}

export function StickyProductBar({
  product,
  matchedVariant,
  isCompleteSelection = false,
  selectedQuantity = 1,
  stock,
  isComboProduct,
}: StickyProductBarProps) {
  const isOnVacation = product?.seller?.[0]?.businessSettings?.vacation?.isOnVacation;
  const [restockOpen, setRestockOpen] = useState(false);
  const [itemToRestock, setItemToRestock] = useState<CartItem | null>(null);

  const { addItem, addToOrderNow } = useCartStore();
  const router = useRouter();

  const hasVariants = product?.variants && product.variants.length > 0;
  const variantSku = matchedVariant?.sku ?? (hasVariants ? (product.variants[0]?.sku ?? "") : "");
  const getPrice = () => {
    if (matchedVariant) {
      if (matchedVariant.discountPrice && Number(matchedVariant.discountPrice) > 0) {
        return matchedVariant.discountPrice;
      }
      return matchedVariant.variantPrice;
    }

    if (product?.discountPrice && Number(product?.discountPrice) > 0) return product.discountPrice;

    return product.sellingPrice;
  };
  const buildCartItem = (): CartItem => ({
    productId: product._id,
    variantSku,
    thumbnail: product?.colorWiseImages?.[0]?.image ?? product?.thumbnail ?? "",
    variation: matchedVariant?.attributes?.map((attr: any) => attr.value).join(" / ") ?? "",
    attributes: matchedVariant?.attributes ?? [],
    isCombo: isComboProduct ?? false,
    quantity: selectedQuantity,
    sellingPrice: Number(getPrice()),
    name: product.name,
    ...(matchedVariant?.discountPrice && Number(matchedVariant?.discountPrice) > 0
      ? { hasDiscount: true }
      : product?.discountPrice && Number(product?.discountPrice) > 0 && { hasDiscount: true }),
  });

  const price =
    hasVariants && matchedVariant
      ? matchedVariant.discountPrice && Number(matchedVariant.discountPrice) > 0
        ? matchedVariant.discountPrice
        : matchedVariant.variantPrice
      : product.discountPrice && Number(product.discountPrice) > 0
        ? product.discountPrice
        : product.sellingPrice;

  const linethroughPrice =
    hasVariants && matchedVariant
      ? matchedVariant.discountPrice && Number(matchedVariant.discountPrice) > 0
        ? matchedVariant.variantPrice
        : null
      : product.discountPrice && Number(product.discountPrice) > 0
        ? product.sellingPrice
        : null;

  const handleAddToCart = () => {
    if (!matchedVariant && hasVariants) return;
    addItem(buildCartItem());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!matchedVariant && hasVariants) return;
    addToOrderNow(buildCartItem());
    router.push(allRoutes.orderNow);
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-2 fixed top-33 right-0 left-0 z-50 border-b bg-white shadow-xs duration-300">
      <Container className="flex items-center justify-between gap-4 py-5">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <div className="relative size-14 overflow-hidden rounded-md border">
            <ImageWithFallback
              fallbackSrc={"/images/auth/logo.png"}
              src={product?.thumbnail}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h4 className="p-text-18 font-semibold text-black">{product.name}</h4>

            <div className="flex items-center gap-3 text-sm">
              <p className="p-text-16 font-nunitosans text-dark-gray leading-5 font-bold">Price</p>
              <span className="text-primary font-semibold">{formatNumber(Number(price))} BDT</span>
              {linethroughPrice && Number(linethroughPrice) > 0 && (
                <span className="text-gray-400 line-through">{formatNumber(Number(linethroughPrice))} BDT</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex gap-3 max-md:flex-col">
          <Button
            onClick={handleAddToCart}
            disabled={
              isOnVacation ||
              stock <= 0 ||
              product?.isUpcoming ||
              (product.variants?.length > 0 && (!isCompleteSelection || !matchedVariant))
            }
            className="h-10 flex-1 bg-black text-sm font-semibold text-white uppercase hover:bg-black/90"
          >
            <Icons.cartAddIcon className="mr-2 size-5" />
            ADD TO CART
          </Button>

          {stock > 0 ? (
            <Button
              onClick={handleOrderNow}
              disabled={
                isOnVacation ||
                stock <= 0 ||
                product?.isUpcoming ||
                (product.variants?.length > 0 && (!isCompleteSelection || !matchedVariant))
              }
              className="bg-primary hover:bg-primary/80 h-10 w-full flex-1 text-sm font-semibold text-white uppercase"
            >
              ORDER NOW
            </Button>
          ) : (
            <Button
              disabled={isOnVacation}
              onClick={() => {
                setRestockOpen(true);
                setItemToRestock(buildCartItem());
              }}
              className="bg-primary hover:bg-primary/80 h-10 w-full flex-1 text-sm font-semibold text-white uppercase"
            >
              Request Restock
            </Button>
          )}
        </div>
      </Container>

      {itemToRestock && <RequestRestockModal item={itemToRestock} open={restockOpen} onClose={() => setRestockOpen(false)} />}
    </div>
  );
}
