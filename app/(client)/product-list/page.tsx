import { ActiveFilters } from "@/components/features/public/products/ActiveFilters";
import { FilterSidebar } from "@/components/features/public/products/FilterSidebar";
import ProductList from "@/components/features/public/products/ProductList";
import ProductListSkeleton from "@/components/features/public/products/ProductListSkeleton";
import BreadCrumbSection from "@/components/features/public/shared/BreadCrumbSection";
import { Container } from "@/components/ui/container";
import { allRoutes } from "@/config/constant";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.PRODUCT_LIST);
export default async function Page({ searchParams }: PageProps<"/product-list">) {
  const params = await searchParams;

  return (
    <>
      <BreadCrumbSection
        options={[
          { slug: "/", name: "Home" },
          { slug: allRoutes.products, name: "Product List" },
        ]}
      />
      <Container className="pt-0 pb-4 md:pb-6 lg:pt-5 lg:pb-8 xl:pb-11">
        <h2 className="p-text-36 mb-2 font-bold capitalize max-lg:hidden md:pt-6 md:leading-11 lg:pt-7.5">Product List</h2>
        {/* <CouponCodeSection variant="dark" discount={38} code="FREE15FIRST" /> */}
        <div className="flex gap-6 overflow-hidden">
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>
          <div className="w-full md:flex-1">
            <ActiveFilters sectionTitle="Product List" />
            {/* Product Grid */}
            <Suspense key={JSON.stringify(params)} fallback={<ProductListSkeleton />}>
              <ProductList params={params} />
            </Suspense>
          </div>
        </div>
      </Container>
    </>
  );
}
