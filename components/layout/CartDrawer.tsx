"use client";

import { Icons } from "@/components/icons";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { allRoutes } from "@/config/constant";
import { cn } from "@/lib/utils";
import { CartItem } from "@/store/cart/Cart-types";
import { useCartCount, useCartIsHydrated, useCartStore, useCartTotals } from "@/store/cart/cartStore";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmModal } from "../features/public/shared/DeleteConfirmationModal";

interface CartDrawerProps {
  trigger?: React.ReactNode;
  isOnNav?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FREE_SHIPPING_THRESHOLD = 30000;

export function CartDrawer({ trigger, isOnNav = true, open, onOpenChange }: CartDrawerProps) {
  const { cartDrawerOpen, setCartDrawerOpen } = useCartStore();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpenState = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };
  const router = useRouter();
  const [clearModalOpen, setClearModalOpen] = useState(false);
  // ─── Store ──────────────────────────────────────────────────────────────────
  const { items, updateItem, removeItem, clearCart, initCheckoutAndNavigate, isCreatingCart } = useCartStore();
  const { subtotal } = useCartTotals();

  const cartCount = useCartCount();
  const isHydrated = useCartIsHydrated();

  // ─── Shipping progress ──────────────────────────────────────────────────────
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleUpdateQuantity = (item: CartItem, delta: number) => {
    updateItem(item.productId, item.variantSku, item.quantity + delta);
  };

  const handleRemove = (item: CartItem) => {
    removeItem(item.productId, item.variantSku);
  };

  const handleClearAll = () => {
    setClearModalOpen(true);
  };
  const handleConfirmClear = () => {
    clearCart();
    setClearModalOpen(false);
  };

  const handleCloseClearModal = () => {
    setClearModalOpen(false);
  };
  const handleCheckout = async () => {
    const data = await initCheckoutAndNavigate("cart", items);
    if (!data.success) return;
    useCartStore.getState().setCartDrawerOpen(false);
    setOpenState(false);
    router.push(allRoutes.checkout);
  };

