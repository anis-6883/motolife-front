"use client";

import { updateDamageUnitsBulk } from "@/actions/admin/product-management/damage-product-actions";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useFormSheet } from "@/context/FormSheetContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { DamageTable } from "./DamageTable";

export default function DamageTableSheet({
  damageProduct,
  setSelectDamageProduct,
}: {
  damageProduct: any | null;
  setSelectDamageProduct: (value: any) => any;
}) {
  const { isOpen, closeSheet } = useFormSheet();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    damages: z
      .array(
        z.object({
          _id: z.string().min(1, "SKU is required!"),
          selectedVariation: z.string().optional(),
          damagePercentage: z.number().min(1, "Damage percentage is required!").max(100, "Damage percentage must be at most 100!"),
          damageDescription: z.string().min(1, "Damage description is required!"),
          isDamaged: z.boolean(),
        })
      )
      .min(1, "At least one damage row is required!"),
  });

  type FormValues = {
    damages: {
      _id: string;
      selectedVariation?: string;
      damagePercentage: number;
      damageDescription: string;
      isDamaged: boolean;
    }[];
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      damages: [{ _id: "", selectedVariation: "", damagePercentage: 0, damageDescription: "", isDamaged: true }],
    },
  });

  // Form Resetter
  const resetForm = () => {
    closeSheet();
    form.reset({
      damages: [{ _id: "", selectedVariation: "", damagePercentage: 0, damageDescription: "", isDamaged: true }],
    });
    setSelectDamageProduct(null);
  };

  useEffect(() => {
    if (damageProduct) {
      form.reset({
        damages: [
          {
            _id: "",
            selectedVariation: "",
            damagePercentage: damageProduct?.damagePercentage || 0,
            damageDescription: damageProduct?.damageDescription || "",
            isDamaged: true,
          },
        ],
      });
    }
  }, [damageProduct, form]);

  // Submit Handler
  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Updating the damage products...",
    });

    try {
      if (damageProduct) {
        // Strip selectedVariation before sending to API
        const sanitizedDamages = data.damages.map((d) => ({
          _id: d._id,
          damagePercentage: d.damagePercentage,
          damageDescription: d.damageDescription,
          isDamaged: d.isDamaged,
        }));
        await updateDamageUnitsBulk(sanitizedDamages);
      }
      setIsLoading(false);
      Toast.remove(t);
      Toast.success({ title: "Success", description: "Damage products updated successfully!" });
      resetForm();
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to update damage product!" });
    }
  };

  const damages = useWatch({
    control: form.control,
    name: "damages",
  });

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
      <SheetContent className="scrollbar-none overflow-y-auto px-10 sm:max-w-6xl dark:bg-[#18181C] dark:text-white">
        <div className="mt-0 flex flex-col gap-3 py-6">
          <div>
            <SheetTitle className="text-primary text-xl dark:text-white">Damage Setup</SheetTitle>
            <SheetDescription>Mark this product as damaged and provide a reason!</SheetDescription>
          </div>
          <FormProvider {...form}>
            <div className="mt-4">
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
                  <CardHeader>
                    <div className="grid grid-cols-6 gap-x-4">
                      <div className="relative col-span-1 flex items-center justify-center">
                        <img
                          src={damageProduct?.thumbnail}
                          alt={damageProduct?.name}
                          className="rounded-lg object-contain"
                          width={100}
                          height={100}
                        />
                      </div>

                      <div className="bg-primary col-span-5 space-y-1 rounded-lg p-4 text-white">
                        <p className="text-sm">
                          <span className="font-semibold">Product SKU:</span> {damageProduct?.sku}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Product Name:</span> {damageProduct?.name}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Category:</span> {damageProduct?.category?.name}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardHeader>
                    <CardTitle>Marked Damaged Attribute</CardTitle>
                    <CardDescription>Select your damaged attributes SKU and write damage reason!</CardDescription>
                  </CardHeader>

                  <DamageTable damageProduct={damageProduct} />
                </Card>

                <div className="mt-5 flex justify-between gap-4 md:justify-end">
                  <Button onClick={closeSheet} type="button" variant="outline" disabled={isLoading} className="max-md:px-2">
                    Cancel
                  </Button>

                  <Button type="submit" disabled={isLoading || damages?.length === 0}>
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </FormProvider>
        </div>
      </SheetContent>
    </Sheet>
  );
}
