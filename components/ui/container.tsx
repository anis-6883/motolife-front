import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-[984px] px-2 md:px-8 xl:max-w-[1200px] 2xl:max-w-[1400px] 2xl:px-0",
        // [@media(min-width:1700px)]:max-w-[1640px]
        className
      )}
    >
      {children}
    </div>
  );
}
