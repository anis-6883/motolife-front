import BreadCrumbSection from "@/components/features/public/shared/BreadCrumbSection";
import TrackOrderPage from "@/components/features/public/track-order/TrackOrderPage";
import { Container } from "@/components/ui/container";
import { allRoutes } from "@/config/constant";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";
export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.TRACK_ORDER);

const page = () => {
  return (
    <>
      <BreadCrumbSection
        options={[
          { slug: "/", name: "Home" },
          { slug: allRoutes.cart, name: "Cart" },
          { slug: allRoutes.checkout, name: "Checkout" },
          { slug: allRoutes.trackOrder, name: "Track Order" },
        ]}
      />
      <Container className="bg-white pt-5">
        <TrackOrderPage />
      </Container>
    </>
  );
};

export default page;
