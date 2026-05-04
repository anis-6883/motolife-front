import { getCart, getShippingSettings } from "@/actions/cart/cart-actions";
import CheckoutPage from "@/components/features/public/checkout/CheckoutPage";
import BreadCrumbSection from "@/components/features/public/shared/BreadCrumbSection";
import GoBackButton from "@/components/features/public/shared/GoBackButton";
import { Container } from "@/components/ui/container";
import { allRoutes } from "@/config/constant";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { ShippingSettings } from "@/lib/types";
import { getCookie } from "cookies-next/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.CHECKOUT);

const page = async () => {
  const shippingSettings = await getShippingSettings();
  const guestId = await getCookie("guestId", { cookies });
  const cart = await getCart(guestId, !!guestId);
  return (
    <>
      <BreadCrumbSection
        options={[
          { slug: "/", name: "Home" },
          { slug: allRoutes.cart, name: "Cart" },
          { slug: allRoutes.checkout, name: "Checkout" },
        ]}
      />
      <Container className="bg-white md:pt-5">
        <GoBackButton h1Text="Checkout" btnClassName="max-md:hidden" h1ClassName="max-md:py-0" />
        <Suspense fallback={<div>Loading...</div>}>
          <CheckoutPage
            shippingSettings={shippingSettings.data.data as ShippingSettings}
            cartData={cart?.data?.data?.items}
            cartId={cart?.data?.data?._id}
          />
        </Suspense>
      </Container>
    </>
  );
};

export default page;
