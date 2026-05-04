"use client";

import { updateOrderById } from "@/actions/order-management/order-actions";
import InputField from "@/components/form/InputField";
import { Icons } from "@/components/icons";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ORDER_STATUS_OPTIONS } from "@/config/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  managerId: z.string().min(1, "Manager is required"),
  status: z.string().optional(),
  orderMode: z.enum(["10", "15", "20", "custom"]),
  orders: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  adminList: { _id: string; name: string; image?: string }[];
  orders: { _id: string; orderId: string }[];
};

export default function AssignManagerModal({ open, onClose, adminList, orders }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderMode: "10",
      orders: [],
    },
  });

  const orderMode = form.watch("orderMode");

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Assigning orders...",
    });

    try {
      let selectedOrders: string[] = [];

      if (data.orderMode === "10") selectedOrders = orders.slice(0, 10).map((o) => o._id);
      if (data.orderMode === "15") selectedOrders = orders.slice(0, 15).map((o) => o._id);
      if (data.orderMode === "20") selectedOrders = orders.slice(0, 20).map((o) => o._id);
      if (data.orderMode === "custom") selectedOrders = data.orders || [];

      await Promise.all(
        selectedOrders.map((id) =>
          updateOrderById(id, {
            assignedTo: data.managerId,
            ...(data.status && { status: data.status }),
          })
        )
      );

      Toast.remove(t);

      Toast.success({
        title: "Success",
        description: "Orders assigned successfully!",
      });

      form.reset();
      onClose();
    } catch (error: any) {
      Toast.remove(t);

      Toast.error({
        title: "Error",
        description: error?.message || "Failed to assign orders",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl 2xl:max-w-2xl [&>button:first-of-type]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="p-text-24 font-semibold tracking-[0.24px]">Assign to Manager</span>
            <Button variant="ghost" onClick={onClose} className="max-lg:hidden">
              <Icons.close className="size-7!" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Manager */}
            <InputField
              selectTriggerClassName="w-full"
              name="managerId"
              label="Select Manager"
              type="dropdown-select"
              placeholder="Select Manager"
              options={adminList.map((admin) => ({
                label: admin.name,
                value: admin._id,
                image: admin?.image,
              }))}
              required
            />

            {/* Order Status */}
            <InputField
              selectTriggerClassName="w-full"
              name="status"
              label="Order Status"
              type="select"
              placeholder="Select Status"
              options={ORDER_STATUS_OPTIONS}
            />

            {/* Order Mode */}
            <InputField
              selectTriggerClassName="w-full"
              name="orderMode"
              label="Select Orders"
              type="radio-group"
              options={[
                { label: "1st 10 orders", value: "10" },
                { label: "1st 15 orders", value: "15" },
                { label: "1st 20 orders", value: "20" },
                { label: "Custom Select", value: "custom" },
              ]}
            />

            {/* Custom Orders */}
            {orderMode === "custom" && (
              <InputField
                name="orders"
                label="Select Orders"
                type="react-select-multi"
                placeholder="Search orders"
                options={orders.map((o) => ({
                  label: `Order ID: ${o.orderId}`,
                  value: o._id,
                }))}
              />
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline-black" onClick={() => form.reset()}>
                Reset
              </Button>

              <Button type="submit" variant="black" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
