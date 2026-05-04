import AppSidebar from "@/components/shared/AppSidebar";
import Header from "@/components/shared/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import UserProfileProvider from "@/provider/UserProfileProvider";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProfileProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-screen overflow-auto">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8 dark:bg-[#18181C] dark:text-white">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </UserProfileProvider>
  );
}
