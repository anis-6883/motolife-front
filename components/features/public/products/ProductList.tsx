import { getAllOfferProducts, getComboProducts, getProducts } from "@/actions/landing/product-action";
import { IProductPublic, ProductListVariant } from "@/lib/types";
import { PackageSearch } from "lucide-react";
import { ProductCardVertical } from "../shared/ProductCardVertical";
import ProductPagination from "./ProductPagination";

export default async function ProductList({
  params,
  variant = "products",
  slug,
}: {
  params: Record<string, string | string[] | undefined>;
  variant?: ProductListVariant;
  slug?: string;
}) {
  const flatParams: Record<string, string> = { limit: "12", isPublished: "true" };

  Object.entries(params || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      flatParams[key] = value[0];
    } else if (value !== undefined) {
      flatParams[key] = value;
    }
  });

  const getAllProducts =
    variant === "products"
      ? getProducts
      : variant === "combo-offers"
        ? getComboProducts
        : variant === "flash-sale"
          ? getAllOfferProducts
          : getProducts;
  const { data } = await getAllProducts(flatParams, slug);
  console.log(data, "product lsit");
  const products: IProductPublic[] = data?.data?.docs;
  const pagination = data?.data?.pagination;

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <PackageSearch className="size-16 text-gray-300" strokeWidth={1.5} />
        <div className="space-y-1">
          <p className="text-lg font-semibold text-gray-700">No products found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters or search to find what you&apos;re looking for.</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {variant === "seller-profile" ? (
        <div className="grid grid-cols-3 gap-1 space-y-4 pt-4 md:gap-4 md:pt-6 lg:pt-7.5 xl:grid-cols-3">
          {products.map((product: any) => (
            <ProductCardVertical MobileGridVal={3} key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 space-y-4 pt-4 md:grid-cols-3 md:gap-4 md:pt-6 lg:pt-7.5 xl:grid-cols-4">
          {products.map((product: any, index: number) => (
            <ProductCardVertical
              MobileGridVal={3}
              // className={index % 2 === 1 ? "max-md:-translate-y-6" : ""}
              key={product._id}
              product={product}
              isComboProduct={variant === "combo-offers"}
            />
          ))}
        </div>
      )}
      {/* Pagination Section */}
      <ProductPagination pagination={pagination} />
    </>
  );
}
