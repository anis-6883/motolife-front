import { getGeneralSettings } from "@/actions/admin/settings-action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GeneralSettingsForm from "./GeneralSettings";
import LoginSettingsForm from "./LoginSettings";
import PolicyManagementTable from "./PolicyManagementTable";

const tabs = [
  { label: "General Settings", slug: "general-settings" },
  { label: "Policy Management", slug: "policy-management" },
  { label: "Login Settings", slug: "login-settings" },
];

export default async function SettingsPage({
  currentTab = "general-settings",
  searchParams,
}: {
  currentTab: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { data } = await getGeneralSettings();
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
        {currentTab === "general-settings" && <GeneralSettingsForm defaultValues={data?.data} />}
        {currentTab === "policy-management" && <PolicyManagementTable data={data?.data?.policies} />}
        {currentTab === "login-settings" && <LoginSettingsForm defaultValues={data?.data} />}
      </div>
    </div>
  );
}
