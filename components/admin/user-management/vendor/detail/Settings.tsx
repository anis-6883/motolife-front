"use client";
import { getVendorById, updateVendor } from "@/actions/admin/user-management/vendor-actions";
import FormSwitch from "@/components/form/FormSwitch";
import Toast from "@/components/shared/Toast";
import { Form } from "@/components/ui/form";
import { Vendor } from "@/lib/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Settings({ id }: { id: string }) {
  const [data, setData] = useState<Vendor | null>(null);

  const form = useForm({
    defaultValues: {
      showSellerName: false,
      isAvailable: false,
      isOnVacation: false,
    },
  });

  useEffect(() => {
    const fetchVendor = async () => {
      const response = await getVendorById(id);
      setData(response?.data?.data);
    };
    fetchVendor();
  }, [id]);

  useEffect(() => {
    if (data) {
      form.reset({
        showSellerName: data?.showSellerName ?? false,
        isAvailable: data?.businessSettings?.isAvailable ?? false,
        isOnVacation: data?.businessSettings?.vacation?.isOnVacation ?? false,
      });
    }
  }, [data, form]);

  useEffect(() => {
    const subscription = form.watch(async (value, { name, type }) => {
      if (type === "change" && name) {
        const payload = {
          showSellerName: value.showSellerName,
          businessSettings: {
            isAvailable: value.isAvailable,
            vacation: {
              isOnVacation: value.isOnVacation,
            },
          },
        };

        const toastId = Toast.loading("Updating setting...");
        try {
          const res = await updateVendor(id, payload);
          const response = res as any;
          if (response?.data) {
            Toast.success(response?.message || "Setting updated successfully", { id: toastId });
          } else {
            Toast.error(response?.error || response?.message || "Failed to update setting", { id: toastId });
          }
        } catch (error) {
          console.error(error);
          Toast.error("An error occurred while updating the setting", { id: toastId });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, id]);

  return (
    <>
      <div className="rounded-xl border bg-white p-6">
        <h3 className="p-text-18 text-dark-gray mb-5 flex items-center gap-2 font-semibold">Settings</h3>
        <Form {...form}>
          <form className="space-y-6">
            <FormSwitch
              name="showSellerName"
              label="Show Vendor Name on Product Page"
              description="When enabled, the vendor name will be visible on the product details page. When disabled, the vendor information will remain hidden from customers."
            />
            <FormSwitch
              name="isAvailable"
              label="Store Availability"
              description="Disabling this option will temporarily close this vendor shop on the customer website"
            />
            <FormSwitch
              name="isOnVacation"
              label="Vacation Mode"
              description="If you turn on, vendor will go to vacation mode. Customer can view their shop but cannot order."
            />
          </form>
        </Form>
      </div>
    </>
  );
}
