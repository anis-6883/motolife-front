"use client";

import { updateSpecialDiscount } from "@/actions/order-management/order-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import MtModal from "@/components/ui/MtModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { IOrderDetail } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const baseDiscountSchema = z.object({
  discountType: z.enum(["flat", "percentage"]),
  discountValue: z.coerce.number().int("Must be a whole number").min(0, "Must be at least 0"),
  reason: z.string().optional(),
});

type DiscountFormValues = z.infer<typeof baseDiscountSchema>;

interface SpecialDiscountModalProps {
  open: boolean;
  onClose: () => void;
  orderData: IOrderDetail;
}

export default function SpecialDiscountModal({ open, onClose, orderData }: SpecialDiscountModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations based on order data
  const subtotal = orderData?.subtotal || 0;
  const deliveryCharge = orderData?.shippingFee || 0;
  const couponDiscount = orderData?.discount || 0;
  const tax = orderData?.tax || 0;

  const totalBeforeDiscount = useMemo(() => {
    return Math.max(0, subtotal + deliveryCharge + tax - couponDiscount);
  }, [subtotal, deliveryCharge, tax, couponDiscount]);

  const discountSchema = useMemo(
    () =>
      baseDiscountSchema.superRefine((data, ctx) => {
        if (data.discountType === "percentage" && data.discountValue > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Percentage cannot exceed 100%",
            path: ["discountValue"],
          });
        }
        if (data.discountType === "flat" && data.discountValue > totalBeforeDiscount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Discount cannot exceed total amount (BDT ${totalBeforeDiscount.toFixed(2)})`,
            path: ["discountValue"],
          });
        }
      }),
    [totalBeforeDiscount]
  );

  const form = useForm<DiscountFormValues>({
    mode: "onChange",
    resolver: zodResolver(discountSchema as any),
    defaultValues: {
      discountType: orderData?.specialDiscount?.discountType || "flat",
      discountValue: orderData?.specialDiscount?.discountValue || 0,
      reason: orderData?.specialDiscount?.reason || "",
    },
  });

  const { control, setValue, handleSubmit, reset } = form;

  useEffect(() => {
    if (open) {
      reset({
        discountType: orderData?.specialDiscount?.discountType || "flat",
        discountValue: orderData?.specialDiscount?.discountValue || 0,
        reason: orderData?.specialDiscount?.reason || "",
      });
    }
  }, [open, orderData, reset]);

  const discountType = useWatch({ control, name: "discountType" });
  const discountValue = useWatch({ control, name: "discountValue" }) || 0;

  const onSubmit: SubmitHandler<DiscountFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      const res = await updateSpecialDiscount(orderData._id, {
        specialDiscount: data.discountValue === 0 ? null : data,
      });

      if (res?.data?.status) {
        Toast.success({
          title: "Success",
          description: res?.data?.message || "Special discount applied successfully!",
        });
        onClose();
      } else {
        Toast.error({
          title: "Failed",
          description: (res as any)?.error || "Failed to apply special discount!",
        });
      }
    } catch (error) {
      Toast.error({
        title: "Failed",
        description: (error as any)?.message || "Failed to apply special discount!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setValue("discountValue", 0);
  }, [discountType, setValue]);

  const specialDiscountAmount = discountType === "flat" ? discountValue : (totalBeforeDiscount * discountValue) / 100;
  const totalAfterDiscount = Math.max(0, totalBeforeDiscount - specialDiscountAmount);

  return (
    <MtModal open={open} onClose={onClose} title="Special Discount for Customer" maxWidth={500}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            name="discountType"
            label="Discount Type"
            type="radio-group"
            options={[
              { label: "Flat", value: "flat" },
              { label: "Percentage (%)", value: "percentage" },
            ]}
            radioGroupClassName="mt-0.5"
            className="flex-row justify-between"
            required
          />

          <InputField
            name="discountValue"
            label={discountType === "flat" ? "Discount Price (BDT)" : "Discount Percentage (%)"}
            type="number"
            placeholder="0"
            required
            allowDecimal={false}
          />

          <InputField name="reason" label="Reason for discount" type="textarea" placeholder="Optional internal note" rowCount={4} />

          <div className="space-y-2 border-t border-gray-100 pt-2">
            {[
              { label: "Subtotal", value: `${subtotal.toFixed(2)} BDT` },
              { label: "Delivery Charge", value: `${deliveryCharge.toFixed(2)} BDT` },
              { label: "Coupon Discount", value: `-${couponDiscount.toFixed(2)} BDT` },
              { label: "TAX", value: `${tax.toFixed(2)} BDT` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-light-gray">{item.label}</span>
                <span className="text-dark-gray font-semibold">{item.value}</span>
              </div>
            ))}

            <div className="border-primary flex justify-between border p-1 text-sm">
              <span className="text-light-gray">Special Discount</span>
              <span className="text-dark-gray font-semibold">-{specialDiscountAmount?.toFixed?.(2)} BDT</span>
            </div>

            <div className="flex justify-between border-t border-gray-100 pt-2 text-sm font-bold text-gray-900">
              <span>Total Before Discount</span>
              <span>{totalBeforeDiscount.toFixed(2)} BDT</span>
            </div>

            <div className="text-primary flex justify-between text-sm font-bold">
              <span>Total After Discount</span>
              <span>{totalAfterDiscount.toFixed(2)} BDT</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-full px-8">
              Cancel
            </Button>
            <Button type="submit" variant="black" disabled={isSubmitting} className="rounded-full px-8">
              {isSubmitting ? "Applying..." : "Apply Discount"}
            </Button>
          </div>
        </form>
      </Form>
    </MtModal>
  );
}
