"use client";

import { Icons } from "@/components/icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PaymentItem } from "@/lib/types";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export const PaymentBriefStatsSection = ({ paymentBriefData }: { paymentBriefData: Record<string, PaymentItem> }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-y-4 rounded-lg border border-black/50 py-2 md:py-3 lg:grid-cols-5 2xl:py-5">
      {Object.entries(paymentBriefData).map(([key, item], index) => {
        return (
          <div
            key={index}
            className={`flex flex-col items-center justify-center last:max-lg:col-span-2 ${
              index % 2 === 0 ? "max-md:border-r" : ""
            } ${index !== 4 ? "md:border-r" : ""}`}
          >
            <p className="p-text-16-s leading-6 text-[#777] max-md:text-center">{item.label}</p>

            <div className="flex items-center gap-1 2xl:gap-4">
              {"value" in item && <p className="p-text-18-s font-semibold text-black">{item.value as string}</p>}

              {key === "orderId" && "value" in item && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleCopy(item.value as string)}
                        className="rounded p-1 transition hover:bg-gray-100"
                        aria-label="Copy order ID"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="text-blue-dark h-4 w-4" />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{copied ? "Copied!" : "Copy"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {"icon" in item &&
                (() => {
                  const Icon = Icons[item.icon as keyof typeof Icons];
                  console.log("came here", item);
                  return <Icon className="h-10! w-20!" />;
                })()}
            </div>
          </div>
        );
      })}
    </div>
  );
};
