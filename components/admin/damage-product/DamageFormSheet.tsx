"use client";

import { updateDamageUnit } from "@/actions/admin/product-management/damage-product-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useFormSheet } from "@/context/FormSheetContext";
import { DamageProductUnit } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export default function DamageFormSheet({
  damageProduct,
  setSelectDamageProduct,
}: {
  damageProduct: (DamageProductUnit & { mode: "show" | "edit" }) | null;
  setSelectDamageProduct: (value: any) => any;
}) {
  const { isOpen, closeSheet } = useFormSheet();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    damagePercentage: z.number().min(1, "Damage percentage is required!"),
    damageDescription: z.string().min(1, "Damage description is required!"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      damagePercentage: 0,
      damageDescription: "",
    },
  });

  // Form Resetter
  const resetForm = () => {
    closeSheet();
    form.reset({
      damagePercentage: 0,
      damageDescription: "",
    });
    setSelectDamageProduct(null);
  };

  useEffect(() => {
    if (damageProduct) {
      form.reset({
        damagePercentage: damageProduct?.damagePercentage,
        damageDescription: damageProduct?.damageDescription,
      });
    }
  }, [damageProduct, form]);

  // Submit Handler
  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Updating the damage product...",
    });

    try {
      if (damageProduct) {
        await updateDamageUnit(damageProduct?._id, data);
      }
      setIsLoading(false);
      Toast.remove(t);
      Toast.success({ title: "Success", description: "Damage product updated successfully!" });
      resetForm();
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to update damage product!" });
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => {
        closeSheet();
        if (setSelectDamageProduct) {
          setSelectDamageProduct(null);
        }
      }}
    >
      <SheetContent className="scrollbar-none overflow-y-auto px-10 sm:max-w-lg dark:bg-[#18181C] dark:text-white">
        <div className="mt-0 flex flex-col gap-3 py-6">
          <div>
            <SheetTitle className="text-primary text-xl dark:text-white">
              {damageProduct?.mode === "edit" ? "Update" : "Show"} Damage Product
            </SheetTitle>
            <SheetDescription>
              {damageProduct?.mode === "edit" ? "Update" : "Show"} the product damage information of a single unit!
            </SheetDescription>
          </div>
          <FormProvider {...form}>
            <div className="mt-4">
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
                  <CardHeader>
                    <div>
                      <div className="relative flex w-full max-w-2xl flex-col items-center justify-center overflow-hidden text-center text-gray-600 md:aspect-16/5">
                        <img
                          src={damageProduct?.product?.thumbnail}
                          alt={damageProduct?.product?.name}
                          className="h-full rounded object-contain"
                        />
                      </div>

                      <div className="bg-primary mt-4 space-y-1 rounded-lg p-4 text-white">
                        <p className="text-sm">
                          <span className="font-semibold">Product SKU:</span> {damageProduct?.sku}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Product Name:</span> {damageProduct?.product?.name}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Category:</span> {damageProduct?.category?.name}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardHeader>
                    <CardTitle>Damage Product Information Setup</CardTitle>
                    <CardDescription>Basic information about the damage product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <InputField
                      disabled={damageProduct?.mode !== "edit"}
                      name="damagePercentage"
                      label="Damage Percentage"
                      placeholder="e.g. 10%"
                      type="number"
                      required
                    />
                    <InputField
                      disabled={damageProduct?.mode !== "edit"}
                      name="damageDescription"
                      label="Damage Description"
                      placeholder="Enter damage description"
                      type="textarea"
                      required
                    />
                  </CardContent>
                </Card>

                <div className="mt-5 flex justify-between gap-4 md:justify-end">
                  <Button onClick={closeSheet} type="button" variant="outline" disabled={isLoading} className="max-md:px-2">
                    Cancel
                  </Button>

                  {damageProduct?.mode === "show" && (
                    <Button className="cool" type="button" onClick={() => setSelectDamageProduct({ ...damageProduct, mode: "edit" })}>
                      Want to Edit!
                    </Button>
                  )}

                  {damageProduct?.mode === "edit" && (
                    <Button className="cool" type="submit" disabled={isLoading}>
                      Submit
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </FormProvider>
        </div>
      </SheetContent>
    </Sheet>
  );
}
