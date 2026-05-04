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

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.BEST_DEALS);
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function VendorDetailPage({ params, searchParams }: PageProps) {
  const allParams = await params;
  const allSearchParams = await searchParams;

  return (
    <>
      <BreadCrumbSection
        options={[
          { slug: "/", name: "Home" },
          { slug: allRoutes.products, name: "Product List" },
          { slug: allRoutes.bestDeals, name: "Best Deals" },
        ]}
      />
      <Container className="pt-3 pb-4 md:pb-6 lg:pt-5 lg:pb-8 xl:pb-11">
        {/* <CouponCodeSection variant="dark" discount={38} code="FREE15FIRST" /> */}
        <h2 className="p-text-36 mb-2 font-bold capitalize max-lg:hidden md:pt-6 md:leading-11 lg:pt-7.5">Best Deals List</h2>
        <div className="flex gap-6 overflow-hidden">
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>
          <div className="w-full md:flex-1">
            <ActiveFilters sectionTitle="Best Deals List" />

            {/* Product Grid */}
            <Suspense key={JSON.stringify(params)} fallback={<ProductListSkeleton />}>
              <ProductList params={allSearchParams} variant="flash-sale" slug={allParams.slug} />
            </Suspense>
          </div>
        </div>
      </Container>
    </>
  );
}
