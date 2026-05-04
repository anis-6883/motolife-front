import BreadCrumbSection from "@/components/features/public/shared/BreadCrumbSection";
import { UserSidebar } from "@/components/layout/UserSidebarSection";
import { Container } from "@/components/ui/container";
import type React from "react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`font-sans antialiased`}>
      <div className="flex min-h-screen flex-col">
        <BreadCrumbSection />
        <Container className="flex w-full flex-1 gap-5 pt-3 max-md:flex-col lg:pt-5">
          {/* Sidebar */}
          <UserSidebar />
          <main className="scrollbar-none min-h-screen flex-1 overflow-y-auto">{children}</main>
        </Container>
      </div>
    </div>
  );
}
