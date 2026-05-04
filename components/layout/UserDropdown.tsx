"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import routes from "@/config/routes";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import useUserProfile from "@/store/useUserProfile";
import { ChevronDown, ChevronUp, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { DeleteConfirmModal } from "../features/public/shared/DeleteConfirmationModal";
import { Icons } from "../icons";
import Toast from "../shared/Toast";
import { Separator } from "../ui/separator";

interface UserDropdownProps {
  user?: {
    fullName: string;
    email: string;
    image?: string;
    phone?: string;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();
  const { clearUserData } = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef as React.RefObject<HTMLElement>, () => setIsOpen(false));

  const handleLogout = async () => {
    await signOut({
      redirect: true,
    });
    router.replace("/");
    Toast.success({ title: "Success", description: "Logout Successfully!" });
    clearUserData();
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <Button
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className="items-center gap-1! bg-transparent px-2 text-black hover:bg-transparent max-md:hidden"
      >
        {user?.image ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.fullName ?? ""} />
            <AvatarFallback>
              {(user?.fullName ?? "")
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        ) : (
          <User className="size-6!" />
        )}
        <span className="p-text-16 max-lg:hidden">{user?.fullName}</span>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <Card className="shadow-primary/20 fixed right-4 bottom-20 z-50 mt-2 w-80 max-w-[90vw] gap-0 overflow-hidden rounded-[10px] p-0 shadow-xs sm:absolute sm:top-full sm:right-0 sm:bottom-auto sm:mt-2">
          {/* User Info */}
          <Link href="/profile">
            <div className="flex items-center gap-3 border-b p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.fullName} />
                <AvatarFallback>
                  {user?.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate font-semibold">{user?.fullName}</p>
                <p className="text-muted-foreground truncate text-sm">{user?.phone}</p>
              </div>
            </div>
          </Link>

          {/* Menu Items */}
          <div className="py-2 capitalize">
            <Link
              href="/orders"
              className="hover:bg-muted flex items-center gap-3 px-4 py-3 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M2.29163 6.875V12.375C2.29163 15.8319 2.29163 17.5605 3.36557 18.6344C4.43951 19.7083 6.16799 19.7083 9.62496 19.7083H11M2.29163 6.875L3.54663 4.87172C4.33683 3.61039 4.73193 2.97971 5.35341 2.63569C5.9749 2.29166 6.71911 2.29166 8.20753 2.29166H13.8443C15.3652 2.29166 16.1258 2.29166 16.7562 2.64861C17.3866 3.00556 17.7779 3.65769 18.5604 4.96194L19.7083 6.875M2.29163 6.875H19.7083M19.7083 11.4583V6.875M11 6.875V2.29166M9.16663 9.625H12.8333M13.2916 17.875C13.2916 17.875 14.2083 17.875 15.125 19.7083C15.125 19.7083 17.1201 15.125 19.7083 14.2083"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium">Order history</span>
            </Link>

            <Link
              href={routes.publicRoutes.cart}
              className="hover:bg-muted flex items-center gap-3 px-4 py-3 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Icons.cart className="h-5 w-5" />
              <span className="font-medium">my cart</span>
            </Link>
            <Separator />

            <Link
              href="#"
              className="hover:bg-muted text-destructive flex items-center gap-3 px-4 py-3 transition-colors"
              // onClick={() => handleLogout()}
              onClick={() => {
                setIsOpen(false); // close dropdown first
                setLogoutOpen(true);
              }}
            >
              <LogOut className="size-6!" />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        </Card>
      )}
      <DeleteConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => handleLogout()}
        title="Logout"
        description="Are you sure you want to Logout?"
        confirmText="Logout"
      />
    </div>
  );
}
