"use client";

// import { stockUpdateAction } from "@/actions/vendor/product/stock-actions"; // update path as needed
import { productStockUpdate } from "@/actions/admin/product-management/request-restock-action";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useFormSheet } from "@/context/FormSheetContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Product, TotalStockFormSchema, TotalStockFormValues } from "./type";

// ─── Component ────────────────────────────────────────────
export default function ProductStockForm({ product, totalRequest }: { product: Product; totalRequest: number }) {
  const { closeSheet } = useFormSheet();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TotalStockFormValues>({
    resolver: zodResolver(TotalStockFormSchema),
    defaultValues: {
      sellingPrice: product?.sellingPrice ?? 0,
      stockQuantity: product?.stockQuantity ?? 0,
    },
  });

  const handleSubmit = async (data: TotalStockFormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Updating stock...",
    });

    try {
      const updateResponse: any = await productStockUpdate({
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
      sellingPrice: product?.sellingPrice ?? 0,
      stockQuantity: product?.stockQuantity ?? 0,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-6">
        <div className="w-[350px] space-y-6 rounded bg-[#F4F4F4] p-5 pt-6">
          {/* Total Number of Request */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Total Number of Request</p>
            <p className="text-3xl font-bold text-red-500">{totalRequest ?? 0}</p>
          </div>

          <hr className="border-border" />

          {/* Selling Price */}
          <InputField name="sellingPrice" label="Selling Price" type="number" placeholder="Enter Selling Price" />

          {/* Main Stock */}
          <InputField name="stockQuantity" label="Main Stock" type="number" placeholder="Enter Main Stock" />
        </div>

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
