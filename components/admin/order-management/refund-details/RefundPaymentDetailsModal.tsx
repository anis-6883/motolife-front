"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, Receipt } from "lucide-react";
import { RefundDoc } from "../schema";

interface RefundPaymentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refundData: RefundDoc;
}

export default function RefundPaymentDetailsModal({ open, onOpenChange, refundData }: RefundPaymentDetailsModalProps) {
  if (!refundData) return null;

  const { refundMethod, note, refundId, order, totalAmount, status } = refundData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-none max-w-xl overflow-auto p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-xl font-bold">Refund Payment Details</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-primary flex flex-col gap-2 rounded-lg border p-4 text-white">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="flex size-12 items-center justify-center rounded-md border border-white/20 bg-white/10">
                  <Receipt className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wider text-white/70 uppercase">Refund ID</p>
                  <p className="text-base font-semibold text-white">{refundId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium tracking-wider text-white/70 uppercase">Order ID</p>
                  <p className="text-sm font-semibold text-white">#{order?.orderId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium tracking-wider text-white/70 uppercase">Refundable Amount</p>
                  <p className="text-sm font-bold">{totalAmount.toFixed(2)} BDT</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium tracking-wider text-white/70 uppercase">Current Status</p>
                  <p className="text-sm font-semibold capitalize">{status.replace(/_/g, " ")}</p>
                </div>
              </div>
            </div>

            <ScrollArea className="max-h-[450px] pr-4">
              <div className="space-y-6">
                {/* Payment Method section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-gray-500" />
                    <h4 className="text-sm font-bold tracking-tight text-gray-900 uppercase">Payment Information</h4>
                  </div>
                  <div className="rounded-xl border bg-gray-50/50 p-4 shadow-sm">
                    <div className="grid grid-cols-2 gap-y-4">
                      <div className="col-span-2">
                        <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Method Type</p>
                        <p className="text-primary text-sm font-bold capitalize">{refundMethod?.methodType}</p>
                      </div>

                      {refundMethod?.methodType === "bkash" && (
                        <>
                          <div>
                            <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Phone</p>
                            <p className="text-sm font-semibold text-gray-700">{refundMethod?.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Transaction ID</p>
                            <p className="text-sm font-semibold text-gray-700">{refundMethod?.transactionId}</p>
                          </div>
                        </>
                      )}

                      {refundMethod?.methodType === "bank" && (
                        <>
                          <div className="col-span-2">
                            <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Bank Name</p>
                            <p className="text-sm font-semibold text-gray-700">{refundMethod?.bankName}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Account Holder</p>
                            <p className="text-sm font-semibold text-gray-700">{refundMethod?.accountHolderName}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Account Number</p>
                            <p className="text-sm font-semibold text-gray-700">{refundMethod?.accountNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Branch</p>
                            <p className="text-sm font-semibold text-gray-700">{refundMethod?.branch}</p>
                          </div>
                        </>
                      )}

                      {note && (
                        <div className="col-span-2 border-t pt-4">
                          <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Approve Note</p>
                          <p className="mt-1 text-sm font-semibold text-gray-700">{note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
