"use client";

import { cancelOrder } from "@/actions/customer/order-actions";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allRoutes } from "@/config/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, TriangleAlert, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CancelOrderFormValues, cancelOrderSchema } from "../checkout/schema";
import { ResponseStatusModal } from "../shared/ResponseStatusModal";
import { PlainProdCard } from "../track-order/ProductCardPreview";

interface OrderCancelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  items: any[];
  orderObjId: string;
}

const CANCELLATION_REASONS = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Changed my mind",
  "Item no longer needed",
  "Delivery time too long",
  "Other",
];

const DEFAULT_VALUES: CancelOrderFormValues = {
  cancellationReason: "Ordered by mistake",
  cancellationNote: "",
};

export function OrderCancelModal({ open, onOpenChange, orderId, items, orderObjId }: OrderCancelModalProps) {
  const [cancelStatusOpen, setCancelStatusOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelOrderFormValues>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset(DEFAULT_VALUES);
    }
  }, [open, reset]);

  const onSubmit = async (data: CancelOrderFormValues) => {
    // Here we "send" the cancel request
    setLoading(true);
    const payload = {
      cancellationReason: data.cancellationReason,
      cancellationNote: data.cancellationNote,
    };

    const res = await cancelOrder(orderObjId, payload);
    console.log(res, "order cancel api");
    if ((res as any).error && (res as any).statusCode !== 200) {
      Toast.error((res as any).message);
      setCancelStatusOpen(true);
      setLoading(false);
      return;
    }

    onOpenChange(false);

    reset(DEFAULT_VALUES);
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="scrollbar-none overflow-y-auto max-md:max-h-[90vh] max-md:p-3 md:max-w-3xl [&>button:first-of-type]:hidden">
          <div className="relative">
            <button onClick={() => onOpenChange(!open)} className="absolute top-0 right-0 z-10 shrink-0">
              <X className="size-6" />
            </button>
            <DialogHeader className="relative z-0">
              <div className="flex justify-center">
                <div className="relative">
                  <TriangleAlert className="fill-primary size-17! text-white" />
                </div>
              </div>
              <DialogTitle>
                <p className="p-text-30 text-center font-bold text-black">Are you sure you want to cancel this order?</p>
              </DialogTitle>
              <p className="p-text-18 text-dark-gray text-center max-md:leading-4">Once cancelled this action cannot be undone</p>
            </DialogHeader>

            <div className="md:space-y-5 md:pt-3">
              {/* Order Info */}
              <div className="bg-dark-gray/5 space-y-5 rounded-lg px-2 md:px-5 md:py-3.5">
                <div className="p-text-18 text-dark-gray flex items-center justify-center gap-4 font-semibold">
                  <span>Order ID:</span>
                  <span className="text-black">#{orderId}</span>
                </div>
                <div className="custom-scrollbar max-h-44 space-y-3 divide-y overflow-y-auto rounded-lg border bg-gray-50 p-2.5 xl:max-h-60">
                  {items.map((item: any) => (
                    <PlainProdCard key={item.product} item={item} />
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
                {/* Reason */}
                <div>
                  <label className="block">
                    <span className="p-text-16 leading-5 font-semibold">Select a Reason</span>
                  </label>

                  <Controller
                    name="cancellationReason"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full 2xl:h-11!">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CANCELLATION_REASONS.map((reason) => (
                            <SelectItem className="2xl:h-11" key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.cancellationReason && <p className="text-primary text-sm">{errors.cancellationReason.message}</p>}
                </div>

                {/* Note */}
                <div>
                  <label className="block">
                    <span className="p-text-16 leading-5 font-semibold">Additional Note</span>
                  </label>
                  <textarea
                    {...register("cancellationNote")}
                    placeholder="Enter here if you have any additional notes."
                    className="focus:border-primary h-24 w-full resize-none rounded-lg border border-gray-300 p-3 focus:outline-none"
                  />
                </div>

                {/* Policy */}
                <div className="p-text-14 font-medium text-black">
                  <p className="">*Refund Information:</p>
                  <p className="text-dark-gray text-wrap">
                    If your payment is already completed the refund will be processed according to our{" "}
                    <Link href={allRoutes.refundPolicy} className="text-black underline">
                      refund policy.
                    </Link>
                  </p>
                </div>
                {/* Actions */}
                <div className="flex gap-2 md:gap-6">
                  <Button type="button" variant="outline-black" className="flex-1 2xl:h-11" onClick={() => onOpenChange(false)}>
                    Keep order
                  </Button>

                  <Button type="submit" className="flex-1 2xl:h-11">
                    {loading ? <Loader2 className="animate-spin" /> : null}CANCEL
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* <ResponseStatusModal
        icon={
          <div className="bg-primary/10 text-primary size-15 rounded-full p-3.5">
            <PackageX className="size-full!" />
          </div>
        }
        title="Order Cancelled"
        h3Text="Your order has been cancelled"
        orderId={orderId}
        onOpenChange={setCancelStatusOpen}
        open={cancelStatusOpen}
        description={
          <p className="p-text-16 leading-6 text-[#777]">
            Your order has been <span className="text-primary">successfully cancelled</span>. A refund of $XX will be processed within 5–7
            business days.
          </p>
        }
      /> */}
      <ResponseStatusModal
        icon={
          <div className="bg-secondary/10 text-secondary size-15 rounded-full p-3.5">
            <TriangleAlert className="size-full!" />
          </div>
        }
        title="Unable to Cancel Order"
        h3Text={`Your order has already been processed`}
        orderId={orderId}
        onOpenChange={setCancelStatusOpen}
        open={cancelStatusOpen}
        description={
          <p className="p-text-16 leading-6 text-[#777]">
            This order is already processed and <span className="text-secondary">cannot be cancelled</span>. You may request a return after
            delivery.{" "}
          </p>
        }
      />
    </>
  );
}
