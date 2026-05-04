export type Customer = {
  _id: string;
  phone: string;
  email: string;
};

export type Store = {
  storeName: string;
};

export type Seller = {
  _id: string;
  name: string;
  store: Store;
};

export type OrderItem = {
  product: string;
  productName: string;
  thumbnail: string;
  seller: string;
  sku: string;
  variantSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isCombo?: boolean;
};

export type Address = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  thana: string;
  area: string;
  district: string;
};

export type Payment = {
  method: string;
  status: string;
  amountPaid: number;
  currency: string;
};

export type OrderListObj = {
  _id: string;
  orderId: string;

  customer?: Customer;
  user?: string;

  items: OrderItem[];

  shippingAddress: Address;
  billingAddress: Address;

  payment: Payment;

  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  couponDiscount: number;
  total: number;

  refundedAmount: number;

  status: string;

  customerNote?: string;
  cancellationNote?: string;
  cancellationReason?: string;

  totalItems: number;
  totalQuantity?: number;

  sellers: Seller[];

  assignedTo?: string;

  softDeleted: boolean;

  createdAt: string;
  updatedAt: string;

  cancelledAt?: string;
  deliveredAt?: string;
};
export type Pagination = {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export type OrdersResponse = {
  status: boolean;
  message: string;
  data: {
    docs: OrderListObj[];
    pagination: Pagination;
  };
};
