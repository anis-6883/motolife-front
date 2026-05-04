import { REFUND_ITEM_STATUS, REFUND_STATUS } from "@/config/constant";
import { Pagination } from "./order-details/schema";

export type Store = {
  storeName: string;
};

export type Seller = {
  _id: string;
  store: Store;
  name: string;
  phone?: string;
};

export type Order = {
  _id: string;
  status: REFUND_STATUS;
  sellers: Seller | Seller[];
  orderId: string;
};

export type Customer = {
  _id: string;
  phone: string;
  email: string;
  totalOrders: number;
  fullName?: string;
};

export type RefundItem = {
  product?: string;
  comboProduct?: string;
  productName: string;
  thumbnail: string;
  seller: { store: { storeName: string } };
  sku: string;
  variantSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: REFUND_ITEM_STATUS;
  isCombo?: boolean;
};

type RefundMethod =
  | {
      methodType: "bkash";
      phone: string;
      transactionId: string;
    }
  | {
      methodType: "bank";
      accountHolderName: string;
      accountNumber: string;
      branch: string;
      bankName: string;
    }
  | {
      methodType: "cash";
    };

export type RefundDoc = {
  _id: string;
  order: Order;
  customer: Customer;
  items: RefundItem[];
  refundReason: string;
  images: string[];
  details: string;
  totalAmount: number;
  status: REFUND_STATUS;
  softDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  refundId: string;
  assignedTo?: string;
  subtotal?: number;
  discount?: number;
  totalDiscount?: number;
  tax?: number;
  refundMethod?: RefundMethod;
  note?: string;
};

export type RefundResponse = {
  status: boolean;
  message: string;
  data: {
    docs: RefundDoc[];
    pagination: Pagination;
  };
};

import { z } from "zod";

export const refundManagementSchema = z
  .object({
    mode: z.enum(["approve", "reject"]),
    refundMethod: z
      .object({
        methodType: z.enum(["bkash", "bank", "cash", ""]).optional(),
        phone: z.string().optional(),
        transactionId: z.string().optional(),
        accountHolderName: z.string().optional(),
        accountNumber: z.string().optional(),
        branch: z.string().optional(),
        bankName: z.string().optional(),
      })
      .optional(),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "approve") {
      const methodType = data.refundMethod?.methodType;
      if (!methodType) {
        ctx.addIssue({
          path: ["refundMethod.methodType"],
          code: "custom",
          message: "Refund method is required",
        });
      } else if (methodType === "bkash") {
        if (!data.refundMethod?.phone) {
          ctx.addIssue({
            path: ["refundMethod.phone"],
            code: "custom",
            message: "Phone number is required",
          });
        } else if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(data.refundMethod.phone)) {
          ctx.addIssue({
            path: ["refundMethod.phone"],
            code: "custom",
            message: "Invalid phone number",
          });
        }

        if (!data.refundMethod?.transactionId) {
          ctx.addIssue({
            path: ["refundMethod.transactionId"],
            code: "custom",
            message: "Transaction ID is required",
          });
        } else if (!/^[a-zA-Z0-9]+$/.test(data.refundMethod.transactionId)) {
          ctx.addIssue({
            path: ["refundMethod.transactionId"],
            code: "custom",
            message: "Invalid Transaction ID",
          });
        }
      } else if (methodType === "bank") {
        if (!data.refundMethod?.accountHolderName) {
          ctx.addIssue({
            path: ["refundMethod.accountHolderName"],
            code: "custom",
            message: "Account holder name is required",
          });
        } else if (!/^[a-zA-Z\s.'-]+$/.test(data.refundMethod.accountHolderName)) {
          ctx.addIssue({
            path: ["refundMethod.accountHolderName"],
            code: "custom",
            message: "Invalid account holder name. No numbers or special symbols are allowed.",
          });
        }

        if (!data.refundMethod?.accountNumber) {
          ctx.addIssue({
            path: ["refundMethod.accountNumber"],
            code: "custom",
            message: "Account number is required",
          });
        } else if (!/^\d+$/.test(data.refundMethod.accountNumber)) {
          ctx.addIssue({
            path: ["refundMethod.accountNumber"],
            code: "custom",
            message: "Invalid Account number",
          });
        }

        if (!data.refundMethod?.branch) {
          ctx.addIssue({
            path: ["refundMethod.branch"],
            code: "custom",
            message: "Branch name is required",
          });
        } else if (!/^[a-zA-Z\s.'-]+$/.test(data.refundMethod.branch)) {
          ctx.addIssue({
            path: ["refundMethod.branch"],
            code: "custom",
            message: "Invalid branch name. No numbers or special symbols are allowed.",
          });
        }

        if (!data.refundMethod?.bankName) {
          ctx.addIssue({
            path: ["refundMethod.bankName"],
            code: "custom",
            message: "Bank name is required",
          });
        } else if (!/^[a-zA-Z\s.'-]+$/.test(data.refundMethod.bankName)) {
          ctx.addIssue({
            path: ["refundMethod.bankName"],
            code: "custom",
            message: "Invalid bank name. No numbers or special symbols are allowed.",
          });
        }
      }
    }

    if (data.mode === "reject" && !data.note) {
      ctx.addIssue({
        path: ["note"],
        code: "custom",
        message: "Reject reason is required",
      });
    }
  });

export type RefundManagementFormValues = z.infer<typeof refundManagementSchema>;
