import { getContactById } from "@/actions/admin/help-support/getSupportMail";
import ContactMailView from "@/components/admin/help-support/ContactMailView";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Help & Support", href: routes.privateRoutes.admin.helpAndSUpport.contactMail.home },
  { label: "Messages", href: routes.privateRoutes.admin.helpAndSUpport.contactMail.home },
  { label: "Mail View" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "View Contact Message",
  description: "View and reply to a contact message.",
});

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContactMailViewPage({ params }: PageProps) {
  const { id } = await params;

  const res = await getContactById(id);

  if (!res?.data?.data) {
    notFound();
  }

  const contact = res.data.data;

  return (
    <BreadcrumbWrapper title="Contact Message" description="View details and reply to a contact message.">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ContactMailView contact={contact} />
    </BreadcrumbWrapper>
  );
}
