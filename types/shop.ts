export interface ShopStat {
  id: string;
  label: string;
  value: number;
  color: "blue" | "orange" | "purple";
  icon: "product" | "order" | "review";
}
export interface VacationSettings {
  isOnVacation: boolean;
  durationType: string | null;
  startAt: string | null;
  endsAt: string | null;
  note: string;
}
export interface BusinessSettings {
  businessType: string;
  isAvailable: boolean;
  minOrderAmount: number;
  vacation: VacationSettings;
}
export interface ShopInfo {
  name: string;
  logo: string;
  isVerified: boolean;
  isLive: boolean;
  stats: ShopStat[];
  verificationStatus: string;
  store: {
    storeName: string;
    logoImage: string;
    coverImage?: string;
  };
  businessSettings: BusinessSettings;
}

export type SettingsTab = "shop-settings" | "others";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
export interface BusinessSettings {
  isAvailable: boolean;
  isOnVacation: boolean;
  vacationNote: string;
  vacationDuration: string;
  minOrderAmount: number;
}

export interface StoreInfo {
  storeName: string;
  logoImage: string;
  coverImage: string;
}

export interface InhouseShopData {
  businessSettings: BusinessSettings;
  store: StoreInfo;
}
export interface ShopStats {
  _id: string;
  totalOrders: number;
  totalProducts: number;
  totalReviews: number;
}
