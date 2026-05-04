import { getProductReviewList } from "@/actions/admin/product-review/get-customer";
import AddReviewButton from "@/components/admin/product -review/AddReviewButton";
import AddReviewFormSheet from "@/components/admin/product -review/AddReviewFormSheet";
import ReviewsDataTable from "@/components/admin/product -review/ReviewsDataTable";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Product Review", href: routes.privateRoutes.admin.productReview.home },
  { label: "Reviews" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Reviews",
  description: "Manage your Reviews.",
});
type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export default async function page({ searchParams }: PageProps) {
  const params = await searchParams;

  const flatParams: Record<string, string> = {};
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  Object.entries(params || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      flatParams[key] = value[0];
    } else if (value !== undefined) {
      flatParams[key] = value;
    }
  });

  const {
    data: { data },
  } = await getProductReviewList(flatParams);
  return (
    <FormSheetProvider>
      <BreadcrumbWrapper title="Product Review" description="" addBtn={<AddReviewButton />}>
        <AddReviewFormSheet />
        <DynamicBreadcrumb items={breadcrumbItems} />
        <ReviewsDataTable data={data || []} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
