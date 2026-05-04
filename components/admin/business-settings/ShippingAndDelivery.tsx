"use client";

import { updateBusinessSettings } from "@/actions/admin/business-settings-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SHIPPING_ZONES, ShippingZone, ZONE_LABELS } from "@/config/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { ShippingSettingsFormValues, shippingSettingsSchema } from "./schemas";

interface ShippingSettingsFormProps {
  defaultValues?: Partial<ShippingSettingsFormValues>;
}

export default function ShippingAndDeliveryForm({ defaultValues = {} }: ShippingSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(shippingSettingsSchema),
    defaultValues: {
      shippingZones: defaultValues.shippingZones || [],
      shippingCosts: SHIPPING_ZONES.map((zone) => ({
        zone: zone as ShippingZone,
        cost: defaultValues.shippingCosts?.find((c) => c.zone === zone)?.cost || 0,
      })),
      shippingTimeText: defaultValues.shippingTimeText || "",
    },
  });

  const watchActiveZones = (useWatch({
    control: form.control,
    name: "shippingZones",
  }) || []) as ShippingZone[];

  const handleSubmit = async (data: Partial<ShippingSettingsFormValues>) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Saving shipping settings...",
    });

    try {
      await updateBusinessSettings(data, "shipping");

      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: "Shipping settings updated successfully!",
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
        {/* Shipping Cost Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Cost Setup</CardTitle>
            <CardDescription>
              Configure delivery zones and shipping costs. Shipping charges will be calculated automatically at checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Select Shipping Zones */}
            <div className="bg-background @container rounded-md border p-4">
              <Label className="mb-4 block text-base font-semibold">Select Shipping Zones</Label>
              <div className="bg-background flex flex-wrap gap-y-4 rounded-md border p-4">
                {SHIPPING_ZONES.map((zone) => {
                  const isActive = watchActiveZones.includes(zone as ShippingZone);
                  const label = ZONE_LABELS[zone] || zone;

                  return (
                    <div key={zone} className="flex shrink-0 items-center gap-2 pr-4 @md:basis-1/3">
                      <Checkbox
                        id={`zone-checkbox-${zone}`}
                        checked={isActive}
                        onCheckedChange={(checked) => {
                          const currentZones = form.getValues("shippingZones") || [];
                          if (checked) {
                            form.setValue("shippingZones", [...currentZones, zone as ShippingZone], {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          } else {
                            form.setValue(
                              "shippingZones",
                              currentZones.filter((z) => z !== zone),
                              { shouldDirty: true, shouldValidate: true }
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`zone-checkbox-${zone}`} className="cursor-pointer text-sm font-medium">
                        {label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Coast Table */}
            <div className="bg-background rounded-md border">
              <div className="bg-muted/30 grid grid-cols-[1fr_1fr] gap-4 p-4 text-sm font-semibold">
                <div className="text-center font-bold">Zone</div>
                <div className="text-center font-bold">Shipping cost (BDT)</div>
              </div>
              <div className="space-y-2 p-4">
                {SHIPPING_ZONES.map((zone, index) => {
                  const label = ZONE_LABELS[zone] || zone;

                  return (
                    <div key={zone} className="grid grid-cols-[1fr_1fr] items-center gap-4 border-b pb-2 last:border-0">
                      <div className="text-center text-sm font-medium">{label}</div>
                      <div>
                        <InputField name={`shippingCosts.${index}.cost`} type="number" placeholder="Cost" inputClassName="h-10 text-left" />
                      </div>
                    </div>
                  );
                })}

                {/* <div className="flex items-center gap-4 pt-4">
                  <Button type="button" variant="ghost" className="h-auto gap-2 p-0 font-semibold hover:bg-transparent" disabled>
                    <PlusCircle className="h-4 w-4" />
                    Add Shipping Zone
                  </Button>
                  <div className="flex-1 border-b border-dashed"></div>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Time */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Time</CardTitle>
            <CardDescription>Estimated shipping time text shown to customers</CardDescription>
          </CardHeader>
          <CardContent className="grid space-y-6 @2xl:grid-cols-2 @2xl:gap-6">
            <InputField
              name="shippingTimeText"
              label="Estimated Shipping Time Text"
              type="text"
              placeholder="Ex. 2 to 3 working days"
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
