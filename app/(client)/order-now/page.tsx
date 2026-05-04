import { getShippingSettings } from "@/actions/cart/cart-actions";
import OrderNowPage from "@/components/features/public/checkout/OrderNowPage";
import BreadCrumbSection from "@/components/features/public/shared/BreadCrumbSection";
import GoBackButton from "@/components/features/public/shared/GoBackButton";
import { Container } from "@/components/ui/container";
import { allRoutes } from "@/config/constant";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { ShippingSettings } from "@/lib/types";
import { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.CHECKOUT);

const page = async () => {
  const shippingSettings = await getShippingSettings();
  return (
    <>
      <BreadCrumbSection
        options={[
          { slug: "/", name: "Home" },
          { slug: allRoutes.cart, name: "Cart" },
          { slug: allRoutes.orderNow, name: "Order Now" },
        ]}
      />
      <Container className="bg-white pb-0 md:pt-5">
        <GoBackButton h1Text="Order Now" btnClassName="max-md:hidden" h1ClassName="max-md:py-0" />
        <Suspense fallback={<div>Loading...</div>}>
          <OrderNowPage shippingSettings={shippingSettings.data.data as ShippingSettings} />
        </Suspense>
      </Container>
    </>
  );
};

export default page;
