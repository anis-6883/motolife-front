import BrandsGrid from "@/components/features/public/brands/BrandsGrid";
import BrandsSkeleton from "@/components/features/public/brands/BrandsSkeleton";
import BreadCrumbSection from "@/components/features/public/shared/BreadCrumbSection";
import { Container } from "@/components/ui/container";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.BRANDS);
const page = async () => {
  return (
    <>
      <BreadCrumbSection
        options={[
          { slug: "/", name: "Home" },
          { slug: "/brands", name: "Brands" },
        ]}
      />
      <Container>
        <div className="pt-3 pb-4 md:pb-6 lg:pt-5 lg:pb-8 xl:pb-11">
          <p className="md:p-text-30 pb-2 text-sm font-bold -tracking-[0.3px] md:pb-6">Brands</p>
          <div className="grid grid-cols-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <Suspense fallback={<BrandsSkeleton />}>
              <BrandsGrid />
            </Suspense>
          </div>
        </div>
      </Container>
    </>
  );
};

export default page;
