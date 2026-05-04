import { getComboBanner } from "@/actions/admin/section-banner/section-banner";
import ComboBannerUpload from "@/components/admin/section-banner/SectionBanner";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  // { label: "Combo Banner", href: routes.privateRoutes.admin.productManagement.comboOffer.comboBanner },
  // { label: "Combo Offer", href: routes.privateRoutes.admin.productManagement.comboOffer },
  // { label: "Combo Offer Banner", href: routes.privateRoutes.admin.productManagement.comboOffer.home },
];

export default async function Page() {
  const res = await getComboBanner();
  const initialBanners = res.data?.data ?? {};

  return (
    <BreadcrumbWrapper title="Combo Offer Banner" description="">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <ComboBannerUpload existingBanner={initialBanners} />
    </BreadcrumbWrapper>
  );
}
