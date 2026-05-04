export interface OffersData {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  resourceType: string;
  categoryId: string;
  items: OfferItem[];
  status: boolean;
  slug: string;
  createdAt: string;
}

export interface OfferItem {
  _id: string;
  name: string;
  thumbnail: string;
  sellingPrice: number;
  seller: Seller[];
  isFeatured: boolean;
  isNewArrived: boolean;
  isUpcoming: boolean;
  status: string;
  discountPrice: number;
  discountType: string;
  discountValue: number;
}

export interface Seller {
  _id: string;
  store: Store;
  name: string;
  verificationStatus: string;
}

export interface Store {
  storeName: string;
}
