"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface UserPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const UserPageContainer = ({ children, className }: UserPageContainerProps) => {
  return <div className={cn("mx-auto rounded-lg border bg-white p-3 md:p-6", className)}>{children}</div>;
};
