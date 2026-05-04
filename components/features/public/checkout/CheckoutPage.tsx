"use client";

import { createOrder } from "@/actions/cart/cart-actions";
import { getBusinessSettings } from "@/actions/landing/settings-action";
import { Icons } from "@/components/icons";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import routes from "@/config/routes";
import useIsMobile from "@/hooks/useIsMobile";
import { onError } from "@/lib/client-utils";
import { ShippingSettings } from "@/lib/types";
import { useCartStore } from "@/store/cart/cartStore";
import useUserProfile from "@/store/useUserProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { CartItemResponse } from "../../../../store/cart/Cart-types";
import LoginModal from "../../auth/LoginModal";
import { sampleOrderData } from "../products/constants";
import { CheckoutConfirmationModal } from "./CheckoutConfirmationModal";
import { CheckoutContactSection } from "./CheckoutContactSection";
import { CheckoutDeliveryAddress } from "./CheckoutDeliveryAddress";
import { CheckoutDeliveryAddress2 } from "./CheckoutDeliveryAddress2";
import { CheckoutPaymentMethod } from "./CheckoutPaymentMethod";
import { checkoutFormSchema, CheckoutFormValues } from "./schema";

export type TSampleOrderData = typeof sampleOrderData;

export default function CheckoutPage({
  shippingSettings,
  cartData,
  cartId,
}: {
  shippingSettings: ShippingSettings;
  cartData: CartItemResponse[];
  cartId?: string;
}) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [resetAddress, setResetAddress] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?.id as string | undefined;
  const { userData } = useUserProfile();

  const [orderSettings, setOrderSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await getBusinessSettings("order");
      if (res?.data?.status) {
        setOrderSettings(res.data?.data?.order);
      }
    };
    fetchSettings();
  }, []);

  // ─── Store ──────────────────────────────────────────────────────────────────
  const { checkoutSource, checkoutItems, clearCart, clearCheckout } = useCartStore();
  // const cartItems = useCartItems();
  // const items = checkoutSource === "buy-now" ? checkoutItems : cartItems;

  // const { subtotal, tax } = useCartTotals();
  // const itemsSubtotal = checkoutSource === "buy-now" ? checkoutItems.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0) : subtotal;
  const itemsSubtotal = cartData?.reduce((sum, i) => sum + i.totalPrice, 0) ?? 0;

  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      deliveryType: undefined,
      billingAddress: "same",
      // paymentMethod: "cash",
      // emailOffers: false,
      // saveInfo: false,
      // smsOffers: false,
      agreeToPolicies: true,
      fullName: userData?.fullName ?? "",
      phone: userData?.phone ?? "",
      // email: userData?.email ?? "",
      address: "",
      thana: "",
      district: "",
    },
  });
  useEffect(() => {
    if (!userData) return;

    const currentValues = methods.getValues();

    methods.reset({
      ...currentValues,
      fullName: currentValues.fullName || userData.fullName || "",
      phone: currentValues.phone || userData.phone || "",
      // email: currentValues.email || userData.email || "",
    });
  }, [userData, methods]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginModalHeader, setLoginModalHeader] = useState("Welcome Back");
  const [loginModalSubHeader, setLoginModalSubHeader] = useState(
    "Join & enjoy exclusive deals on helmets, engine oils, gloves, jackets & premium accessories."
  );
  const onSubmit = async (data: CheckoutFormValues) => {
    if (!orderSettings?.guestCheckoutEnabled && !userData) {
      setIsLoginModalOpen(true);
      setResetAddress(!resetAddress);
      return;
    }

    setIsSubmitting(true);
    const shippingAddress = {
      fullName: data.fullName,
      phone: data.phone,
      // email: data.email,
      address: data.address,
      thana: data.thana,
      district: data.district,
    };

    const billingAddress =
      data.billingAddress === "same"
        ? shippingAddress
        : {
            fullName: data.billing?.fullName ?? "",
            phone: data.billing?.phone ?? "",
            // email: data.billing?.email ?? "",
            address: data.billing?.address ?? "",
            thana: data.billing?.thana ?? "",
            // area: data.billing?.area ?? "",
            district: data.billing?.district ?? "",
          };

    const identifier = userId ?? userData?._id;
    // if (!identifier) {
    //   Toast.error("Please log in to complete your order");
    //   setIsSubmitting(false);
    //   return;
    // }

    // const { data: cartData } = await getCart(identifier);
    // const cartId = cartData?.data?._id;
    // const cartItems = cartData?.data?.items ?? [];

    // if (!cartId) {
    //   Toast.error("Cart not found. Please add items and try again.");
    //   setIsSubmitting(false);
    //   return;
    // }
    const subtotal = cartData.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
    // const subtotal = cartData.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const deliveryCharge = Number(data.deliveryType || 0);

    const total = subtotal + deliveryCharge;

    const orderPayload = {
      cartId,
      shippingAddress,
      billingAddress,
      paymentMethod: "CASH",
      customerNote: data.orderNote ?? "",
      deliveryCharge,
      subtotal,
      total,
    };
    const res = await createOrder(orderPayload);

    if ((res as any)?.error) {
      if ((res as any)?.error === "Please login to continue!") {
        setLoginModalHeader("Login to continue");
        setLoginModalSubHeader("Please login to complete your order!");
        setIsLoginModalOpen(true);
        setResetAddress(!resetAddress);
      } else {
        Toast.error((res as any)?.error ?? "Order failed");
      }
      setIsSubmitting(false);
      return;
    }
    if (checkoutSource === "cart") clearCart();
    clearCheckout();

    setOrderData(res.data as any);
    setConfirmationOpen(true);
    setIsSubmitting(false);
  };
  const total =
    itemsSubtotal +
    // + tax
    Number(methods.watch("deliveryType") || 0);
  useEffect(() => {
    if (resetAddress) {
      methods.reset({
        deliveryType: undefined,
        billingAddress: "same",
        agreeToPolicies: true,
        address: "",
        thana: "",
        district: "",
      });
      setResetAddress(!resetAddress);
    }
  }, [resetAddress]);
  return (
    <div className="min-h-screen bg-white">
      <div className="md:py-4 lg:py-5 xl:py-7.5">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <div className="grid grid-cols-1 gap-1 md:gap-4 lg:grid-cols-[1.4fr_1fr] xl:gap-12">
              <div className="space-y-2 md:space-y-3 lg:space-y-5 xl:space-y-7.5">
                {!userData ? (
                  <div className="border-primary/50 bg-foundation-red/50 p-text-18 flex items-center rounded-lg border px-5 py-1 text-black max-md:flex-wrap max-md:justify-center md:gap-2 md:py-3.5">
                    Returning customer?{" "}
                    <Button
                      variant="link"
                      className="text-black hover:no-underline"
                      type="button"
                      onClick={() => setIsLoginModalOpen(true)}
                    >
                      <p className="p-text-18 font-semibold -tracking-[0.18px] capitalize">Click here to Login</p>
                    </Button>
                    <LoginModal
                      loginModalHeader={loginModalHeader}
                      loginModalSubHeader={loginModalSubHeader}
                      open={isLoginModalOpen}
                      onOpenChange={setIsLoginModalOpen}
                      stateUpdater={() => setResetAddress(!resetAddress)}
                    />
                  </div>
                ) : null}

                <CheckoutContactSection />

                {!userData ? (
                  <CheckoutDeliveryAddress shippingSettings={shippingSettings} />
                ) : (
                  <CheckoutDeliveryAddress2 shippingSettings={shippingSettings} addresses={userData?.addresses || []} />
                )}

                <CheckoutPaymentMethod />
              </div>

              {/* ── Order Summary ──────────────────────────────────────────── */}
              <div>
                <div className="bg-dark-gray/5 sticky rounded-lg p-2 max-md:pb-14 md:top-32 md:space-y-7 md:p-5">
                  <div className="flex items-center gap-2">
                    <Icons.cart />
                    <h2 className="p-text-20 font-medium">In Your Cart</h2>
                  </div>

                  {/* ── Item List ──────────────────────────────────────────── */}
                  <CartItemList cartData={cartData} />

                  {/* ── Summary Totals ─────────────────────────────────────── */}
                  <div className="p-text-16 leading-6 text-[#777] md:space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{itemsSubtotal.toFixed(2)} BDT</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span>TAX</span>
                      <span>{tax} BDT</span>
                    </div> */}
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>{methods.watch("deliveryType") ? `${methods.watch("deliveryType")} BDT` : "—"}</span>
                    </div>
                    <div className="bg-border h-px w-full md:my-4" />
                    <div className="p-text-16 flex items-center justify-between font-semibold text-black">
                      <span className="font-medium">TOTAL</span>
                      <span className="font-medium">{total.toFixed(2)} BDT</span>
                    </div>
                  </div>

                  {cartData?.length <= 0 ? (
                    <Link href={routes.publicRoutes.productList} className="max-md:hidden">
                      <Button type="button" variant="black" className="w-full">
                        <span className="p-text-14">Continue Shopping</span>
                      </Button>
                    </Link>
                  ) : (
                    <>
                      {/* ── Policies ───────────────────────────────────────────── */}
                      <div className="space-y-2 max-md:hidden">
                        <div className="flex items-start space-x-2">
                          <Controller
                            name="agreeToPolicies"
                            control={methods.control}
                            render={({ field }) => (
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1 data-[state=checked]:border-black data-[state=checked]:bg-black"
                              />
                            )}
                          />
                          <Label className="cursor-pointer">
                            <p className="p-text-16 leading-6 text-[#777]">
                              I agree with the{" "}
                              <Link href="#" className="text-black underline">
                                Terms & Conditions
                              </Link>{" "}
                              <span className="text-black">and</span>{" "}
                              <Link href="#" className="text-black underline">
                                Privacy Policy
                              </Link>
                            </p>
                          </Label>
                        </div>

                        {methods.formState.errors.agreeToPolicies && (
                          <p className="p-text-14 text-destructive">{methods.formState.errors.agreeToPolicies.message}</p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        variant="black"
                        className="w-full disabled:cursor-not-allowed disabled:opacity-50 max-md:hidden"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Icons.spinner className="h-4 w-4 animate-spin" /> : null}{" "}
                        <span className="p-text-14">Complete Purchase</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="fixed right-0 bottom-0 left-0 z-20 bg-white p-2 shadow-lg md:hidden">
              <div className="space-y-1">
                {/* Complete Purchase Button */}
                {cartData?.length <= 0 ? (
                  <Link href={routes.publicRoutes.productList}>
                    <Button type="button" variant="black" className="w-full">
                      <span className="p-text-14">Continue Shopping</span>
                    </Button>
                  </Link>
                ) : (
                  <>
                    {/* Agreement Checkbox */}
                    <div className="flex items-start space-x-2">
                      <Controller
                        name="agreeToPolicies"
                        control={methods.control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1 data-[state=checked]:border-black data-[state=checked]:bg-black"
                          />
                        )}
                      />
                      <Label className="cursor-pointer">
                        <p className="p-text-16 leading-6 text-[#777]">
                          I agree with the{" "}
                          <Link href="#" className="text-black underline">
                            Terms & Conditions
                          </Link>{" "}
                          <span className="text-black">and</span>{" "}
                          <Link href="#" className="text-black underline">
                            Privacy Policy
                          </Link>
                        </p>
                      </Label>
                    </div>

                    {methods.formState.errors.agreeToPolicies && (
                      <p className="p-text-14 text-destructive">{methods.formState.errors.agreeToPolicies.message}</p>
                    )}
                    <Button
                      type="submit"
                      variant="black"
                      className="w-full disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Icons.spinner className="h-4 w-4 animate-spin" /> : null}
                      <span className="p-text-14">Complete Purchase</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      {orderData && <CheckoutConfirmationModal open={confirmationOpen} onOpenChange={setConfirmationOpen} orderData={orderData} />}
    </div>
  );
}
function CartItemList({ cartData }: { cartData: CartItemResponse[] }) {
  const PREVIEW_COUNT = 2;
  const [showAll, setShowAll] = useState(false);
  const hiddenCount = (cartData?.length ?? 0) - PREVIEW_COUNT;
  const isMobile = useIsMobile();
  const visibleItems = isMobile ? (showAll ? cartData : cartData?.slice(0, PREVIEW_COUNT)) : cartData;

  if (cartData?.length === 0) {
    return <p className="text-dark-gray p-text-14 py-4 text-center">No items in cart.</p>;
  }

  return (
    <div className="rounded-lg md:border md:p-2.5">
      <div
        className={`custom-scrollbar divide-y overflow-hidden transition-all duration-1000 ease-in-out ${showAll ? "max-h-[500px] opacity-100" : "max-h-[180px] opacity-95"} md:max-h-80 md:overflow-y-scroll`}
      >
        <div className="transition-all duration-1000">
          {visibleItems?.map((item, index) => (
            <div key={`${item.product}-${item.variantSku}-${index}`} className="flex gap-3 py-2">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-gray-100 md:size-20">
                <ImageWithFallback
                  fallbackSrc="/images/auth/logo.png"
                  src={item.thumbnail}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2 md:mb-2">
                  <h3 className="p-text-18 line-clamp-2 font-semibold -tracking-[0.18px] text-gray-900 max-md:leading-4">
                    {item.productName}
                  </h3>
                  <span className="p-text-18 font-semibold -tracking-[0.18px] whitespace-nowrap text-gray-900">
                    {item.totalPrice.toFixed(2)} BDT
                  </span>
                </div>
                <div className="text-dark-gray p-text-16 mb-2 flex items-center gap-1 leading-3 md:gap-2 md:leading-6">
                  {item.variantSku || item.variation ? (
                    <>
                      <span className="flex flex-nowrap">
                        Variant:{" "}
                        {item.isCombo ? (
                          <span className="ml-1 font-semibold">Combo</span>
                        ) : (
                          <span className="ml-1 font-semibold">{item.variation || item.variantSku}</span>
                        )}
                      </span>
                      <span className="h-2 w-px bg-black/50" />
                    </>
                  ) : null}
                  <span className="flex flex-nowrap">
                    Qty: <span className="ml-1 font-semibold">{item.quantity}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show more/less — mobile only */}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="p-text-14 mt-2 flex w-full items-center justify-center gap-1 text-[#777] md:hidden"
        >
          {showAll ? (
            <>
              Show less <ChevronUp className="size-4" />
            </>
          ) : (
            <>
              +{hiddenCount} more item{hiddenCount > 1 ? "s" : ""} <ChevronDown className="size-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
