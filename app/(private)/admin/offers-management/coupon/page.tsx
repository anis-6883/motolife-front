import { getCoupons } from "@/actions/admin/offers-management/coupon-actions";
import CouponDataTable from "@/components/admin/offers-management/coupons/CouponDataTable";
import AddButton from "@/components/shared/AddButton";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { PageSearchProps } from "@/lib/types";
import { Metadata } from "next";

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "Offers & Deals", href: routes.privateRoutes.admin.offerAndDealsManagement.offerList.home },
  { label: "Coupons" },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Manage Coupons",
  description: "Maintain your coupons for attracting your lead customers 🛒",
});

export default async function page({ searchParams }: PageSearchProps) {
  const search = await searchParams;

  const {
    data: { data },
  } = await getCoupons(search);

  // const newData = await fetch(`${process.env.NEXTAUTH_URL}/api/city`);
  // const cities = (await newData.json()).data;

  return (
    <FormSheetProvider>
      <BreadcrumbWrapper
        title="Coupons"
        description="Manage your coupons for attracting your lead customers 🛒"
        addBtn={<AddButton title="Add New Coupon" />}
      >
        <DynamicBreadcrumb items={breadcrumbItems} />
        <CouponDataTable data={data || []} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
