import BusinessSettings from "@/components/admin/business-settings/BusinessSettings";
import DetailPageSkeleton from "@/components/admin/shared/DetailPageSkeleton";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = generatePageMetadata({
  title: "Business Settings",
  description: "Manage your business settings.",
});
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function BusinessSettingsPage({ params, searchParams }: PageProps) {
  const allParams = await params;
  const allSearchParams = await searchParams;

  const breadcrumbItems = [
    { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
    { label: "Business Settings", href: routes.privateRoutes.admin.businessSettings },
    {
      label: allSearchParams?.tab?.toString()?.replace(/-and-/g, "-&-").replace(/-/g, " ") || "general",
    },
  ];

  return (
    <BreadcrumbWrapper title="Business Settings" description="Manage your business settings 💼">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Suspense fallback={<DetailPageSkeleton />}>
        <BusinessSettings currentTab={allSearchParams.tab as string} searchParams={allSearchParams} />
      </Suspense>
    </BreadcrumbWrapper>
  );
}
