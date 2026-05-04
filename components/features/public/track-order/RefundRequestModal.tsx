"use client";

import { requestRefund } from "@/actions/customer/refund-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import InputField from "@/components/form/InputField";
import { Icons } from "@/components/icons";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allRoutes } from "@/config/constant";

import { Form } from "@/components/ui/form";
import { IOrder, OrderItem } from "@/lib/types";
import Link from "next/link";
import { REFUND_REASONS, RefundRequestFormValues, refundRequestSchema } from "../checkout/schema";

interface RefundRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: IOrder;
}

export function RefundRequestModal({ open, onOpenChange, orderData }: RefundRequestModalProps) {
  const [selectedItems, setSelectedItems] = useState<(OrderItem & { selectedQty: number })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMultipleImageCredentials, setUploadMultipleImageCredentials] = useState<
    {
      fileKey: string;
      publicUrl: string;
      uploaded?: boolean;
    }[]
  >([]);

  const getItemKey = (item: any) => {
    if (item.isCombo) return item.comboProduct || item.productId;
    return item.variantSku || item.product || item.sku;
  };

  const form = useForm<RefundRequestFormValues>({
    resolver: zodResolver(refundRequestSchema),
    defaultValues: {
      items: [],
      reason: "",
      details: "",
      images: [],
    },
  });

  const { handleSubmit, reset, setValue } = form;

  useEffect(() => {
    setValue(
      "items",
      selectedItems.map((item) => {
        if (item.isCombo) {
          return {
            comboProductId: item.comboProduct as string,
            isCombo: true as const,
            quantity: item.selectedQty,
          };
        }
        return {
          productId: item.product as string,
          variantSku: item.variantSku || undefined,
          isCombo: false as const,
          quantity: item.selectedQty,
        };
      }),
      { shouldValidate: true }
    );
  }, [selectedItems, setValue]);

  useEffect(() => {
    setValue(
      "images",
      uploadMultipleImageCredentials.map((img) => img.publicUrl),
      { shouldValidate: true }
    );
  }, [uploadMultipleImageCredentials, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
      setSelectedItems([]);
      setUploadMultipleImageCredentials([]);
    }
  }, [open, reset]);

  const handleAddItem = (itemKey: string) => {
    const item = orderData.items.find((i) => getItemKey(i) === itemKey);
    if (item && !selectedItems.find((i) => getItemKey(i) === itemKey)) {
      setSelectedItems((prev) => [...prev, { ...item, selectedQty: 1 }]);
    }
  };

  const handleRemoveItem = (itemKey: string) => {
    setSelectedItems((prev) => prev.filter((i) => getItemKey(i) !== itemKey));
  };

  const handleQtyChange = (itemKey: string, qty: number) => {
    setSelectedItems((prev) => prev.map((item) => (getItemKey(item) === itemKey ? { ...item, selectedQty: qty } : item)));
  };

  const calculateSubtotal = () => selectedItems.reduce((sum, item) => sum + item.unitPrice * item.selectedQty, 0);

  const handleFormSubmit = async (data: RefundRequestFormValues) => {
    const payload = {
      items: data.items,
      reason: data.reason,
      details: data.details,
      images: uploadMultipleImageCredentials.map((img) => img.publicUrl),
    };

    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Submitting refund request...",
    });

    try {
      const res = await requestRefund(orderData._id, payload);

      if (res?.data) {
        Toast.remove(t);
        Toast.success({
          title: "Success",
          description: "Refund request submitted successfully!",
        });
        onOpenChange(false);
        return;
      }

      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: (res as any)?.error || "Failed to submit refund request",
      });
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || "Failed to submit refund request",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unselectedItems = orderData.items.filter((item) => !selectedItems.some((si) => getItemKey(si) === getItemKey(item)));
  const selectedSubtotal = calculateSubtotal();

  const orderSubtotal = orderData?.subtotal;
  const orderTax = orderData?.tax ?? 0;
  const orderCoupon = orderData?.couponDiscount ?? 0;

  const refundRatio = orderSubtotal > 0 ? selectedSubtotal / orderSubtotal : 0;

  const refundedTax = +(orderTax * refundRatio).toFixed(2);
  const refundedCoupon = +(orderCoupon * refundRatio).toFixed(2);

  const finalRefundAmount = +(selectedSubtotal - refundedTax - refundedCoupon).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-none max-h-[90vh] overflow-y-auto max-md:p-3 sm:max-w-[90vw] lg:max-w-5xl [&>button:first-of-type]:hidden">
        <div className="relative">
          <button onClick={() => onOpenChange(!open)} className="absolute top-0 right-0 z-10 shrink-0">
            <X className="size-6" />
          </button>
          <DialogHeader className="relative z-0 text-center">
            <div className="flex justify-center">
              <Icons.RefundIcon />
            </div>
            <DialogTitle>
              <p className="p-text-30 text-center font-bold -tracking-[0.3px]">Request Refund</p>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="text-gray-900">
              <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                {/* LEFT SIDE */}
                <div className="space-y-4">
                  {/* Select Items */}
                  <div>
                    <label className="p-text-16 mb-1 block leading-5 font-semibold">Select the items you want to refund</label>
                    <Select value="" onValueChange={handleAddItem}>
                      <SelectTrigger className="w-full 2xl:h-11!">
                        <SelectValue placeholder="Select items" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] w-[var(--radix-select-trigger-width)] overflow-hidden p-0">
                        {unselectedItems.length === 0 ? (
                          <div className="px-2 py-3 text-center text-sm text-gray-500">All items selected</div>
                        ) : (
                          unselectedItems.map((item) => {
                            const key = getItemKey(item);
                            return (
                              <SelectItem
                                key={key}
                                value={key || ""}
                                className="cursor-pointer border-b border-gray-100 px-3 py-3 transition-colors last:border-0 hover:bg-gray-50 focus:bg-gray-50 data-[state=checked]:bg-white [&>span]:w-full"
                              >
                                <div className="flex w-full items-start justify-between gap-4">
                                  <div className="flex min-w-0 flex-1 flex-col gap-1 text-left">
                                    <p className="truncate text-xs leading-tight font-medium text-gray-900">{item.productName}</p>
                                    <div className="text-dark-gray flex flex-wrap items-center gap-1 text-[10px] font-normal">
                                      {item.attributes?.map((attr, idx) => (
                                        <span key={idx} className="flex items-center">
                                          {attr.name}: <span className="ml-1 font-semibold text-black">{attr.value}</span>
                                          {idx < item.attributes.length - 1 && <span className="mx-1.5 text-gray-200"> | </span>}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <p className="mt-0.5 text-xs font-medium whitespace-nowrap text-gray-900">{item.sellingPrice} BDT</p>
                                </div>
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reason */}
                  <InputField
                    type="select"
                    name="reason"
                    label="Select a Reason"
                    placeholder="Select a Reason"
                    selectTriggerClassName="2xl:h-11!"
                    options={REFUND_REASONS.map((r) => ({ value: r, label: r }))}
                    required
                  />

                  {/* Additional Details */}
                  <InputField type="textarea" name="details" label="Additional Details" inputClassName="h-24 w-full resize-none" />

                  {/* Images */}
                  <InputField
                    // labelClassName="p-text-16 font-semibold"
                    name="images"
                    type="image-multiple"
                    label="Upload Images"
                    maxNum={5}
                    required
                    tooltipContent="Only 5 images are allowed!"
                    folderName="refunds"
                    uploadMultipleImageCredentials={uploadMultipleImageCredentials}
                    setUploadMultipleImageCredentials={setUploadMultipleImageCredentials}
                  />
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-3">
                  <label className="p-text-16 block leading-5 font-semibold">
                    Order ID: <span className="text-dark-gray">#{orderData.orderId}</span>
                  </label>

                  {selectedItems.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed text-gray-500">
                      No items selected
                    </div>
                  ) : (
                    <div className="custom-scrollbar relative max-h-80 space-y-2 overflow-y-auto rounded-lg border bg-gray-50 p-3 xl:max-h-90">
                      {selectedItems.map((item) => (
                        <div key={getItemKey(item)} className="relative flex items-center gap-3 rounded-lg bg-white p-3 max-md:flex-col">
                          <div className="flex flex-1 gap-3">
                            <div className="relative size-17 shrink-0 overflow-hidden rounded-md bg-gray-100">
                              <ImageWithFallback
                                src={item.thumbnail}
                                fallbackSrc="/images/auth/logo.png"
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-sm font-medium">{item.productName}</p>
                              <div className="text-dark-gray p-text-16 mb-2 flex flex-wrap items-center gap-1 leading-6 md:gap-2">
                                {item.attributes?.map((attr, idx) => (
                                  <span key={idx} className="flex items-center">
                                    <span className="whitespace-nowrap">{attr.name}:</span>
                                    <span className="ml-1 font-semibold whitespace-nowrap text-black">{attr.value}</span>
                                    {idx < item.attributes.length - 1 && <span className="ml-2 h-2 w-px bg-black/30" />}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-1 items-center justify-between max-md:w-full">
                            <Select value={String(item.selectedQty)} onValueChange={(v) => handleQtyChange(getItemKey(item), Number(v))}>
                              <SelectTrigger className="w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: item.quantity }, (_, i) => (
                                  <SelectItem key={i} value={String(i + 1)}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <p className="text-right font-medium">{(item.unitPrice * item.selectedQty).toFixed(2)}BDT</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(getItemKey(item))}
                            className="text-primary border-primary absolute top-1 right-1 rounded-full border p-0.5 hover:bg-red-50"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedItems.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{selectedSubtotal.toFixed(2)} BDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TAX</span>
                        <span>-{refundedTax.toFixed(2)} BDT</span>
                      </div>
                      {orderData.couponDiscount > 0 && (
                        <div className="flex justify-between">
                          <span>Coupon</span>
                          <span>-{refundedCoupon.toFixed(2)} BDT</span>
                        </div>
                      )}

                      <div className="bg-border my-3 h-px w-full" />

                      <div className="p-text-16 flex justify-between font-semibold">
                        <span>Total Refund Amount</span>
                        <span className="p-text-20 text-primary font-semibold">{finalRefundAmount.toFixed(2)} BDT</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-dark-gray py-3 text-wrap">
                *Refund will be processed according to our{" "}
                <Link href={allRoutes.refundPolicy} className="text-black underline">
                  refund policy.
                </Link>
              </p>
              <div className="flex gap-3 max-md:flex-col">
                <Button type="button" variant="outline" className="flex-1 2xl:h-11!" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 2xl:h-11!" disabled={selectedItems.length === 0 || isLoading}>
                  {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  {isLoading ? "Submitting..." : "Submit Refund Request"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
