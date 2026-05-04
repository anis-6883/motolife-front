import { getAnnouncements } from "@/actions/admin/announcement-actions";
import AddAnnouncementButton from "@/components/admin/announcement/AddAnnouncementButton";
import AnnouncementDataTable from "@/components/admin/announcement/AnnouncementDataTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps } from "@/lib/types";
import { Metadata } from "next";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Announcement Setup" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Announcement Setup",
  description: "Manage your system announcements.",
});

export default async function AnnouncementSetupPage({ searchParams }: PageSearchProps) {
  const search = await searchParams;

  const {
    data: { data },
  } = await getAnnouncements(search);

  return (
    <BreadcrumbWrapper title="Announcement Setup" description="Manage your system announcements 📢" addBtn={<AddAnnouncementButton />}>
      <DynamicBreadcrumb items={breadcrumbItems} />
      <AnnouncementDataTable data={data || []} />
    </BreadcrumbWrapper>
  );
}
