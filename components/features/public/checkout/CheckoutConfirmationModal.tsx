"use client";

import { Icons } from "@/components/icons";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import routes from "@/config/routes";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface CheckoutConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: any;
}

export function CheckoutConfirmationModal({ open, onOpenChange, orderData }: CheckoutConfirmationModalProps) {
  const order = orderData?.data;
  const routeTo = useRouter();
  const shippingAddress = `${order?.shippingAddress?.address}, ${order?.shippingAddress?.thana}, ${order?.shippingAddress?.district}`;

  const handleContinueShopping = () => {
    onOpenChange(false);
    routeTo.push(routes.publicRoutes.productList);
  };
  useEffect(() => {
    if (open === false) {
      routeTo.push(routes.publicRoutes.productList);
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-none gap-0 overflow-y-auto px-3 py-5 max-lg:max-h-[90vh] sm:max-w-[90vw] md:max-w-xl md:px-10 [&>button:first-of-type]:hidden">
        <div className="relative">
          <button onClick={handleContinueShopping} className="absolute top-0 right-0 z-10">
            <X className="size-6" />
          </button>

          <DialogHeader className="px-6 pb-6">
            <div className="flex justify-center">
              <Icons.chillin />
            </div>

            <h2 className="p-text-30 text-center font-bold text-[#158D47]">Thank you! Your order has been confirmed successfully.</h2>
          </DialogHeader>

          <div className="space-y-5">
            {/* Order info */}
            <div className="p-text-16 grid grid-cols-2 gap-y-2 md:grid-cols-[180px_1fr]">
              <span className="text-dark-gray">Order ID</span>
              <span className="font-semibold">: {order?.orderId}</span>

              <span className="text-dark-gray">Shipping Address</span>
              <span className="font-semibold">: {shippingAddress}</span>

              <span className="text-dark-gray">Payment Method</span>
              <span className="font-semibold">: {order?.payment?.method}</span>

              <span className="text-dark-gray">Payment Status</span>
              <span className="font-semibold">: {order?.payment?.status}</span>
            </div>

            {/* Order Summary */}
            <div className="bg-dark-gray/5 rounded-lg p-1 md:p-3.5">
              <h3 className="p-text-16 font-semibold max-md:p-3.5 md:mb-4">Order Summary</h3>

              {/* Items */}
              <div className="custom-scrollbar max-h-40 space-y-3 overflow-y-auto rounded-lg bg-gray-50 p-4">
                {order?.items?.map((item: any, i: number) => {
                  const topAttributes = item.attributes?.slice(0, 2) || [];

                  return (
                    <div key={i} className="flex gap-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-md">
                        <ImageWithFallback
                          fallbackSrc="/images/auth/logo.png"
                          src={item.thumbnail}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between md:gap-2">
                          <h4 className="p-text-16 line-clamp-2 font-semibold text-black">{item.productName}</h4>

                          <span className="p-text-18 font-semibold whitespace-nowrap">{item.totalPrice.toFixed(2)} BDT</span>
                        </div>

                        <div className="p-text-14 flex items-center gap-2 font-medium text-gray-600">
                          {topAttributes.map((attr: any, index: number) => (
                            <span key={index}>
                              {attr.name}: {attr.value}
                              {index < topAttributes.length - 1 && <span className="mx-1">|</span>}
                            </span>
                          ))}
                          {topAttributes.length > 0 && <span>|</span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="p-text-16 text-dark-gray mt-3 space-y-1.5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{order?.subtotal.toFixed(2)} BDT</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{order?.shippingFee.toFixed(2)} BDT</span>
                </div>

                {/* <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{order?.tax} BDT</span>
                </div> */}

                {order?.couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>Coupon Discount</span>
                    <span>- {order?.couponDiscount.toFixed(2)} BDT</span>
                  </div>
                )}

                <Separator className="my-3" />

                <div className="p-text-16 flex justify-between font-semibold text-black">
                  <span>Total</span>
                  <span>{order?.total.toFixed(2)} BDT</span>
                </div>
              </div>
            </div>
            <Link href={routes.publicRoutes.productList} className="w-full">
              <Button onClick={handleContinueShopping} className="bg-primary hover:bg-primary/80 h-12 w-full font-semibold text-white">
                CONTINUE SHOPPING
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
