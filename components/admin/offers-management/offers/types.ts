// More flexible version with some fields possibly optional
export interface IOffersItem {
  _id: string;
  name: string;
  thumbnail: string;
  discountType: "flat" | "percentage";
  discountPrice: number;
  seller: string;
  status: string; // Could be more specific if you know all possible values
  discountValue: number;
  [key: string]: any; // Allow for additional fields
}

export interface IOffers {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  itemsCount: number;
  items: IOffersItem[];
  status: boolean;
  createdAt: string;
  image?: string;
  bannerUrl?: string;
  resourceType?: ResourceType;
  [key: string]: any; // Allow for additional fields
}
export type ResourceType = "category" | "flash_sale" | "todays_deal";

export interface Sale {
  _id?: string;
  title: string;
  startDate?: string;
  createdAt?: string;
  endDate: string;
  resourceType: ResourceType;
  bannerUrl?: string;
  image: string;
  status: boolean;
  product?: { name: string; _id: string; thumbnail: string };
  category?: { name: string; _id: string; thumbnail: string };
  seller?: { name: string; _id: string; logoImage: string };
  comboProduct?: { name: string; _id: string; thumbnail: string };
}
