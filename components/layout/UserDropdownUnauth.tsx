"use client";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useState } from "react";
import LoginModal from "../features/auth/LoginModal";

export function UserDropdownUnauth() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsLoginModalOpen(true)}>
        <User className="h-5 w-5" />
        <span className="sr-only">Login</span>
      </Button>

      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  );
}
