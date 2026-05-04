import { getBusinessSettings } from "@/actions/admin/business-settings-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GeneralSettingsForm from "./GeneralSettingsForm";
import OrderSettingsForm from "./OrderSettings";
import ShippingAndDeliveryForm from "./ShippingAndDelivery";

const tabs = [
  { label: "General", slug: "general" },
  //   { label: "Vendors", slug: "vendors" },
  //   { label: "Customer", slug: "customer" },
  { label: "Orders", slug: "orders" },
  //   { label: "Money Withdraw Method", slug: "money-withdraw-method" },
  { label: "Shipping & Delivery", slug: "shipping-and-delivery" },
  //   { label: "Analytics & Tracking", slug: "analytics-&-tracking" },
];

export default async function BusinessSettings({
  currentTab = "general",
  searchParams,
}: {
  currentTab: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { data } = await getBusinessSettings();
  //   const [{ data }] = await Promise.all([getGeneralSettings()]);
  return (
    <div className="text-black">
      <div className="pb-5">
        {/* <Link href={routes.privateRoutes.admin.userManagement.vendor.home}>
          <Button variant="outline-primary">
            <ArrowLeft />
            Go Back
          </Button>
        </Link> */}
        <div className="scrollbar-none mt-5 mb-5 flex w-max max-w-full gap-2 overflow-x-auto rounded-lg border p-2">
          {tabs.map((tab) => (
            <Link key={tab.slug} href={`?tab=${tab.slug}`}>
              <Button
                variant={currentTab === tab.slug ? "default" : "outline"}
                className={`${currentTab === tab.slug ? "cool" : "h-9 border-0 shadow-none"}`}
              >
                {tab.label}
              </Button>
            </Link>
          ))}
        </div>
        {currentTab === "general" && <GeneralSettingsForm defaultValues={data?.data?.general} />}
        {currentTab === "orders" && <OrderSettingsForm defaultValues={data?.data?.order} />}
        {currentTab === "shipping-and-delivery" && <ShippingAndDeliveryForm defaultValues={data?.data?.shipping} />}
      </div>
    </div>
  );
}
