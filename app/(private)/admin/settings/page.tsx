import SettingsPage from "@/components/admin/settings/general/SettingsPage";
import DetailPageSkeleton from "@/components/admin/shared/DetailPageSkeleton";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { Suspense } from "react";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Settings", href: routes.privateRoutes.admin.settings },
  { label: "General" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "General Settings",
  description: "All about general settings",
});
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function GeneralSettingsPage({ params, searchParams }: PageProps) {
  const allParams = await params;
  const allSearchParams = await searchParams;
  return (
    <BreadcrumbWrapper title="General Settings" description="All about general settings 🧭">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Suspense fallback={<DetailPageSkeleton />}>
        <SettingsPage currentTab={allSearchParams.tab as string} searchParams={allSearchParams} />
      </Suspense>
    </BreadcrumbWrapper>
  );
}
