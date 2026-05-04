"use client";

import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { adminDashboardMenu } from "@/config/nav-config";
import { filterSidebarByPermissions } from "@/lib/permission-helper";
import useUserProfile from "@/store/useUserProfile";
import AppSidebarHeader from "./AppSidebarHeader";
import NavMenuItems from "./NavMenuItems";

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userData } = useUserProfile();
  const permissions: string[] = (userData?.role as any)?.permissions ?? [];
  const filteredNav = filterSidebarByPermissions(adminDashboardMenu.navMain, permissions);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarHeader teams={adminDashboardMenu.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMenuItems items={filteredNav} />
      </SidebarContent>
    </Sidebar>
  );
}
