"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icons } from "../icons";

interface ActionButton {
  icon: React.ElementType;
  label: string;
  color: string;
  hoverColor: string;
  action: () => void;
}

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const buttons: ActionButton[] = [
    {
      icon: Icons.phoneRing,
      label: "Call Us",
      color: "bg-[#DC2626]",
      hoverColor: "hover:bg-[#B91C1C]",
      action: () => window.open("tel:+1234567890", "_blank"),
    },
    {
      icon: Icons.messenger,
      label: "Messenger",
      color: "bg-white",
      hoverColor: "hover:bg-[#0073E6]",
      action: () => window.open("https://m.me/yourpage", "_blank"),
    },
    {
      icon: Icons.whatsapp,
      label: "WhatsApp",
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#20BD5A]",
      action: () => window.open("https://wa.me/1234567890", "_blank"),
    },
  ];
  const curPath = usePathname();
  return (
    <>
      <div className={cn("fixed right-2 bottom-20 z-50 p-1 md:right-6 2xl:right-20", curPath !== "/" ? "hidden" : "")}>
        {/* Expanded Buttons */}
        <div
          className={cn(
            "mb-4 flex flex-col-reverse gap-4 transition-all duration-300",
            isOpen ? "translate-y-0 opacity-100" : "pointer-events-none absolute translate-y-4 opacity-0"
          )}
        >
          {buttons.map((button, index) => (
            <div key={index} className="group relative flex items-center justify-end">
              {/* Tooltip */}
              <div
                className={cn(
                  "absolute right-16 rounded-lg bg-gray-900 px-3 py-2 text-sm whitespace-nowrap text-white shadow-lg transition-all duration-200",
                  hoveredIndex === index ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-2 opacity-0"
                )}
              >
                {button.label}
                <div className="absolute top-1/2 right-0 h-0 w-0 translate-x-full -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900" />
              </div>

              {/* Button */}
              <button
                onClick={button.action}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "flex h-14 w-14 transform items-center justify-center rounded-full text-white shadow-lg transition-all duration-300",
                  button.color,
                  button.hoverColor,
                  isOpen ? "scale-100 rotate-0" : "scale-0 rotate-180"
                )}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : `${(buttons.length - index) * 50}ms`,
                }}
                aria-label={button.label}
              >
                <button.icon className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-14 w-14 transform items-center justify-center rounded-full shadow-lg transition-all duration-300",
            isOpen
              ? "scale-110 rotate-90 bg-gray-900 hover:bg-gray-800"
              : "scale-100 rotate-0 bg-gray-900 hover:scale-110 hover:bg-gray-800"
          )}
          aria-label={isOpen ? "Close menu" : "Open help menu"}
        >
          <div className="relative h-6 w-6">
            <Icons.questionIcon
              className={cn(
                "absolute inset-0 h-6 w-6 text-white transition-all duration-300",
                isOpen ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
              )}
            />
            <X
              className={cn(
                "absolute inset-0 h-6 w-6 text-white transition-all duration-300",
                isOpen ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
              )}
            />
          </div>
        </button>
      </div>
    </>
  );
}
