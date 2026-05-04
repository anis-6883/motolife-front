import CartSection from "@/components/features/public/cart/CartSection";
import BreadCrumbSection from "@/components/features/public/shared/BreadCrumbSection";
import GoBackButton from "@/components/features/public/shared/GoBackButton";
import { Container } from "@/components/ui/container";
import { allRoutes } from "@/config/constant";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";
export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.CART);

const page = () => {
  return (
    <>
      <BreadCrumbSection
        options={[
          { slug: "/", name: "Home" },
          { slug: allRoutes.cart, name: "Cart" },
        ]}
      />
      <Container className="bg-white pt-5">
        <GoBackButton h1Text="Shopping Cart" btnClassName="max-md:hidden" h1ClassName="max-md:py-0" />
        <CartSection />
      </Container>
    </>
  );
};

export default page;
