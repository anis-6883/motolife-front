import { getMainCategories } from "@/actions/landing/product-category-actions";
import { getBusinessSettings } from "@/actions/landing/settings-action";
import PopupAnnouncements from "@/components/features/public/announcements/PopupAnnouncements";
import ScrollingAnnouncements from "@/components/features/public/announcements/ScrollingAnnouncements";
import StatsSection from "@/components/features/public/landing-page/StatsSection";
import { getAllOffersByResource } from "@/components/features/public/landing-page/utils";
import { BottomMobileMenu } from "@/components/layout/BottomMobileMenu";
import { FloatingActionButton } from "@/components/layout/FloatingButtons";
import { Footer } from "@/components/layout/FooterSection";
import { Heading } from "@/components/layout/Heading";
import MaintenanceModePage from "@/components/shared/MaintenanceModePage";
import { RESOURCE_TYPE, SystemType } from "@/config/constant";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { CartProvider } from "@/provider/CartProvider";
import CustomerProfileProvider from "@/provider/CustomerProfileProvider";
import { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.HOME);
export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categoryData, businessSettings] = await Promise.all([getMainCategories(), getBusinessSettings("general")]);
  const offersData = await getAllOffersByResource(RESOURCE_TYPE.FLASH_SALE, { page: 1, limit: 3 });

  const isMaintenanceMode =
    businessSettings?.data?.data?.general?.maintenanceModeEnabled &&
    (businessSettings?.data?.data?.general?.maintenanceSystem === SystemType.ALL ||
      businessSettings?.data?.data?.general?.maintenanceSystem === SystemType.CUSTOMER);

  if (isMaintenanceMode) {
    return <MaintenanceModePage />;
  }

  return (
    <CustomerProfileProvider>
      <CartProvider>
        <div className="relative flex min-h-screen flex-col">
          <Heading categories={categoryData?.data?.data || []} items={offersData?.data?.data?.items || []} />
          <ScrollingAnnouncements />
          <PopupAnnouncements />
          <main className="z-10 flex-1">{children}</main>
          <BottomMobileMenu />
          <StatsSection />
          <FloatingActionButton />
          <div className="pb-14 md:hidden" />
          <div className="max-md:hidden">
            <Footer />
          </div>
        </div>
      </CartProvider>
    </CustomerProfileProvider>
  );
}
