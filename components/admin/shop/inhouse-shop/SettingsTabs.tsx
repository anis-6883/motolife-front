"use client";

import { SettingsTab } from "@/types/shop";

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const tabs: { id: SettingsTab; label: string }[] = [
  { id: "shop-settings", label: "SHOP SETTINGS" },
  { id: "others", label: "OTHERS" },
];

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="mb-6 flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`cursor-pointer rounded px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-150 ${
            activeTab === tab.id
              ? "border border-gray-300 bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
