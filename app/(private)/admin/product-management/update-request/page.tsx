import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [{ label: "Dashboard", href: routes.privateRoutes.admin.dashboard }, { label: "Update Request" }];

export const metadata: Metadata = generatePageMetadata({
  title: "Update Request",
  description: "Maintain your update requests for seamless navigation.",
});

export default async function ProductPage() {
  return (
    <BreadcrumbWrapper
      title="Manage Update Request"
      description="Maintain your product update requests for enhancing your business growth 💯"
    >
      <DynamicBreadcrumb items={breadcrumbItems} />
    </BreadcrumbWrapper>
  );
}
