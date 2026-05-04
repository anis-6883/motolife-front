export interface SiteSettings {
  _id: string;
  enableCustomerOtpLogin: boolean;
  enableCustomerPasswordLogin: boolean;
  favIcon: string;
  loginBlockTime: number;
  logo: string;
  openGraphDescription: string;
  openGraphImage: string;
  openGraphTitle: string;
  tagline: string;
}

export interface SettingsResponse {
  status: boolean;
  message: string;
  data: SiteSettings;
}
