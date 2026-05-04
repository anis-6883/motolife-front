"use client";

import { updateBusinessSettings } from "@/actions/admin/business-settings-actions";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { DeliveryResponsibility } from "@/config/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { OrderSettingsFormValues, orderSettingsSchema } from "./schemas";

// ---------------------- Options ----------------------
const refundOrderValidityOptions = [
  {
    value: "3",
    label: "3 days",
  },
  {
    value: "7",
    label: "7 days",
  },
  {
    value: "15",
    label: "15 Days",
  },
  {
    value: "30",
    label: "30 Days",
  },
];

const freeDeliveryResponsibilityOptions = [
  {
    value: DeliveryResponsibility.ADMIN,
    label: "Admin",
  },
  {
    value: DeliveryResponsibility.SELLER,
    label: "Vendors",
  },
];

// ---------------------- Component ----------------------

interface OrderSettingsFormProps {
  defaultValues?: Partial<OrderSettingsFormValues>;
}

export default function OrderSettingsForm({ defaultValues = {} }: OrderSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(orderSettingsSchema),
    defaultValues: {
      guestCheckoutEnabled: defaultValues.guestCheckoutEnabled ?? true,
      //   showVatOrTax: defaultValues.showVatOrTax ?? true,
      isFreeDeliveryEnabled: defaultValues.isFreeDeliveryEnabled ?? false,
      freeDeliveryThreshold: defaultValues.freeDeliveryThreshold ?? 0,
      freeDeliveryResponsibility: defaultValues.freeDeliveryResponsibility ?? DeliveryResponsibility.ADMIN,
      maxRefundableDays: String(defaultValues.maxRefundableDays ?? 3),
    },
  });

  const handleSubmit = async (data: Partial<OrderSettingsFormValues>) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Saving order settings...",
    });

    try {
      await updateBusinessSettings({ ...data, maxRefundableDays: Number(data.maxRefundableDays) }, "order");

      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: "Order settings updated successfully!",
      });
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || "Failed to update settings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-6">
        {/* General Setup */}
        <Card>
          <CardHeader>
            <CardTitle>General Setup</CardTitle>
          </CardHeader>
          <CardContent className="grid space-y-6 @2xl:grid-cols-2 @2xl:gap-6">
            <FormSwitch
              name="guestCheckoutEnabled"
              label="Guest Checkout"
              description="If enabled, customer can complete order checkout process without the need to create or log in to an account"
            />
            {/* <FormSwitch
              className="md:h-full"
              name="showVatOrTax"
              label="Show VAT or Tax Amount"
              description="Enable this to display the applied VAT or tax amount separately to customer or vendor"
            /> */}
          </CardContent>
        </Card>

        {/* Setup Free Delivery */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Setup Free Delivery</CardTitle>
              <CardDescription>If enabled, free delivery will be available when customers order over a certain amount</CardDescription>
            </div>
            <FormField
              control={form.control}
              name="isFreeDeliveryEnabled"
              render={({ field }) => (
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              )}
            />
          </CardHeader>
          <CardContent className="grid space-y-6 @2xl:grid-cols-2 @2xl:gap-6">
            <InputField
              name="freeDeliveryResponsibility"
              label="Free Delivery Responsibility"
              type="radio-group"
              radioGroupClassName="border-input bg-background min-h-10 [&>*]:pr-5 gap-x-0 gap-y-2.5 rounded-md border py-2 px-3 [&>*]:basis-1/2 [&>*]:shrink-0 [&>*]:grow-0 flex flex-wrap [&>*]:whitespace-nowrap"
              options={freeDeliveryResponsibilityOptions}
              required
            />
            <InputField
              name="freeDeliveryThreshold"
              label="Free Delivery Threshold Amount (BDT)"
              type="number"
              placeholder="1500"
              required
            />
          </CardContent>
        </Card>

        {/* Refund Order */}
        <Card>
          <CardHeader>
            <CardTitle>Refund Order</CardTitle>
            <CardDescription>Here you can setup how many days a customer has to send a refund request</CardDescription>
          </CardHeader>
          <CardContent className="grid space-y-6 @2xl:grid-cols-2 @2xl:gap-6">
            <InputField
              name="maxRefundableDays"
              label="Refund Order Validity (Days)"
              type="radio-group"
              options={refundOrderValidityOptions}
              radioGroupClassName="border-input bg-background min-h-10 [&>*]:pr-5 gap-x-0 gap-y-2.5 rounded-md border py-2 px-3 [&>*]:basis-1/4 [&>*]:shrink-0 [&>*]:grow-0 flex flex-wrap [&>*]:whitespace-nowrap"
              required
            />
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex justify-end">
          <Button type="submit" className="rounded-full" variant={"black"} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
