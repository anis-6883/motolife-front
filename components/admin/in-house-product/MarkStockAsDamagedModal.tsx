"use client";

import { updateStockUnit } from "@/actions/admin/product-management/in-house-product-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { IStockUnit } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const damageSchema = z.object({
  damagePercentage: z.number().min(1, "Damage percentage is required!").max(100, "Damage percentage must be at most 100!"),
  damageDescription: z.string().min(1, "Damage description is required!"),
});

type DamageValues = z.infer<typeof damageSchema>;

interface MarkStockAsDamagedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockUnit: IStockUnit | null;
}

export default function MarkStockAsDamagedModal({ open, onOpenChange, stockUnit }: MarkStockAsDamagedModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DamageValues>({
    resolver: zodResolver(damageSchema),
    defaultValues: {
      damagePercentage: 0,
      damageDescription: "",
    },
  });

  const onSubmit = async (data: DamageValues) => {
    if (!stockUnit) return;

    setIsSubmitting(true);
    const t = Toast.loading({
      title: "Status",
      description: "Updating stock unit...",
    });

    try {
      const response = (await updateStockUnit(stockUnit._id, {
        ...data,
        isDamaged: true,
      })) as any;

      Toast.remove(t);

      if (response?.data) {
        Toast.success({
          title: "Success",
          description: "Stock unit marked as damaged successfully!",
        });
        onOpenChange(false);
        form.reset();
      } else {
        Toast.error({
          title: "Failed",
          description: response?.message || response?.error || "Failed to update stock unit!",
        });
      }
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Error",
        description: error?.message || "Something went wrong!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mark as Damaged</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-primary space-y-2 rounded-lg border p-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/90">Product Name:</span>
              <span className="text-right font-medium text-white">{stockUnit?.product?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/90">SKU:</span>
              <span className="font-medium text-white">{stockUnit?.sku || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/90">Parent SKU:</span>
              <span className="font-medium text-white">{stockUnit?.parentSku || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/90">Selling Price:</span>
              <span className="font-medium text-white">{stockUnit?.sellingPrice || "N/A"}</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                name="damagePercentage"
                label="Damage Percentage (%)"
                placeholder="Enter percentage (1-100)"
                type="number"
                required
              />

              <InputField
                name="damageDescription"
                label="Damage Description"
                placeholder="Describe the damage..."
                type="textarea"
                rowCount={4}
                inputClassName="min-h-25 resize-none"
                required
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="cool">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Damage
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
