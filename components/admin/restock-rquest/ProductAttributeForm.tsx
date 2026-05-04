"use client";

import { stockAttributeUpdateAction } from "@/actions/admin/product-management/request-restock-action";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useFormSheet } from "@/context/FormSheetContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Product, restockAttributeFormSchema, ReStockFormValues } from "./type";

// ─── Component ────────────────────────────────────────────
export default function ProductAttributeForm({ product }: { product: Product }) {
  const { closeSheet } = useFormSheet();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ReStockFormValues>({
    resolver: zodResolver(restockAttributeFormSchema),
    defaultValues: {
      variants: (product?.variants ?? []).map((v: any) => ({
        variation: v.variation ?? "",
        sku: v.sku ?? "",
        variantPrice: v.variantPrice ?? 0,
        stock: v.stock ?? 0,
        ...v,
      })),
    },
  });
  console.log("formData", form.watch("variants"));
  console.log("product", product);
  const { fields } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const handleSubmit = async (data: ReStockFormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Updating stock...",
    });

    try {
      const updateResponse: any = await stockAttributeUpdateAction({
        id: product?._id,
        formData: data,
      });
      if (updateResponse?.statusCode !== 200 && updateResponse?.error) {
        throw new Error(updateResponse?.error);
      }
      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: "Stock updated successfully!",
      });

      closeSheet();
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || "Failed to update stock!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    form.reset({
      variants: (product?.variants ?? []).map((v: any) => ({
        variation: v.variation ?? "",
        sku: v.sku ?? "",
        variantPrice: v.variantPrice ?? 0,
        stock: v.stock ?? 0,
      })),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Attribute wise Stock</CardTitle>
            <CardDescription>Update variant-wise price and stock. Variation and SKU are read-only.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-xl border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b dark:border-[#2a2a2e] dark:bg-[#1f1f23]">
                      <th className="w-12 px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">SL</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Attribute Variation</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">
                        Variation Wise Price <span className="text-muted-foreground font-normal normal-case">(BDT)</span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">No. of Requests</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">SKU</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">Variation Wise Stock</th>
                    </tr>
                  </thead>

                  <tbody>
                    {fields.map((field, index) => {
                      const original = product?.variants?.[index] as any;
                      return (
                        <tr
                          key={field.id}
                          className="hover:bg-muted/20 border-b transition-colors last:border-0 dark:border-[#2a2a2e] dark:hover:bg-[#1f1f23]"
                        >
                          {/* SL */}
                          <td className="text-muted-foreground px-4 py-3">{index + 1}</td>

                          {/* Variation — read-only, plain text, no InputField */}
                          <td className="px-4 py-3 font-medium">{original?.variation ?? "—"}</td>

                          {/* Variant Price — editable via InputField */}
                          <td className="px-4 py-3">
                            <InputField name={`variants.${index}.variantPrice`} type="number" placeholder="0" className="w-32" />
                          </td>

                          {/* Number of Requests — read-only badge */}
                          <td className="px-4 py-3">
                            <span className="bg-muted inline-flex min-w-[2.25rem] items-center justify-center rounded-md px-2.5 py-1 text-sm font-medium dark:bg-[#2a2a2e]">
                              {original?.numberOfRequests ?? 0}
                            </span>
                          </td>

                          {/* SKU — read-only plain text */}
                          <td className="text-muted-foreground px-4 py-3">{original?.sku ?? "—"}</td>

                          {/* Stock — editable via InputField */}
                          <td className="px-4 py-3">
                            <InputField name={`variants.${index}.stock`} type="number" placeholder="0" className="w-24" />
                          </td>
                        </tr>
                      );
                    })}

                    {fields.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center text-sm">
                          No variants found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Actions ── */}
        <div className="mt-5 flex justify-between gap-4 md:justify-end">
          <Button type="button" variant="outline" disabled={isLoading} onClick={handleReset} className="max-md:px-2">
            Reset
          </Button>
          <Button type="submit" className="cool" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
