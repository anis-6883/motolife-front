"use client";

import Toast from "@/components/shared/Toast";
import { allRoutes } from "@/config/constant";
import { cn } from "@/lib/utils";
import { CartItem } from "@/store/cart/Cart-types";
import { useCartCount, useCartItems, useCartStore } from "@/store/cart/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RequestRestockModal } from "./RequestRestockModal";
import { ProductDetailObj } from "./schemas";

interface MobileOrderBarProps {
  product: ProductDetailObj;
  visible?: boolean;
  stock: number;
  matchedVariant?: any;
  isCompleteSelection?: boolean;
  selectedQuantity?: number;
  isComboProduct?: boolean;
}

export function MobileOrderBar({
  product,
  visible = true,
  stock,
  matchedVariant,
  isCompleteSelection = false,
  selectedQuantity = 1,
  isComboProduct,
}: MobileOrderBarProps) {
  const isOnVacation = product?.seller?.[0]?.businessSettings?.vacation?.isOnVacation;
  const [restockOpen, setRestockOpen] = useState(false);
  const [itemToRestock, setItemToRestock] = useState<CartItem | null>(null);

  const { addItem, updateItem, addToOrderNow, setCartDrawerOpen } = useCartStore();
  const cartItems = useCartItems();
  const router = useRouter();
  const cartCount = useCartCount();

  if (!visible) return null;

  // const variantSku = matchedVariant?.sku ?? "";
  const hasVariants = product?.variants?.length > 0;
  const variantSku = isComboProduct ? "" : hasVariants ? (matchedVariant?.sku ?? "") : "";
  const getPrice = () => {
    if (matchedVariant) {
      if (matchedVariant.discountPrice && matchedVariant.discountPrice > 0) {
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
    variation: matchedVariant?.attributes?.map((a: any) => a.value).join(" / ") ?? "",
    attributes: matchedVariant?.attributes ?? [],
    isCombo: isComboProduct ?? false,
    quantity: selectedQuantity,
    sellingPrice: Number(getPrice()),
    name: product.name,
    ...(matchedVariant?.discountPrice && Number(matchedVariant?.discountPrice) > 0
      ? { hasDiscount: true }
      : product?.discountPrice && Number(product?.discountPrice) > 0 && { hasDiscount: true }),
  });

  const handleAddToCart = () => {
    if (!matchedVariant && product?.variants?.length) return;

    const existing = cartItems.find((item) => item.productId === product._id && item.variantSku === variantSku);

    if (existing) {
      updateItem(product._id, variantSku, selectedQuantity);
    } else {
      addItem(buildCartItem());
    }

    Toast.clickable(
      {
        title: "Added to cart",
        description: "Click to view your cart",
      },
      () => {
        // Open the global cart drawer
        useCartStore.getState().setCartDrawerOpen(true);
      }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!matchedVariant && product?.variants?.length) return;

    addToOrderNow(buildCartItem());
    router.push(allRoutes.orderNow);
  };

  return (
    <>
      <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white shadow-md md:hidden">
        <div className="flex w-full">
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0 || product?.isUpcoming || (product.variants?.length > 0 && (!isCompleteSelection || !matchedVariant))}
            className={cn(
              "h-12 w-1/2 bg-black text-sm font-semibold text-white",
              (isOnVacation ||
                stock <= 0 ||
                product?.isUpcoming ||
                (product.variants?.length > 0 && (!isCompleteSelection || !matchedVariant))) &&
                "cursor-not-allowed bg-gray-400"
            )}
          >
            Add to Cart
          </button>

          {product.isUpcoming ? (
            <button disabled className="bg-primary h-12 w-1/2 text-sm font-semibold text-white">
              Upcoming Product
            </button>
          ) : stock > 0 ? (
            <button
              onClick={handleOrderNow}
              disabled={
                isOnVacation ||
                stock <= 0 ||
                product?.isUpcoming ||
                (product.variants?.length > 0 && (!isCompleteSelection || !matchedVariant))
              }
              className="bg-primary h-12 w-1/2 text-sm font-semibold text-white"
            >
              Order Now
            </button>
          ) : (
            <button
              disabled={isOnVacation}
              onClick={() => {
                setRestockOpen(true);
                setItemToRestock(buildCartItem());
              }}
              className="bg-primary h-12 w-1/2 text-sm font-semibold text-white"
            >
              Request Restock
            </button>
          )}
        </div>
      </div>

      {itemToRestock && <RequestRestockModal item={itemToRestock} open={restockOpen} onClose={() => setRestockOpen(false)} />}
    </>
  );
}
