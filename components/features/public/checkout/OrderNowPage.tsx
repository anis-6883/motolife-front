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
import { onError } from "@/lib/client-utils";
import { ShippingSettings } from "@/lib/types";
import { useCartStore } from "@/store/cart/cartStore";
import useUserProfile from "@/store/useUserProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import LoginModal from "../../auth/LoginModal";
import { sampleOrderData } from "../products/constants";
import { CheckoutConfirmationModal } from "./CheckoutConfirmationModal";
import { CheckoutContactSection } from "./CheckoutContactSection";
import { CheckoutDeliveryAddress } from "./CheckoutDeliveryAddress";
import { CheckoutDeliveryAddress2 } from "./CheckoutDeliveryAddress2";
import { CheckoutPaymentMethod } from "./CheckoutPaymentMethod";
import { checkoutFormSchema, CheckoutFormValues } from "./schema";

export type TSampleOrderData = typeof sampleOrderData;

export default function OrderNowPage({ shippingSettings }: { shippingSettings: ShippingSettings }) {
  const { orderNowItem: cartData, clearOrderNow } = useCartStore();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [resetAddress, setResetAddress] = useState(false);
  const { userData } = useUserProfile();
  console.log({ userData });
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
  // const { checkoutSource, checkoutItems,   } = useCartStore();
  // const itemsSubtotal = cartData.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0);

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
      //   zipCode: "",
      fullName: "",
      phone: "",
      // email: "",
      address: "",
      thana: "",
      //   area: "",
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
      //   area: data.area,
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

    // const identifier = userId ?? userData?._id;
    // if (!identifier) {
    //   Toast.error("Please log in to complete your order");
    //   setIsSubmitting(false);
    //   return;
    // }

    // const { data: cartData } = await getCart(identifier);
    // console.log(identifier, "identifier", cartData, "cartData");
    // const cartId = cartData?.data?._id;
    // const cartItems = cartData?.data?.items ?? [];

    // if (!cartId) {
    //   Toast.error("Cart not found. Please add items and try again.");
    //   setIsSubmitting(false);
    //   return;
    // }
    // const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const deliveryCharge = Number(data.deliveryType || 0);

    // const total = subtotal + deliveryCharge;

    const orderPayload = {
      // cartId,
      items: [cartData],
      shippingAddress,
      billingAddress,
      paymentMethod: "CASH",
      customerNote: data.orderNote ?? "",
      deliveryCharge,
      // subtotal,
      // total,
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
    // if (checkoutSource === "cart") clearCart();
    // clearCheckout();
    clearOrderNow();
    setOrderData(res.data as any);
    setConfirmationOpen(true);
    setIsSubmitting(false);
  };

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

  // const total =
  //   itemsSubtotal +
  //   // + tax
  //   Number(methods.watch("deliveryType") || 0);

  return (
    <div className="min-h-screen bg-white">
      {/* {cartData ? ( */}
      <div className="md:py-4 lg:py-5 xl:py-7.5">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <div className="grid grid-cols-1 gap-1 md:gap-4 lg:grid-cols-[1.4fr_1fr] xl:gap-12">
              {/* custom-scrollbar overflow-y-auto max-lg:max-h-[30vh] max-md:max-h-[25vh] */}
              <div className="md:space-y-3 lg:space-y-5 xl:space-y-7.5">
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
                    <h2 className="p-text-20 font-medium">Order Now</h2>
                  </div>

                  {/* ── Item List ──────────────────────────────────────────── */}
                  {cartData ? (
                    <div className="custom-scrollbar divide-y overflow-y-scroll rounded-lg md:max-h-80 md:border md:p-2.5">
                      <div className="flex gap-3 py-2">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-gray-100 md:size-20">
                          <ImageWithFallback
                            fallbackSrc="/images/auth/logo.png"
                            src={cartData?.thumbnail}
                            alt={cartData?.name || ""}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2 md:mb-2">
                            <h3 className="p-text-18 line-clamp-2 font-semibold -tracking-[0.18px] text-gray-900">{cartData?.name}</h3>
                            <span className="p-text-18 font-semibold -tracking-[0.18px] whitespace-nowrap text-gray-900">
                              {cartData?.sellingPrice} BDT
                            </span>
                          </div>

                          <div className="text-dark-gray p-text-16 mb-2 flex items-center gap-1 leading-6 md:gap-2">
                            {cartData?.variation || cartData?.variantSku ? (
                              <>
                                <span className="flex flex-nowrap">
                                  Variant: <span className="ml-1 font-semibold">{cartData?.variation || cartData?.variantSku}</span>
                                </span>
                                <span className="h-2 w-px bg-black/50" />
                              </>
                            ) : null}
                            <span className="flex flex-nowrap">
                              Qty: <span className="ml-1 font-semibold">{cartData?.quantity}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="p-text-16 leading-6 text-[#777] md:space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{((cartData?.quantity ?? 0) * (cartData?.sellingPrice ?? 1)).toFixed(2)} BDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>{methods.watch("deliveryType") ? `${Number(methods.watch("deliveryType")).toFixed(2)} BDT` : "—"}</span>
                    </div>
                    <div className="bg-border h-px w-full md:my-4" />
                    <div className="p-text-16 flex items-center justify-between font-semibold text-black">
                      <span className="font-medium">TOTAL</span>
                      {cartData ? (
                        <span className="font-medium">
                          {(cartData?.quantity * cartData?.sellingPrice + Number(methods.watch("deliveryType") ?? 0)).toFixed(2)} BDT
                        </span>
                      ) : (
                        <span className="font-medium">0 BDT</span>
                      )}
                    </div>
                  </div>
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

                  {!cartData ? (
                    <Link href={routes.publicRoutes.productList}>
                      <Button type="button" variant="black" className="w-full">
                        <span className="p-text-14">Continue Shopping</span>
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      type="submit"
                      variant="black"
                      className="w-full disabled:cursor-not-allowed disabled:opacity-50 max-md:hidden"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Icons.spinner className="h-4 w-4 animate-spin" /> : null}{" "}
                      <span className="p-text-14">Complete Purchase</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="fixed right-0 bottom-0 left-0 z-20 bg-white p-2 shadow-lg md:hidden">
              <div className="space-y-1">
                {/* Complete Purchase Button */}
                {cartData ? (
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
                ) : (
                  <Link href={routes.publicRoutes.productList}>
                    <Button type="button" variant="black" className="w-full">
                      <span className="p-text-14">Continue Shopping</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
      {/* // ) : (
      //   <div className="flex h-full items-center justify-center">
      //     <Icons.spinner className="h-4 w-4 animate-spin" />
      //   </div>
      // )} */}

      {orderData && <CheckoutConfirmationModal open={confirmationOpen} onOpenChange={setConfirmationOpen} orderData={orderData} />}
    </div>
  );
}
