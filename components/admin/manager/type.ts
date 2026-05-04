// types/manager.ts

export interface ManagerRole {
  _id: string;
  name: string;
  permissions: string[];
  status: boolean;
  createdAt: string;
}

export interface Manager {
  _id: string;
  name: string;
  phone: string;
  email: string;
  image?: string;
  role: ManagerRole;
  identifyType: string;
  identifyImage?: string;
  identifyNumber?: string;

  status: boolean;
  createdAt: string;
}

export interface ManagerPagination {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ManagerListResponse {
  docs: Manager[];
  pagination: ManagerPagination;
}
