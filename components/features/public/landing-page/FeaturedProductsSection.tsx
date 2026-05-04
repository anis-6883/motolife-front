import { getProducts } from "@/actions/landing/product-action";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import routes from "@/config/routes";
import { IProductPublic } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProductCardVerticalSkeleton } from "../shared/ProductCardVerticalSkeleton";
import ProductGrid from "./FeaturedProductGrid";
import { LoadMoreButton } from "./LoadMoreButton";

export async function FeaturedProductsSection() {
  const productsData = await getProducts({ page: "1", limit: "12", isFeatured: "true" });
  const products: IProductPublic[] = productsData?.data?.data?.docs || [];

  return (
    <section className="gap100 bg-white">
      <div className="">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-2 2xl:gap-8">
          {/* Right - Product Carousel */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="p-text-36 pb-2 font-bold uppercase md:pb-6 md:leading-11">Featured Products</p>
              {/* {products.length > 4 ? (
                <Link
                  href={`${routes.publicRoutes.productList}?isFeatured=true&page=1`}
                  className="text-primary text-xs underline md:hidden"
                >
                  View All
                </Link>
              ) : null} */}
            </div>
            <ProductGrid products={products} />
            {products.length > 4 ? (
              <div className="flex justify-center pt-2 max-md:hidden md:pt-6">
                <Button
                  className={`hover:border-primary h-8 rounded-md border border-black bg-white px-8 font-semibold text-black uppercase transition-colors duration-500 hover:bg-black hover:text-white md:h-10`}
                  asChild
                >
                  <Link href={`${routes.publicRoutes.productList}?isFeatured=true&page=1`}>
                    Explore More <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <LoadMoreButton
        url={`${routes.publicRoutes.productList}?isFeatured=true`}
        willBeHidden={products.length < 8}
        extraClassName="md:hidden pt-4"
      />
    </section>
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <section className="gap100 bg-white">
      <div className="">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-2 2xl:gap-8">
          {/* Right - Product Carousel */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="p-text-36 pb-3 leading-11 font-bold uppercase md:pb-6">Featured Products</p>
            </div>
            <div className="grid grid-cols-4 gap-x-5 gap-y-6 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <ProductCardVerticalSkeleton key={index} />
              ))}
            </div>
            <div className="flex justify-center pt-6">
              <Skeleton className="h-12 w-48 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
