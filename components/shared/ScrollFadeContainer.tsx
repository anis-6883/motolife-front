"use client";
import { useScrollFade } from "@/hooks/useScrollFade";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ScrollFadeContainerProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ScrollFadeContainer({ children, className = "", contentClassName = "" }: ScrollFadeContainerProps) {
  const { scrollRef, isAtBottom, handleScroll } = useScrollFade<HTMLDivElement>({ bottomOffset: 50 });

  return (
    <div className={cn(`flex flex-col space-y-6 overflow-hidden max-xl:h-[calc(100vh-250px)] max-md:h-[calc(100vh-360px)]`, className)}>
      <div className="relative overflow-hidden rounded-b-xl">
        <div
          className={`pointer-events-none absolute bottom-0 h-10 w-full rounded-b-xl bg-linear-to-t from-black/30 to-transparent backdrop-blur-2xl transition-opacity duration-300 ${isAtBottom ? "opacity-0" : "opacity-100"}`}
        />
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={cn(
            `scrollbar-none h-auto max-h-137 space-y-6 overflow-y-scroll border-b-10 border-white/30 pb-18 shadow-[0_10px_20px_-5px_rgba(255,255,255,0.3)] xl:max-h-137 xl:pb-8 2xl:max-h-[70vh] dark:border-none`,
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
