import { getBanners, getComboOfferBanner } from "@/actions/landing/banner-actions";
import { getComboProducts, getProducts } from "@/actions/landing/product-action";
import { getMainCategories } from "@/actions/landing/product-category-actions";
import { FlashSale } from "@/components/admin/offers-management/offers/FlashSaleProductForm";
import BannerBarAnnouncements from "@/components/features/public/announcements/BannerBarAnnouncements";
import { BestDealsSection, BestDealsSkeleton } from "@/components/features/public/landing-page/BestDealsSection";
import CategoriesSection from "@/components/features/public/landing-page/CategoriesSection";
import ComboOfferSection from "@/components/features/public/landing-page/ComboOfferSection";
import { FeaturedProductsSection, FeaturedProductsSkeleton } from "@/components/features/public/landing-page/FeaturedProductsSection";
import { FlashSaleSection } from "@/components/features/public/landing-page/FlashSaleSection";
import { HeroCarouselSection } from "@/components/features/public/landing-page/HeroCarouselSection";
import JustForYouList from "@/components/features/public/landing-page/JustForYouSection";
import { PremiumEngineOilSection, PremiumEngineOilSkeleton } from "@/components/features/public/landing-page/PremiumEngineOilSection";
import { getAllOffersByResource } from "@/components/features/public/landing-page/utils";
import { CarouselProductListSection } from "@/components/features/public/shared/CarouselProductList";
import { Container } from "@/components/ui/container";
import { allRoutes, BannerType, RESOURCE_TYPE } from "@/config/constant";
import { Suspense } from "react";

export default async function HomePage() {
  const [
    {
      data: { data: categories },
    },
    {
      data: { data: banners },
    },
    {
      data: { data: newArrivals },
    },
    {
      data: { data: bestHelmets },
    },
    {
      data: { data: comboBanerData },
    },
    {
      data: { data: comboProducts },
    },
  ] = await Promise.all([
    getMainCategories(),
    getBanners(BannerType.MAIN_SECTION_BANNER),
    getProducts({ isNew: "true" }),
    getProducts({ category: "helmet" }),
    getComboOfferBanner(),
    getComboProducts({}),
  ]);

  const response = await getAllOffersByResource(RESOURCE_TYPE.FLASH_SALE, { page: 1, limit: 7 });

  const offerData: FlashSale = response?.data?.data ?? {};
  const flatParams = { limit: "10" };

  const { data } = await getProducts(flatParams);

  const products = data?.data?.docs || [];
  const pagination = data?.data?.pagination;
  return (
    <div className="min-h-screen items-center justify-center">
      <Container>
        <div className="h-2 md:h-6"></div>
        <Suspense fallback={<div />}>
          <BannerBarAnnouncements />
        </Suspense>
        <HeroCarouselSection autoplayDelay={5000} overlayOpacity={0.4} slides={banners} />
        <CategoriesSection categories={categories} />
        <FlashSaleSection flashSaleData={offerData} />
        {newArrivals?.docs?.length > 0 ? (
          <CarouselProductListSection
            products={newArrivals?.docs || []}
            title="new arrival"
            viewAllURL={`${allRoutes.products}?isNew=true&page=1`}
          />
        ) : null}
        <ComboOfferSection comboBannerData={comboBanerData} comboProducts={comboProducts} />
        {/* <CouponCodeSection discount={38} code="FREE15FIRST" /> */}
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProductsSection />
        </Suspense>
        <Suspense fallback={<BestDealsSkeleton />}>
          <BestDealsSection />
        </Suspense>
        <Suspense fallback={<PremiumEngineOilSkeleton />}>
          <PremiumEngineOilSection />
        </Suspense>
        {bestHelmets?.docs?.length > 0 ? (
          <CarouselProductListSection
            products={bestHelmets?.docs || []}
            title="Our Best Helmet Collection"
            viewAllURL={`${allRoutes.products}?category=helmet&page=1`}
          />
        ) : null}
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <JustForYouList
            initialProducts={products}
            initialPage={pagination?.page || 1}
            totalPages={pagination?.totalPages || 1}
            params={{}}
          />
        </Suspense>
      </Container>
    </div>
  );
}
