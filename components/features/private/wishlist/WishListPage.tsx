"use client";

import { useEffect, useState } from "react";
import { PaginationSection } from "../../public/shared/PaginationSection";
import { ProductCardV } from "../../public/shared/ProductCardV";
import { getWishList } from "@/actions/landing/wishList-action";

const WishListPage = () => {
  const ITEMS_PER_PAGE = 9;

  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ API CALL
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);

        const res = await getWishList();

        const docs = res?.data?.data?.data.docs || [];

        // normalize product
        const wishlistProducts = docs
          .map((item: any) => {
            if (item.product && typeof item.product === "object") {
              return item.product;
            }
            if (item.comboProduct && typeof item.comboProduct === "object") {
              return item.comboProduct;
            }
            return null;
          })
          .filter(Boolean);

        setProducts(wishlistProducts);
      } catch (err) {
        console.error("Wishlist API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // pagination
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedProducts = products.slice(startIndex, endIndex);

  if (loading) {
    return <p className="p-4">Loading wishlist...</p>;
  }

  return (
    <div>
      <h2 className="p-text-24 mb-2 font-semibold max-md:text-base md:mb-4 xl:mb-6">My Wishlist</h2>

      {products.length === 0 ? (
        <p className="p-4 text-gray-500">No wishlist items found</p>
      ) : (
        <>
          <div className="grid-cols-1 gap-4 space-y-4 pt-4 md:grid md:pt-6 lg:pt-7.5 xl:grid-cols-3">
            {paginatedProducts.map((p) => (
              <ProductCardV key={p._id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pt-10 md:pt-16 lg:pt-20">
              <PaginationSection
                hideleftPortion={true}
                currentPage={currentPage}
                totalItems={totalItems}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={(page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)))}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WishListPage;
