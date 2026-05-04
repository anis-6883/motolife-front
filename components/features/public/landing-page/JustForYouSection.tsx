"use client";

import { getProducts } from "@/actions/landing/product-action";
import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IProductPublic } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCardVertical } from "../shared/ProductCardVertical";

export default function JustForYouList({
  initialProducts,
  initialPage,
  totalPages,
  params,
}: {
  initialProducts: IProductPublic[];
  initialPage: number;
  totalPages: number;
  params: Record<string, string>;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const isMobile = useMediaQuery(768);

  const loadMore = useCallback(async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);

    const nextPage = page + 1;

    const res = await getProducts({
      ...params,
      page: String(nextPage),
    });

    const newProducts = res?.data?.data?.docs || [];

    setProducts((prev) => [...prev, ...newProducts]);
    setPage(nextPage);
    setLoading(false);
  }, [loading, page, totalPages, params]);

  // 📱 Infinite scroll (mobile only)
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentRef = loaderRef.current;

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [isMobile, loadMore]);
  return (
    <section className="gap100">
      <h4 className="p-text-36 pb-2 font-bold uppercase md:pb-6 md:leading-11">Just For You</h4>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product) => (
          <ProductCardVertical key={`${product._id}`} product={product} />
        ))}
      </div>

      {/* 🖥️ Desktop Load More */}
      {!isMobile && page < totalPages && (
        <div className="flex justify-center pt-10">
          <Button
            onClick={loadMore}
            disabled={loading}
            className={`hover:border-primary h-8 rounded-md border border-black bg-white px-8 font-semibold text-black uppercase transition-colors duration-500 hover:bg-black hover:text-white md:h-10`}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {loading && (
        <div className="text-primary flex justify-center pt-10">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {isMobile && <div ref={loaderRef} className="h-1" />}
    </section>
  );
}
