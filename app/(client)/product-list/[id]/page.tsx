import { getProductBySlug, getRelatedProducts } from "@/actions/landing/product-action";
import ProductDetailsPage from "@/components/features/public/product-detail/ProductDetailPage";
import BreadCrumbSection, { Option } from "@/components/features/public/shared/BreadCrumbSection";
import { CarouselProductListSection } from "@/components/features/public/shared/CarouselProductList";
import { Container } from "@/components/ui/container";
import { allRoutes } from "@/config/constant";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.PRODUCT_DETAIL);
interface PageProps {
  params: Promise<{ id: string }>;
}
const page = async ({ params }: PageProps) => {
  const { id } = await params;

  const productRes = await getProductBySlug(id);
  const productData = productRes?.data?.data;
  console.log(productData);
  const relatedProductsPromise = productData?._id ? getRelatedProducts(productData?._id) : Promise.resolve(null);

  const relatedProductsRes = await relatedProductsPromise;
  const relatedProducts = relatedProductsRes?.data?.data;
  const breadCrumbOptions: Option[] = [
    { slug: "/", name: "Home" },
    { slug: allRoutes.products, name: "Products" },
  ];

  if (productData?.category?.name) {
    breadCrumbOptions.push({
      slug: `${allRoutes.products}?category=${productData.category.name}`,
      name: productData.category.name,
    });
  }

  if (productData?.subCategory?.name) {
    breadCrumbOptions.push({
      slug: `${allRoutes.products}?subCategory=${productData.subCategory.name}`,
      name: productData.subCategory.name,
    });
  }

  breadCrumbOptions.push({
    slug: "#",
    name: productData?.name || "Product Details",
  });
  return (
    <div id="productDetail">
      <BreadCrumbSection options={breadCrumbOptions} />

      <Container className="bg-white md:pt-5">
        <ProductDetailsPage product={productData} />

        {relatedProducts && relatedProducts?.docs?.length > 0 && (
          <CarouselProductListSection products={relatedProducts.docs} title="Related Products" viewAllURL={allRoutes.products} />
        )}
      </Container>
      <div className="max-md:h-4"></div>
    </div>
  );
};
export default page;
