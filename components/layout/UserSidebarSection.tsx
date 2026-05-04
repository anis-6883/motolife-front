"use client";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useUserProfile from "@/store/useUserProfile";
import { LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmModal } from "../features/public/shared/DeleteConfirmationModal";
import Toast from "../shared/Toast";
import { menuItems } from "./sampleData";
// interface WalletStats {
//   total: number;
//   used: number;
//   available: number;
// }

const UserSidebarContent = () => {
  // const [isWalletOpen, setIsWalletOpen] = useState(true);
  const pathname = usePathname();
  // const walletStats: WalletStats = {
  //   total: 2140,
  //   used: 140,
  //   available: 2000,
  // };
  const [logoutOpen, setLogoutOpen] = useState(false);
  const router = useRouter();
  const { clearUserData } = useUserProfile();
  const handleLogout = async () => {
    await signOut({
      redirect: true,
      redirectTo: "/",
    });
    Toast.success({ title: "Success", description: "Logout Successfully!" });
    clearUserData();
  };
  return (
    <>
      {/* <div className="bg-dark-backround mb-4 rounded-lg px-4 shadow-sm">
        <button
          onClick={() => setIsWalletOpen(!isWalletOpen)}
          className={`mb-2 flex w-full items-center justify-between py-3 text-left ${isWalletOpen && "border-b"}`}
        >
          <span className="p-text-18 font-semibold text-black">Wallet Points</span>
          {isWalletOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
        {isWalletOpen && (
          <div className="pb-6">
            <div className="grid grid-cols-3 text-center">
              <div>
                <p className="p-text-18 text-primary font-semibold">{walletStats.total.toLocaleString()}</p>
                <p className="p-text-16 text-dark-gray font-semibold max-md:text-xs">Total points</p>
              </div>
              <div>
                <p className="p-text-18 text-primary font-semibold">{walletStats.used}</p>
                <p className="p-text-16 text-dark-gray font-semibold max-md:text-xs">Used</p>
              </div>
              <div>
                <p className="p-text-18 text-primary font-semibold">{walletStats.available.toLocaleString()}</p>
                <p className="p-text-16 text-dark-gray font-semibold max-md:text-xs">Available</p>
              </div>
            </div>
          </div>
        )}
      </div> */}

      <nav className="bg-dark-backround custom-scrollbar h-max space-y-1 overflow-y-auto rounded-lg p-2 shadow-sm max-md:flex max-md:justify-evenly md:p-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.id;

          return (
            <Link key={index} href={item.id} className="shrink-0">
              <button
                className={`flex w-full items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium transition-colors md:gap-4 md:px-4 md:py-3.5 ${
                  isActive ? "bg-primary/10 text-primary" : "text-dark-gray hover:bg-gray-100"
                }`}
                title={item.label}
              >
                <Icon className="size-5! shrink-0" />
                <span className="p-text-16 leading-5 font-semibold">{item.label}</span>
              </button>
            </Link>
          );
        })}

        {/* Logout Button */}
        <div className="border-t max-md:hidden">
          <button
            onClick={() => {
              setLogoutOpen(true);
            }}
            className="flex w-full items-center gap-4 rounded-lg px-4 py-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            title="Logout"
          >
            <LogOut className="!size-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
      <DeleteConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => handleLogout()}
        title="Logout"
        description="Are you sure you want to Logout?"
        confirmText="Logout"
      />
    </>
  );
};
export function UserSidebar() {
  return (
    <div>
      <aside className="sticky top-40 max-h-[90vh] flex-col gap-y-3 overflow-y-auto transition-all duration-300 md:flex md:w-60 lg:gap-y-7.5 xl:w-78">
        <UserSidebarContent />
      </aside>
    </div>
  );
}

export const UserSidebarTriggerBtn = () => {
  return (
    <Sheet>
      <SheetTitle className="sr-only">user sidebar</SheetTitle>
      <SheetTrigger asChild>
        <button
          className={`text-muted-foreground hover:text-foreground flex flex-1 flex-col items-center justify-center gap-1 transition-colors lg:hidden`}
        >
          <div className="flex items-center justify-center">
            <User className="size-4! md:size-5!" />
          </div>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-primary/5 flex w-70 flex-col justify-center rounded-r-4xl! px-5 backdrop-blur-xl [&>button:first-of-type]:hidden [@media(min-width:400px)]:w-80"
      >
        <UserSidebarContent />
      </SheetContent>
    </Sheet>
  );
};
