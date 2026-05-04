import DetailPageSkeleton from "@/components/admin/shared/DetailPageSkeleton";
import VendorDetails from "@/components/admin/user-management/vendor/detail/VendorDetails";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = generatePageMetadata({
  title: "Vendor Details",
  description: "View comprehensive details and activities for this vendor.",
});
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function VendorDetailPage({ params, searchParams }: PageProps) {
  const allParams = await params;
  const allSearchParams = await searchParams;

  const breadcrumbItems = [
    { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
    { label: "User Management" },
    { label: "Vendor" },
    { label: "Vendor List", href: routes.privateRoutes.admin.userManagement.vendor.home },
    { label: "Details", href: routes.privateRoutes.admin.userManagement.vendor.view(allParams.id) },
    {
      label: allSearchParams?.tab?.toString()?.replace(/-and-/g, "-&-").replace(/-/g, " ") || "shop-overview",
    },
  ];

  return (
    <BreadcrumbWrapper title="Vendor Details" description="View comprehensive details and activities for this vendor.">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Suspense fallback={<DetailPageSkeleton />}>
        <VendorDetails currentTab={allSearchParams.tab as string} id={allParams.id} searchParams={allSearchParams} />
      </Suspense>
    </BreadcrumbWrapper>
  );
}
