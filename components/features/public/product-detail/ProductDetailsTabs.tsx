"use client";

import { getFAQByProdSlug, getReviewsByProdSlug } from "@/actions/landing/product-action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPagination, IReviewP } from "@/lib/types";
import { BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import SanitizedContent from "../shared/sanitizeContent";
import { QATab } from "./QATab";
import { ReviewsTab } from "./ReviewsTab";
import SizeTab from "./SizeTab";
import { VideoTab } from "./VideoTab";
import { ProductDetailObj } from "./schemas";

interface ProductDetailsTabsProps {
  productData?: {
    sku: string;
    brandName: string;
    deliveryTime: string;
    soldBy: string;
    verified: boolean;
    offers: string[];
    description: string;
  };
  product?: ProductDetailObj;
  isComboProduct?: boolean;
}
export type ProductVideo = {
  id: string;
  youtubeId: string;
  title?: string;
  description?: string;
};
type IReviewResp = {
  docs: IReviewP[];
  pagination: IPagination;
};
export const shippingReturnAry = [
  {
    title: "Shipping Process",
    description:
      "We process all orders within 1–2 business days. Once your order is shipped, you’ll receive a confirmation email with tracking details. Delivery times vary depending on your location, but most orders arrive within 3–7 business days. Please ensure your shipping information is accurate to avoid delays.",
  },
  {
    title: "Returns & Exchanges",
    description:
      "If you’re not satisfied with your purchase, you can request a return or exchange within 7 days of delivery. Items must be unused, in original condition, and include all packaging. To start a return, contact our support team with your order details. Refunds are processed after we receive and inspect the item.",
  },
];

export function ProductDetailsTabs({ productData, product, isComboProduct }: ProductDetailsTabsProps) {
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<IReviewResp>();
  const [faqs, setFaqs] = useState<any>();
  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     if (product?._id) {
  //       const { data: reviewsData } = await getReviewsByProdSlug(product?._id, { page });
  //       setReviews(reviewsData.data as IReviewResp);
  //     }
  //   };
  //   fetchReviews();
  // }, [product?._id]);
  const [refetch, setRefetch] = useState(false);
  const [refetchFaqs, setRefetchFaqs] = useState(false);
  useEffect(() => {
    const fetchReviews = async () => {
      if (product?._id) {
        const { data: reviewsData } = await getReviewsByProdSlug(product._id, isComboProduct ? "combo" : "product", { page });
        setReviews(reviewsData.data as IReviewResp);
        console.log("review data", reviewsData.data);
      }
    };

    fetchReviews();
  }, [product?._id, page, refetch]);
  useEffect(() => {
    const fetchFaqs = async () => {
      if (product?._id) {
        const { data: faqsData } = await getFAQByProdSlug(product._id, isComboProduct ? "combo" : "product", { page });
        setFaqs(faqsData?.data);
      }
    };

    fetchFaqs();
  }, [product?._id, page, refetchFaqs]);
  return (
    <div className="gap100 w-full">
      <Tabs defaultValue="description" className="bg-dark-backround/50 w-full rounded-md border md:rounded-2xl">
        <div className="overflow-hidden">
          <TabsList className="scrollbar-none h-10! w-full max-w-full justify-start gap-2 divide-x divide-gray-200 rounded-none border-b bg-transparent p-1 max-xl:overflow-x-scroll md:h-20! md:p-6">
            <TabsTrigger
              value="description"
              className="data-[state=active]:bg-primary h-8 rounded-sm border-0 px-1! font-medium data-[state=active]:text-white data-[state=active]:shadow-none md:h-10! md:rounded-lg md:px-6"
            >
              <span className="p-text-18 font-semibold"> Product Description</span>
            </TabsTrigger>
            <VerticalLine />
            {product?.videoLinks && product?.videoLinks?.length > 0 && (
              <>
                <TabsTrigger
                  value="video"
                  className="data-[state=active]:bg-primary h-8 rounded-sm border-0 px-1! font-medium text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-none md:h-10! md:rounded-lg md:px-6"
                >
                  <span className="p-text-18 font-semibold"> Video</span>
                </TabsTrigger>
                <VerticalLine />
              </>
            )}
            {product?.sizeGuide ? (
              <>
                <TabsTrigger
                  value="size-chart"
                  className="data-[state=active]:bg-primary h-8 rounded-sm border-0 px-1! font-medium text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-none md:h-10! md:rounded-lg md:px-6"
                >
                  <span className="p-text-18 font-semibold">Size Chart</span>
                </TabsTrigger>
                <VerticalLine />
              </>
            ) : null}
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-primary h-8 rounded-sm border-0 px-1! font-medium text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-none md:h-10! md:rounded-lg md:px-6"
            >
              <span className="p-text-18 font-semibold">Reviews</span>
            </TabsTrigger>
            <VerticalLine />

            <TabsTrigger
              value="faq"
              className="data-[state=active]:bg-primary h-8 rounded-sm border-0 px-1! font-medium text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-none md:h-10! md:rounded-lg md:px-6"
            >
              <span className="p-text-18 font-semibold">FAQ</span>
            </TabsTrigger>

            <VerticalLine />

            <TabsTrigger
              value="shipping"
              className="data-[state=active]:bg-primary h-8 rounded-sm border-0 px-1! font-medium text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-none md:h-10! md:rounded-lg md:px-6"
            >
              <span className="p-text-18 font-semibold">Shipping & Return</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="description" className="animate-in fade-in slide-in-from-top-2 mt-0 space-y-4 p-2 pt-0 duration-300 md:p-6">
          {/* Description Text */}
          {product?.description && <SanitizedContent htmlString={product?.description} />}
          <div className="md:space-y-3 md:pt-4">
            {product?.sku ? (
              <div className="flex items-start gap-2">
                <span className="p-text-14 text-dark-gray leading-5 font-medium md:min-w-45">SKU:</span>
                <span className="p-text-16 text-dark-gray leading-5 font-semibold">{product?.sku}</span>
              </div>
            ) : null}

            {product?.brand?.name ? (
              <div className="flex items-start gap-2">
                <span className="p-text-14 text-dark-gray leading-5 font-medium md:min-w-45">Brand Name:</span>
                <span className="p-text-16 text-dark-gray leading-5 font-semibold">{product?.brand?.name}</span>
              </div>
            ) : null}

            {/* <div className="flex items-start gap-2">
              <span className="p-text-14 text-dark-gray leading-5 font-medium md:min-w-45">Estimated Delivery Time:</span>
              <span className="p-text-16 text-dark-gray leading-5 font-semibold">{product?.deliveryTime}</span>
            </div> */}

            {product?.seller && product?.seller?.length > 0 ? (
              <div className="flex items-start gap-2">
                <span className="p-text-14 text-dark-gray leading-5 font-medium md:min-w-45">Sold by:</span>
                <div className="flex items-center gap-1.5">
                  <span className="p-text-16 leading-5 font-semibold text-black">{product?.seller[0]?.store?.storeName}</span>
                  {product?.seller && Array.isArray(product?.seller) && product?.seller[0]?.verificationStatus === "verified" && (
                    <BadgeCheck className="fill-blue-dark size-5! text-white" />
                  )}
                </div>
              </div>
            ) : null}

            {/* <div className="flex items-center gap-2">
              <span className="p-text-14 text-dark-gray leading-5 font-medium md:min-w-45">Offers:</span>
              <div className="flex flex-wrap gap-2">
                {data.offers.map((offer, index) => (
                  <RibbonBadge key={index}>{offer}</RibbonBadge>
                ))}
              </div>
            </div> */}
          </div>
        </TabsContent>

        <TabsContent value="video" className="animate-in fade-in slide-in-from-top-2 mt-0 p-2 duration-300 md:p-6">
          <VideoTab videos={product?.videoLinks.map((video) => video.url) || []} />
        </TabsContent>

        {product?.sizeGuide && (
          <TabsContent value="size-chart" className="animate-in fade-in slide-in-from-top-2 mt-0 p-2 duration-300 md:p-6">
            <SizeTab sizeChartAry={product?.sizeGuide} />
          </TabsContent>
        )}

        <TabsContent value="reviews" className="animate-in fade-in slide-in-from-top-2 mt-0 p-2 duration-300 md:p-6">
          {product?._id && (
            <ReviewsTab
              productId={product?._id}
              isComboOffer={isComboProduct}
              reviewCount={reviews?.pagination?.totalDocs || 0}
              reviews={reviews?.docs || []}
              setPage={setPage}
              totalPages={reviews?.pagination?.totalPages || 0}
              currentPage={page}
              refetch={refetch}
              setRefetch={setRefetch}
            />
          )}
        </TabsContent>

        <TabsContent value="faq" className="animate-in fade-in slide-in-from-top-2 mt-0 p-2 duration-300 md:p-6">
          {product?._id && (
            <QATab
              faqs={faqs?.docs || []}
              productId={product?._id}
              isCombo={isComboProduct}
              setRefetchFaqs={setRefetchFaqs}
              refetchFaqs={refetchFaqs}
              setPage={setPage}
              currentPage={page}
              pagination={faqs?.pagination}
            />
          )}
        </TabsContent>

        <TabsContent
          value="shipping"
          className="animate-in fade-in slide-in-from-top-2 mt-0 space-y-2 p-2 duration-300 md:space-y-10 md:p-6"
        >
          {shippingReturnAry.map((obj, index) => (
            <div key={index} className="md:space-y-3">
              <h3 className="p-text-24 font-semibold -tracking-[0.24px]">{obj.title}</h3>
              <p className="p-text-16 text-justify leading-7 font-medium -tracking-[0.32px]">{obj.description}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

const VerticalLine = () => {
  return (
    <div className="relative">
      <div className="bg-border absolute -top-20 h-40 w-px max-lg:hidden"></div>
    </div>
  );
};
