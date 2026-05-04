"use client";

import { ProductGallery } from "@/components/features/public/product-detail/ProductGallery";
import { IProdBenefit } from "@/components/features/public/product-detail/schemas";
import { VideoTab } from "@/components/features/public/product-detail/VideoTab";
import SanitizedContent from "@/components/features/public/shared/sanitizeContent";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import routes from "@/config/routes";
import { extractAttributes } from "@/lib/helpers";
import { IProduct } from "@/lib/types";
import { formatCompact, formatIndian } from "@/lib/utils";
import { AlertTriangle, BadgeCheck, Package, Pencil, Store } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import PremiumBenefits from "./PremiumBenefits";

export default function ProductDetailsAdmin({
  product,
  isCombo = false,
  vendorId,
}: {
  product: IProduct;
  isCombo?: boolean;
  vendorId?: string;
}) {
  let attributes;
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  if (product?.variants) {
    attributes = extractAttributes(product?.variants);
  }
  const productTags = [
    { label: "Featured", value: "isFeatured" },
    { label: "Newly Added", value: "isNewArrived" },
    { label: "Upcoming", value: "isUpcoming" },
    { label: "Published", value: "isPublished" },
  ];

  return (
    <div className="space-y-3 md:space-y-5">
      <div className="space-y-3 md:space-y-5">
        <div className="flex gap-5 text-black max-xl:flex-col">
          <div className="flex-1 space-y-2 md:space-y-3 lg:space-y-5">
            <div className="grid flex-1 gap-7 rounded-lg border p-2 md:p-3 lg:grid-cols-[1fr_1.3fr] lg:p-5 2xl:grid-cols-[1fr_1.8fr]">
              <ProductGallery product={product} activeIndex={activeMediaIndex} onChange={setActiveMediaIndex} />
              <div className="space-y-5 md:space-y-8 xl:space-y-10">
                <div className="flex items-start justify-between gap-3">
                  <h1 className="p-text-30 font-bold -tracking-[0.3px]">{product?.name}</h1>

                  <Link
                    href={
                      isCombo
                        ? vendorId
                          ? routes.privateRoutes.admin.userManagement.vendor.comboProductEdit(vendorId, product._id)
                          : routes.privateRoutes.admin.productManagement.comboOffer.edit(product?._id)
                        : vendorId
                          ? routes.privateRoutes.admin.userManagement.vendor.productEdit(vendorId, product._id)
                          : routes.privateRoutes.admin.productManagement.inHouseProduct.edit(product?._id)
                    }
                  >
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3 md:space-y-6">
                  <h2 className="p-text-20 font-semibold">General Information</h2>

                  <div className="text-dark-gray space-y-2 md:space-y-3 lg:space-y-5">
                    {product?.categoryName && <SingeListElement label="Category" value={product.categoryName} />}

                    {product?.subCategoryName && <SingeListElement label="Sub Category" value={product.subCategoryName} />}

                    {product?.brandName && <SingeListElement label="Brand" value={product.brandName} />}

                    {product?.unit && <SingeListElement label="Unit" value={product.unit} />}

                    {product?.sku && <SingeListElement label="Product SKU" value={product.sku} />}

                    {productTags && productTags?.length > 0 && (
                      <SingeListElement
                        label="Product Tags"
                        value={productTags
                          .filter((tag) => product?.[tag.value as keyof typeof product])
                          .map((tag) => tag.label)
                          .join(", ")}
                      />
                    )}
                    {product?.stockQuantity !== undefined && (
                      <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-3">
                        <div>
                          <p className="text-sm text-gray-500">Stock Quantity</p>
                          <p className="text-lg font-semibold">{formatCompact(product.stockQuantity)}</p>

                          {/* Stock status */}
                          <p
                            className={`mt-1 text-xs ${
                              product.stockQuantity === 0
                                ? "text-red-500"
                                : product.stockQuantity < 10
                                  ? "text-yellow-500"
                                  : "text-green-600"
                            }`}
                          >
                            {product.stockQuantity === 0 ? "Out of stock" : product.stockQuantity < 10 ? "Low stock" : "In stock"}
                          </p>
                        </div>

                        {isCombo ? null : (
                          <Link href={routes.privateRoutes.admin.productManagement.inHouseProduct?.showVariants(product?._id)}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              {product.stockQuantity < 10 ? (
                                <>
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" /> Manage Stock
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <Package className="h-4 w-4" /> Stock Details
                                </>
                              )}
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}

                    {product?.searchTags?.length > 0 && <SingeListElement label="Search Tags" value={product.searchTags.join(", ")} />}
                  </div>
                </div>
                <div className="space-y-3 md:space-y-6">
                  <h2 className="p-text-20 font-semibold">Price Information</h2>
                  <div className="text-dark-gray space-y-2 md:space-y-3 lg:space-y-5">
                    {product?.sellingPrice ? (
                      <SingeListElement label="Selling Price" value={`${formatIndian(product?.sellingPrice)} BDT`} />
                    ) : null}
                    {product?.buyingPrice ? (
                      <SingeListElement label="Buying Price" value={`${formatIndian(product?.buyingPrice)} BDT`} />
                    ) : null}
                    {product?.discountPrice ? (
                      <SingeListElement label="Discount Price" value={`${formatIndian(product?.discountPrice)} BDT`} />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            {product?.description && (
              <div className="space-y-2 rounded-lg border p-2 md:space-y-3 md:p-3 lg:space-y-5 lg:p-5">
                <p className="p-text-20 font-semibold">Product Description</p>
                <div className="p-text-16 5 5 rounded-lg border px-2 py-2 lg:min-h-50 lg:px-4 lg:py-3">
                  <SanitizedContent htmlString={product?.description} />
                </div>
              </div>
            )}

            {product?.videoLinks?.length > 0 && (
              <div className="space-y-2 rounded-lg border p-2 md:space-y-3 md:p-3 lg:space-y-5 lg:p-5">
                <p className="p-text-20 font-semibold">Product Video</p>
                <VideoTab videos={product?.videoLinks.map((video) => video.url)} />
              </div>
            )}
          </div>
          <div className="w-full shrink-0 space-y-4 xl:w-60 2xl:w-80">
            <div className="rounded-lg border p-3 md:p-5 lg:h-max">
              {product.quantitySold !== undefined ? (
                <>
                  <p className="p-text-16 leading-6">Total Quantity Sold</p>
                  <p className="p-text-24 text-primary font-semibold -tracking-[0.24px]">{formatCompact(product?.quantitySold) ?? "0"}</p>
                </>
              ) : null}
              {product.totalOrderAmount !== undefined ? (
                <>
                  <div className="bg-border my-3 h-px w-full md:my-4 lg:my-6" />
                  <p className="p-text-16 leading-6">Total Order Amount</p>
                  <p className="p-text-24 text-primary font-semibold -tracking-[0.24px]">
                    {formatCompact(Number(product?.totalOrderAmount.toFixed(2))) ?? "0"}
                  </p>
                </>
              ) : null}
            </div>
            <div className="space-y-2 rounded-lg border p-2 md:space-y-3 md:p-3 lg:space-y-5 lg:p-5">
              <p className="p-text-20 font-semibold">Shop Info</p>
              {product?.seller ? (
                <div className="flex gap-5">
                  <div className="border-primary relative aspect-square size-10 overflow-hidden rounded-full border lg:size-17.5">
                    <ImageWithFallback src={product?.seller?.store?.logoImage} fallbackSrc="/images/auth/logo.png" alt="" fill />
                  </div>
                  <div className="flex-1">
                    <div className="p-text-16 text-dark-gray flex items-center gap-1">
                      <h3 className="text-lg font-semibold">{product?.seller?.store?.storeName}</h3>
                      <BadgeCheck className="fill-blue-dark size-5! text-white" />
                    </div>
                    <p className="text-sm text-gray-500">{product?.seller?.store?.address}</p>
                  </div>
                </div>
              ) : null}
              {product?.seller?.totalProducts ? (
                <p className="p-text-20 border-t pt-2 text-center font-semibold">
                  {product?.seller?.totalProducts ?? "0"} <span className="p-text-lg text-dark-gray font-normal">Products</span>
                </p>
              ) : null}
              <div className="">
                <Link className="w-full" href={`${routes.privateRoutes.admin.userManagement.vendor.view(product?.seller?._id)}`}>
                  <Button variant={"outline-black"} className="w-full rounded-full">
                    <Store size={14} />
                    Visit Store
                  </Button>
                </Link>
              </div>
            </div>

            {product?.benefitData ? (
              <div className="grid w-full shrink-0 gap-4 max-xl:flex-1 xl:w-60 xl:grid-cols-1 2xl:w-80">
                <div className="h-max space-y-2 rounded-lg border p-2 md:space-y-3 md:p-3 lg:space-y-5 lg:p-5">
                  <p className="p-text-20 pb-2 font-semibold md:pb-6">Product Benefits </p>
                  <PremiumBenefits benefitsAry={product?.benefitData as IProdBenefit} />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {product?.colorWiseImages && product?.colorWiseImages?.length > 0 ? (
          <div className="space-y-2 overflow-hidden rounded-lg border p-2 md:space-y-3 md:p-3 lg:space-y-5 lg:p-5">
            <p className="p-text-20 font-semibold">Product Variation Information</p>

            <ArrayListElement label="Color Value" value={product?.colorWiseImages?.map((item) => item.color)} />
            <p className="p-text-20 font-semibold capitalize">Product color wise images</p>
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {product?.colorWiseImages?.map((image, index) => (
                  <CarouselItem key={index} className="flex basis-2/5 justify-center sm:basis-2/9 lg:basis-2/17">
                    <div className="relative aspect-square w-full rounded-lg border">
                      <p className="p-text-16 border-primary absolute top-2 left-2 z-10 w-max rounded-lg border bg-white p-1 font-semibold capitalize">
                        {image.color}
                      </p>
                      <ImageWithFallback
                        fallbackSrc="/images/auth/logo.png"
                        src={image.image}
                        className="relative z-0"
                        alt={image.color}
                        fill
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        ) : null}

        {attributes && attributes?.length > 0
          ? attributes?.map((attribute, index) => {
              return (
                <div key={index} className="space-y-2 overflow-hidden rounded-lg border p-2 md:space-y-3 md:p-3 lg:space-y-5 lg:p-5">
                  <SingeListElement value={attribute.name} label="Attribute" />
                  <ArrayListElement label="Attribute Value" value={attribute.values} />
                  {attribute.name.toLocaleLowerCase() === "size" && (
                    <div>
                      <p className="p-text-20 font-semibold capitalize">Size Chart</p>
                      <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent>
                          {product?.sizeGuide?.images?.map((image, index) => (
                            <CarouselItem key={index} className="flex basis-2/5 justify-center sm:basis-2/9 lg:basis-2/17">
                              <div className="relative aspect-square w-full rounded-lg border">
                                <ImageWithFallback
                                  fallbackSrc="/images/auth/logo.png"
                                  src={image}
                                  className="relative z-0"
                                  alt={product?.name}
                                  fill
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  )}
                </div>
              );
            })
          : null}

        {!isCombo && product?.variants?.length > 0 && (
          <div className="space-y-2 overflow-hidden rounded-lg border p-2 md:space-y-3 md:p-3 lg:space-y-5 lg:p-5">
            <div className="flex justify-between">
              <p className="p-text-20 font-semibold capitalize">Product Variation Table</p>
              <Link href={routes.privateRoutes.admin.productManagement.inHouseProduct?.showVariants(product?._id)}>
                <Button variant={"link"} className="text-blue-dark hover:text-blue-dark/80">
                  Manage Stock
                </Button>
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-300">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr className="text-left text-base font-semibold text-gray-800">
                    <th className="px-4 py-3">SL</th>
                    <th className="px-4 py-3">Attribute Variation</th>
                    <th className="px-4 py-3">
                      Variant Price <span className="text-gray-500">(৳)</span>
                    </th>
                    <th className="px-4 py-3">
                      Discounted Price <span className="text-gray-500">(৳)</span>
                    </th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Variation Wise Stock</th>
                  </tr>
                </thead>
                <tbody className="">
                  {product?.variants?.map((variant, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-text-16 px-4 py-3">{index + 1}</td>
                      <td className="p-text-16 px-4 py-3">{variant.variation}</td>
                      <td className="p-text-16 px-4 py-3">{variant.variantPrice}</td>
                      <td className="p-text-16 px-4 py-3">{variant.discountPrice}</td>
                      <td className="p-text-16 px-4 py-3">{variant.sku}</td>
                      <td className="p-text-16 px-4 py-3">{variant.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* {productTags && productTags?.length > 0 && (
          <div className="space-y-2 overflow-hidden rounded-lg border p-2 md:space-y-3 md:p-3 lg:space-y-5 lg:p-5">
            <p className="p-text-20 font-semibold capitalize">Product Tags</p>

            <div className="grid justify-between gap-x-10 gap-y-4 md:grid-cols-2 lg:flex">
              {productTags.map((tag, index) => {
                const checked = product?.[tag.value as keyof typeof product] as boolean;

                return (
                  <div key={index} className="flex items-center gap-2 max-lg:justify-between lg:gap-6">
                    <label htmlFor={tag.value}>{tag.label}</label>

                    <button className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-black" : "bg-gray-300"}`}>
                      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${checked ? "right-1" : "left-1"}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )} */}
      </div>

      {/* <ActivityLogs resourceId={product._id} resourceType={ORDER_ACTIVITY_LOG_TYPE.PRODUCT} /> */}
    </div>
  );
}

export const SingeListElement = ({ label, value }: { label: string; value: ReactNode | undefined }) => {
  return (
    <div className="p-text-16 flex w-full items-center max-md:flex-col">
      <p className="w-20 md:w-32 lg:w-38">{label}</p>
      <div className="flex flex-1 items-center gap-2 font-semibold capitalize">
        <span>:</span> {value || "N/A"}
      </div>
    </div>
  );
};

export const SingleRichTextElement = ({ label, value }: { label: string; value: string }) => {
  return (
    <p className="p-text-16 flex w-full items-center max-md:flex-col">
      <span className="w-20 md:w-32 lg:w-36">{label}</span>
      <SanitizedContent htmlString={value} />
    </p>
  );
};

export const ArrayListElement = ({ label, value }: { label: string; value: string[] }) => {
  return (
    <p className="p-text-16 flex w-full items-center max-md:flex-col">
      <span className="w-20 md:w-32 lg:w-36">{label}</span>
      <span className="flex items-center gap-2 font-semibold capitalize">
        :{" "}
        {value.map((variant) => (
          <span key={variant} className="bg-light-gray/50 rounded-sm p-1">
            {variant}
          </span>
        ))}
      </span>
    </p>
  );
};
