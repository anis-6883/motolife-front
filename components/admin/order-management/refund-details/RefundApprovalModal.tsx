"use client";

import { refundAllById, refundPartially, rejectRefundAllById, rejectRefundPartially } from "@/actions/order-management/order-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

import { Icons } from "@/components/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { RefundItem, RefundManagementFormValues, refundManagementSchema } from "../schema";

interface RefundManagementModalProps {
  open: boolean;
  mode: "approve" | "reject";
  actionType?: "refundAll" | "refundPartial" | "rejectAll" | "rejectPartial";
  selectedItem?: RefundItem | null;
  refundId: string;
  refund_Id: string;
  onOpenChange: (open: boolean) => void;
}

export default function RefundManagementModal({
  open,
  mode,
  actionType = "refundAll",
  selectedItem,
  refundId,
  refund_Id,
  onOpenChange,
}: RefundManagementModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RefundManagementFormValues>({
    resolver: zodResolver(refundManagementSchema),
    defaultValues: {
      mode,
      refundMethod: {
        methodType: undefined,
      },
      note: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const selectedMethodType = useWatch({
    control,
    name: "refundMethod.methodType",
  });

  const handleFormSubmit: SubmitHandler<RefundManagementFormValues> = async (data) => {
    if (data.mode === "approve" && data.refundMethod?.methodType) {
      const type = data.refundMethod.methodType;
      let formattedRefundMethod: any = {};
      if (type === "cash") {
        formattedRefundMethod = { methodType: "cash" };
      } else if (type === "bkash") {
        formattedRefundMethod = {
          methodType: "bkash",
          phone: data.refundMethod.phone,
          transactionId: data.refundMethod.transactionId,
        };
      } else if (type === "bank") {
        formattedRefundMethod = {
          methodType: "bank",
          accountHolderName: data.refundMethod.accountHolderName,
          accountNumber: data.refundMethod.accountNumber,
          branch: data.refundMethod.branch,
          bankName: data.refundMethod.bankName,
        };
      }

      setIsLoading(true);
      const t = Toast.loading({
        title: "Status",
        description: "Processing refund...",
      });

      try {
        const basePayload = {
          refundMethod: formattedRefundMethod,
          note: data.note || undefined,
        };

        let res;
        if (actionType === "refundPartial" && selectedItem) {
          const payload = {
            ...basePayload,
            productId: selectedItem.isCombo ? undefined : selectedItem.product,
            comboProductId: selectedItem.isCombo ? selectedItem.comboProduct : undefined,
            isCombo: selectedItem.isCombo || false,
            variantSku: selectedItem.variantSku,
          };
          res = await refundPartially(refund_Id, payload);
        } else {
          res = await refundAllById(refund_Id, basePayload);
        }

        if (res?.data?.status || res?.data || (res as any)?.ok) {
          Toast.remove(t);
          Toast.success({
            title: "Success",
            description: actionType === "refundPartial" ? "Partial refund processed successfully!" : "Refund approved successfully!",
          });
          onOpenChange(false);
          reset();
          return;
        }

        Toast.remove(t);
        Toast.error({
          title: "Failed",
          description: (res as any)?.message || (res as any)?.error || "Failed to process refund",
        });
      } catch (error: any) {
        Toast.remove(t);
        Toast.error({
          title: "Failed",
          description: error?.message || "Failed to process refund",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (data.mode === "reject") {
      setIsLoading(true);
      const t = Toast.loading({
        title: "Status",
        description: "Rejecting refund...",
      });

      try {
        let res;
        if (actionType === "rejectPartial" && selectedItem) {
          const payload = {
            productId: selectedItem.isCombo ? undefined : selectedItem.product,
            comboProductId: selectedItem.isCombo ? selectedItem.comboProduct : undefined,
            isCombo: selectedItem.isCombo || false,
            variantSku: selectedItem.variantSku,
            note: data.note || "",
          };
          res = await rejectRefundPartially(refund_Id, payload);
        } else {
          const payload = {
            note: data.note || "",
          };
          res = await rejectRefundAllById(refund_Id, payload);
        }

        if (res?.data?.status || res?.data || (res as any)?.ok) {
          Toast.remove(t);
          Toast.success({
            title: "Success",
            description: actionType === "rejectPartial" ? "Partial refund rejected successfully!" : "Refund rejected successfully!",
          });
          onOpenChange(false);
          reset();
          return;
        }

        Toast.remove(t);
        Toast.error({
          title: "Failed",
          description: (res as any)?.message || (res as any)?.error || "Failed to reject refund",
        });
      } catch (error: any) {
        Toast.remove(t);
        Toast.error({
          title: "Failed",
          description: error?.message || "Failed to reject refund",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      onOpenChange(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 sm:max-w-xl [&>button:first-of-type]:hidden">
        <DialogHeader className="relative z-0 text-center">
          <div className="flex justify-center">
            <Icons.RefundIcon />
          </div>
          <DialogTitle>
            <p className="p-text-24 text-center font-bold -tracking-[0.3px]">
              {mode === "approve"
                ? actionType === "refundPartial"
                  ? `Confirm partial refund for ${selectedItem?.productName || "this product"}`
                  : "Once you refund that refund request, you will not be able to change any status"
                : actionType === "rejectPartial"
                  ? `Reject refund for ${selectedItem?.productName || "this product"}`
                  : "Reject this refund request"}
            </p>
          </DialogTitle>
          <p className="p-text-16 text-light-gray text-center leading-6">
            Refund ID: <span className="leading-5 font-semibold text-black">#{refundId}</span>
          </p>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            {/* APPROVE MODE */}
            {mode === "approve" && (
              <>
                <InputField
                  type="select"
                  label="Refund Method"
                  placeholder="Choose refund method"
                  options={[
                    { label: "bKash", value: "bkash" },
                    { label: "Bank", value: "bank" },
                    { label: "Cash", value: "cash" },
                  ]}
                  name="refundMethod.methodType"
                  required
                />

                {selectedMethodType === "bkash" && (
                  <div className="grid grid-cols-2 gap-4">
                    <InputField name="refundMethod.phone" type="text" label="Phone" placeholder="Enter phone number" required />
                    <InputField
                      name="refundMethod.transactionId"
                      type="text"
                      label="Transaction ID"
                      placeholder="Enter transaction ID"
                      required
                    />
                  </div>
                )}

                {selectedMethodType === "bank" && (
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      name="refundMethod.accountNumber"
                      type="text"
                      label="Account Number"
                      placeholder="Enter account number"
                      required
                    />
                    <InputField
                      name="refundMethod.accountHolderName"
                      type="text"
                      label="Account Holder Name"
                      placeholder="Enter account holder name"
                      required
                    />
                    <InputField name="refundMethod.bankName" type="text" label="Bank Name" placeholder="Enter bank name" required />
                    <InputField name="refundMethod.branch" type="text" label="Branch" placeholder="Enter branch name" required />
                  </div>
                )}

                <InputField
                  name="note"
                  label="Approve Note"
                  type="textarea"
                  placeholder="Please write the approve reason.."
                  inputClassName="h-24 w-full resize-none"
                />
              </>
            )}

            {/* REJECT MODE */}
            {mode === "reject" && (
              <InputField
                name="note"
                label="Reject Reason"
                type="textarea"
                placeholder="Write the reason for rejecting this refund..."
                inputClassName="h-24 w-full resize-none"
                required
              />
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline-black" type="button" className="rounded-full md:px-10" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>

              <Button type="submit" disabled={isLoading} className="rounded-full md:px-10" variant="black">
                {isLoading && mode === "approve" ? "Processing..." : mode === "approve" ? "Proceed" : "Submit"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
