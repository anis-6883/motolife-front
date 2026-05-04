"use client";

import Toast from "@/components/shared/Toast";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onToggle: (checked: boolean) => Promise<{ success: boolean; message?: string }>;
  disabled?: boolean;
  activeText?: string;
  inactiveText?: string;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  showLabel?: boolean;
  className?: string;
}

export default function ToggleSwitch({
  checked,
  onToggle,
  disabled = false,
  activeText = "Active",
  inactiveText = "Inactive",
  loadingMessage = "Updating status...",
  successMessage = "Status updated successfully!",
  errorMessage = "Failed to update status!",
  showLabel = true,
  className = "",
}: ToggleSwitchProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async (newChecked: boolean) => {
    setLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: loadingMessage,
    });

    try {
      const response = await onToggle(newChecked);

      Toast.remove(t);

      if (!response?.success) {
        Toast.error({
          title: "Failed",
          description: response?.message || errorMessage,
        });
        return;
      }

      Toast.success({
        title: "Success",
        description: response?.message || successMessage,
      });
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Switch checked={checked} onCheckedChange={handleStatusToggle} disabled={disabled || loading} className="cursor-pointer" />
      {showLabel && <span className="w-16 text-sm">{checked ? activeText : inactiveText}</span>}
    </div>
  );
}
