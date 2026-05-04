import { getOffersList } from "@/actions/admin/offers-management/offers-actions";
import { getProductCategories } from "@/actions/admin/product-management/product-category-actions";
import { getProductReviewList } from "@/actions/admin/product-review/get-customer";
import { getVendorComboProducts, getVendorOrderStats, getVendorProducts } from "@/actions/admin/user-management/vendor-actions";
import { getOrdersByVendorId } from "@/actions/order-management/order-actions";
import ReviewsDataTable from "@/components/admin/product -review/ReviewsDataTable";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import OffersAndDeals from "./OffersAndDeals";
import Order from "./Order";
import Settings from "./Settings";
import ShopOverview from "./ShopOverview";
import VendorComboProductDataTable from "./VendorComboProductDataTable";
import VendorProductDataTable from "./VendorProductDataTable";

const tabs = [
  { label: "Shop Overview", slug: "shop-overview" },
  { label: "Order", slug: "order" },
  { label: "Product", slug: "product" },
  { label: "Offers & Deals", slug: "offers-and-deals" },
  { label: "Combo Offer", slug: "combo-offer" },
  { label: "Settings", slug: "settings" },
  { label: "Transaction", slug: "transaction" },
  { label: "Review", slug: "review" },
];

export default async function VendorDetails({
  currentTab = "shop-overview",
  id: vendorId,
  searchParams,
}: {
  currentTab: string;
  id: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const [orderRes, productRes, comboProductRes, categoryRes, statsRes, reviewRes, offerRes] = await Promise.all([
    getOrdersByVendorId(searchParams as Record<string, string | number | undefined>, vendorId),
    getVendorProducts(vendorId, searchParams as Record<string, string | number | undefined>),
    getVendorComboProducts(vendorId, searchParams as Record<string, string | number | undefined>),
    getProductCategories(),
    getVendorOrderStats(vendorId),
    getProductReviewList({ ...searchParams, sellerId: vendorId } as Record<string, string | number | undefined>),
    getOffersList({ ...searchParams, sellerId: vendorId } as Record<string, string | number | undefined>),
  ]);

  return (
    <div className="text-black">
      <div className="pb-5">
        <Link href={routes.privateRoutes.admin.userManagement.vendor.home}>
          <Button variant="outline-primary">
            <ArrowLeft />
            Go Back
          </Button>
        </Link>
        <div className="scrollbar-none mt-5 mb-5 flex w-max max-w-full gap-2 overflow-x-auto rounded-lg border p-2">
          {tabs.map((tab) => (
            <Link key={tab.slug} href={`?tab=${tab.slug}`}>
              <Button
                variant={currentTab === tab.slug ? "default" : "outline"}
                className={`${currentTab === tab.slug ? "cool" : "h-9 border-0 shadow-none"}`}
              >
                {tab.label}
              </Button>
            </Link>
          ))}
        </div>
        {currentTab === "shop-overview" && <ShopOverview id={vendorId} />}
        {currentTab === "order" && <Order id={vendorId} data={orderRes?.data?.data} orderStats={statsRes?.data?.data} />}
        {currentTab === "product" && (
          <VendorProductDataTable data={productRes?.data?.data || []} categoriesAry={categoryRes?.data?.data} vendorId={vendorId} />
        )}
        {currentTab === "combo-offer" && <VendorComboProductDataTable data={comboProductRes?.data?.data || []} vendorId={vendorId} />}
        {currentTab === "settings" && <Settings id={vendorId} />}
        {currentTab === "review" && <ReviewsDataTable data={reviewRes?.data?.data || []} />}
        {currentTab === "offers-and-deals" && <OffersAndDeals data={offerRes?.data?.data || []} vendorId={vendorId} />}
      </div>
    </div>
  );
}
