import { getComboProductBySlug } from "@/actions/landing/product-action";
import ProductDetailsPage from "@/components/features/public/product-detail/ProductDetailPage";
import BreadCrumbSection from "@/components/features/public/shared/BreadCrumbSection";
import { Container } from "@/components/ui/container";
import { allRoutes } from "@/config/constant";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.PRODUCT_DETAIL);

const page = async ({ params }: PageProps<"/combo-offers/[slug]">) => {
  const { slug } = await params;
  const {
    data: { data: product },
  } = await getComboProductBySlug(slug);

  return (
    <>
      <BreadCrumbSection
        options={[
          { slug: "/", name: "Home" },
          { slug: allRoutes.comboOffer, name: "Combo Offer" },
          { slug: "#", name: product?.name || "Product Details" },
        ]}
      />
      <Container className="bg-white pt-5">
        <ProductDetailsPage product={product} isComboProduct={true} />
        {/* <CarouselProductListSection products={allProducts} title="Related Products" />
        <CarouselProductListSection products={allProducts} title="Last Viewed " /> */}
      </Container>
    </>
  );
};

export default page;
