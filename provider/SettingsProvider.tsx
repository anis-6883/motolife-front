"use client";

import { SiteSettings } from "@/types/settings";
import React, { createContext, useContext } from "react";

interface SettingsContextType {
  settings: SiteSettings | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ settings, children }: { settings: SiteSettings | null; children: React.ReactNode }) => {
  return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context.settings;
};