  return (
    <>
      <Sheet open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
        <SheetTrigger asChild>
          {trigger || (
            <Button
              variant="outline"
              size="icon"
              className={cn(
                isOnNav
                  ? "relative border-0 p-0! shadow-none transition-colors hover:bg-transparent"
                  : "relative border-0 p-0! shadow-none transition-colors hover:bg-transparent max-md:size-6!"
              )}
            >
              <Icons.shoppingBagIcon className={cn("size-4! md:size-7!")} />
              {isHydrated && cartCount > 0 && (
                <Badge
                  className={cn(
                    "bg-primary text-primary-foreground absolute -top-2 -right-2 flex size-6! items-center justify-center rounded-full",
                    !isOnNav && "-translate-y-1"
                  )}
                >
                  <span className="p-text-14 font-medium">{cartCount}</span>
                </Badge>
              )}
            </Button>
          )}
        </SheetTrigger>

        <SheetContent className="flex w-[80vw] flex-col overflow-hidden rounded-l-2xl p-0 text-black max-md:gap-2 md:max-w-lg xl:max-w-xl [&>button:first-of-type]:hidden">
          {/* Header */}
          <SheetHeader className="border-b p-2 md:px-6 md:py-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <p className="p-text-36 leading-12 font-bold -tracking-[0.72px]">Shopping Cart</p>
                {cartCount > 0 ? (
                  <Badge className="bg-dark-gray/5 size-7.5 rounded-full text-black">
                    <p className="p-text-18 font-semibold -tracking-[0.18px]">{cartCount}</p>
                  </Badge>
                ) : null}
              </SheetTitle>
              <button onClick={() => useCartStore.getState().setCartDrawerOpen(false)}>
                <X className="size-6" />
              </button>
            </div>
          </SheetHeader>

          {/* Free Shipping Progress */}
          {/* {remainingForFreeShipping > 0 && (
          <div className="px-6 py-3">
            <p className="p-text-18 mb-2 text-center">
              Only <span className="font-semibold">{remainingForFreeShipping} BDT</span> from <span className="uppercase">FREE</span>{" "}
              shipping!
            </p>
            <div className="relative h-2 rounded-full bg-gray-200">
              <div
                className="bg-primary relative h-full rounded-full transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              >
                <div
                  className={`border-primary text-primary absolute top-1/2 right-0 flex size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white ${items.length === 0 ? "hidden" : ""}`}
                >
                  <Icons.deliveryTruck className="size-5" />
                </div>
              </div>
            </div>
          </div>
        )} */}

          {/* Clear All */}
          {items.length > 0 && (
            <div className="px-6">
              <button
                onClick={handleClearAll}
                className="p-text-16 text-primary hover:text-primary/80 leading-6 font-medium hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Cart Items */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-6 md:pb-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="mb-4 h-16 w-16 text-gray-300" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Your cart is empty</h3>
                <p className="text-dark-gray mb-6 text-sm">Add some items to get started</p>
                <Button
                  onClick={() => {
                    useCartStore.getState().setCartDrawerOpen(false);
                    router.push(allRoutes.products);
                  }}
                  className="bg-black text-white hover:bg-black/90"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4 divide-y">
                {items.map((item, index) => (
                  <div key={`${item.productId}-${item.variantSku}-${index}`} className="flex gap-3 pb-3.5">
                    {/* Product Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <ImageWithFallback
                        fallbackSrc="/images/auth/logo.png"
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-start justify-between max-md:flex-col md:gap-2">
                        <h3 className="p-text-18 line-clamp-2 font-semibold -tracking-[0.18px] text-gray-900 max-md:text-xs max-md:leading-3">
                          {item.name}
                        </h3>
                        <span className="p-text-18 font-semibold -tracking-[0.18px] whitespace-nowrap text-gray-900 max-md:text-xs">
                          {(item.sellingPrice * item.quantity).toFixed(2)} ৳
                        </span>
                      </div>

                      <div className="text-dark-gray p-text-16 mb-2 flex items-center gap-2 leading-6 max-md:text-xs max-md:leading-3">
                        {item.isCombo || item.variation ? (
                          <>
                            {" "}
                            Variant:{" "}
                            {item.isCombo ? (
                              <span className="font-semibold">Combo</span>
                            ) : (
                              <span className="font-semibold">{item.variation}</span>
                            )}
                            <span className="h-2 w-px bg-black/50" />
                          </>
                        ) : null}
                        Qty: <span className="font-semibold">{item.quantity}</span>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-lg border lg:h-11">
                          <button
                            onClick={() => handleUpdateQuantity(item, -1)}
                            className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-gray-50"
                          >
                            <Minus className="size-3 lg:size-6" />
                          </button>
                          <span className="p-text-18 w-8 text-center font-semibold max-md:text-xs">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item, 1)}
                            className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-gray-50"
                          >
                            <Plus className="size-3 lg:size-6" />
                          </button>
                        </div>

                        <button onClick={() => handleRemove(item)} className="text-primary hover:text-primary/80 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-primary space-y-1 border-t bg-gray-50 px-2 py-2 md:space-y-4 md:px-6 md:py-4">
              <div className="space-y-1">
                <div className="p-text-30 flex items-center justify-between font-bold max-md:text-sm">
                  <span>Total</span>
                  <span>{subtotal.toFixed(2)} ৳</span>
                </div>
                <p className="p-text-18 text-dark-gray max-md:text-xs max-md:leading-3">Shipping charge will be calculated at checkout</p>
                {/* <p className="p-text-18 text-dark-gray">Taxes and shipping calculated at checkout</p> */}
              </div>

              <div className="gap-6 space-y-2 md:flex">
                <Link
                  href={allRoutes.cart}
                  className="block flex-1 max-lg:w-full"
                  onClick={() => useCartStore.getState().setCartDrawerOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full flex-1 border-black font-semibold text-black hover:bg-black! hover:text-white md:h-11"
                  >
                    VIEW FULL CART
                  </Button>
                </Link>
                <Button
                  onClick={handleCheckout}
                  disabled={isCreatingCart}
                  className="w-full flex-1 bg-black font-semibold text-white hover:bg-black/90 md:h-11"
                >
                  {isCreatingCart ? "Processing..." : "CHECKOUT"}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <DeleteConfirmModal
        open={clearModalOpen}
        onClose={handleCloseClearModal}
        onConfirm={handleConfirmClear}
        description="Clear all items from cart?"
        confirmText="Clear Cart"
        cancelText="Cancel"
      />
    </>
  );
}
