"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Check, InfoIcon, Loader2, ShieldAlert, X } from "lucide-react";
import { toast as hotToast, Toaster } from "react-hot-toast";

// Toaster Component
const CustomToaster = () => {
  return (
    <Toaster position="top-center">
      {(t) => {
        // Parse the message
        let title = "";
        let description = "";
        let customType = "";
        let hasCustomIcon = false;

        try {
          const parsed = JSON.parse(t.message as string);
          title = parsed.title || "";
          description = parsed.description || "";
          customType = parsed.type || "";
          hasCustomIcon = parsed.hasCustomIcon || false;
        } catch {
          // Fallback if parsing fails
          description = String(t.message);
        }

        // Determine the actual toast type (consider custom type)
        const toastType = customType || t.type;

        // Set default titles if not provided
        if (!title) {
          switch (toastType) {
            case "success":
              title = "Success!";
              break;
            case "error":
              title = "Error!";
              break;
            case "warning":
              title = "Warning!";
              break;
            case "loading":
              title = "Loading...";
              break;
            case "info":
              title = "Info";
              break;
            case "custom":
              title = "Notification";
              break;
            default:
              title = "Notification";
          }
        }

        return (
          <div
            className={cn(
              "relative flex max-w-md min-w-75 items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-800",
              t.visible ? "animate-in slide-in-from-top-2" : ""
            )}
          >
            {/* Colored Left Border */}
            <div
              className={cn(
                "absolute top-3 bottom-3 left-2 w-1 rounded-full",
                toastType === "success" && "bg-green-500",
                toastType === "error" && "bg-red-500",
                toastType === "warning" && "bg-yellow-500",
                toastType === "loading" && "bg-blue-500",
                toastType === "info" && "bg-blue-500",
                toastType === "custom" && "bg-purple-500",
                !toastType && "bg-gray-500"
              )}
            />

            {/* Icon Container */}
            <div
              className={cn(
                "ms-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                toastType === "success" && "bg-green-500 text-white",
                toastType === "error" && "bg-red-500 text-white",
                toastType === "warning" && "bg-yellow-500 text-white",
                toastType === "loading" && "bg-blue-500 text-white",
                toastType === "info" && "bg-blue-500 text-white",
                toastType === "custom" && "bg-purple-500 text-white",
                !toastType && "bg-gray-500 text-white"
              )}
            >
              {/* Render custom icon if present */}
              {toastType === "custom" && hasCustomIcon && t.icon ? (
                <span className="flex h-4 w-4 items-center justify-center">{t.icon}</span>
              ) : (
                <>
                  {toastType === "success" && <Check size={16} />}
                  {toastType === "error" && <ShieldAlert size={16} />}
                  {toastType === "warning" && <AlertTriangle size={16} />}
                  {toastType === "loading" && <Loader2 size={16} className="animate-spin" />}
                  {toastType === "info" && <InfoIcon size={16} />}
                  {toastType === "custom" && !hasCustomIcon && <InfoIcon size={16} />}
                  {!toastType && <InfoIcon size={16} />}
                </>
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-gray-900 dark:text-white">{title}</div>
              {description && <div className="text-sm wrap-break-word text-gray-500 dark:text-gray-400">{description}</div>}
            </div>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                hotToast.remove(t.id);
              }}
              className="shrink-0 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        );
      }}
    </Toaster>
  );
};

export default CustomToaster;

/**
 * Toast Component with full type support
 *
 * Usage:
 * - toast.success("Message") or toast.success({ title: "Title", description: "Desc" })
 * - toast.error("Message") or toast.error({ title: "Title", description: "Desc" })
 * - toast.warning("Message") or toast.warning({ title: "Title", description: "Desc" })
 * - toast.info("Message") or toast.info({ title: "Title", description: "Desc" })
 * - toast.loading("Message") or toast.loading({ title: "Title", description: "Desc" })
 * - toast.custom("Message", { icon: <YourIcon /> }) or toast.custom({ title: "Title", description: "Desc" }, { icon: <YourIcon /> })
 *
 * All methods support options: { duration: 5000, id: 'unique-id' }
 */
