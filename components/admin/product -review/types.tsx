export interface ICustomer {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  isVerified: boolean;
  accountStatus: string;
  totalOrders: number;
}

export interface IPagination {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ICustomerResponse {
  status: boolean;
  message: string;
  data: ICustomer[];
  pagination: IPagination;
}
export interface IOrderResponse {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  invoice: object;
  orderId: string;
}
