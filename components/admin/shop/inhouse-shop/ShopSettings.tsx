"use client";

import { SettingsTab, ShopInfo, ShopStats } from "@/types/shop";
import { useState } from "react";
import OthersSetting from "./OthersSetting";
import SettingsTabs from "./SettingsTabs";
import ShopDetails from "./ShopDetails";
import StoreAvailability from "./StoreAvailability";

interface ShopSettingsProps {
  shop: ShopInfo;
  stats: ShopStats | null;
}

export default function ShopSettings({ shop, stats }: ShopSettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("shop-settings");

  return (
    <div>
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "shop-settings" && (
        <div className="flex flex-col gap-4">
          <StoreAvailability initialAvailable={shop?.businessSettings?.isAvailable ?? true} />
          <ShopDetails shop={shop} stats={stats} />
        </div>
      )}

      {activeTab === "others" && <OthersSetting minOrderAmount={shop?.businessSettings?.minOrderAmount || 0} />}
    </div>
  );
}
