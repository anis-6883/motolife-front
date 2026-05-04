"use client";

import { createOfferProduct } from "@/actions/admin/offers-management/offers-actions";
import { getComboOfferList, getProductList } from "@/actions/all-dropdownlist/all-dropdownlist-action";
import AsyncSelectField from "@/components/form/AsynSelectFiled";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

export interface FlashSale {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  resourceType: string;
  productId?: string;
  categoryId?: string;
  sellerId?: string;
  comboProductId?: string;
  items: any[];
  status: boolean;
  slug: string;
  softDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const formSchema = z
  .object({
    discountType: z.enum(["flat", "percentage"], {
      message: "Discount type is required!",
    }),
    discountValue: z.coerce.number().optional().default(0),
    product: z.string().min(1, "Select at least one product!"),
    sellingPrice: z.coerce.number().optional(),
  })
  .superRefine((data, ctx) => {
    const { sellingPrice, discountType, discountValue } = data;

    if (!sellingPrice || sellingPrice === 0) {
      return;
    }

    if (discountValue === undefined || discountValue < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Discount value must be greater than 0!",
      });
      return;
    }

    if (discountType === "flat" && discountValue > sellingPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Flat discount cannot be greater than selling price",
      });
    }

    if (discountType === "percentage" && discountValue > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Percentage discount cannot be greater than 100",
      });
    }
  });

interface FormValues {
  discountType: "flat" | "percentage";
  discountValue?: number;
  product: string;
  sellingPrice?: number;
}

export default function FlashSaleProductForm({
  sale,
  id,
  offerList,
  vendorId,
}: {
  sale: FlashSale;
  id: string;
  offerList: any;
  vendorId?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const [pendingProduct, setPendingProduct] = useState<any>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const [resetKey, setResetKey] = useState(0);

  type FormValues = z.output<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      discountType: "flat",
      discountValue: 0,
      product: "",
      sellingPrice: 0,
    },
  });

  const {
    control,
    formState: { errors },
  } = form;

  const sellingPrice = useWatch({ control, name: "sellingPrice" }) ?? 0;
  const discountType = useWatch({ control, name: "discountType" });
  const discountValue = useWatch({ control, name: "discountValue" });

  const calculateFinalPrice = () => {
    if (!sellingPrice || !discountValue) return null;

    if (discountType === "percentage") {
      const discount = (sellingPrice * discountValue) / 100;
      const final = sellingPrice - discount;
      return { discount, final };
    }

    if (discountType === "flat") {
      const final = sellingPrice - discountValue;
      return { discount: discountValue, final: final < 0 ? 0 : final };
    }

    return null;
  };

  const pricePreview = calculateFinalPrice();

  const handleSelectProduct = (option: any, onSelect: (v: any) => void) => {
    if (option?.isOffer) {
      setPendingProduct({ option, onSelect });
      setShowOfferModal(true);
      return;
    }

    onSelect(option);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const toastId = Toast.loading({
      title: "Loading",
      description: "Adding product...",
    });

    try {
      const res = await createOfferProduct(data, id);

      if (!res?.ok) throw new Error(res?.message);

      Toast.success({
        title: "Success",
        description: "Product added successfully",
      });

      form.reset({
        discountType: "flat",
        discountValue: 0,
        product: "",
        sellingPrice: 0,
      });

      setResetKey((prev) => prev + 1);
    } catch (err: any) {
      Toast.error({
        title: "Error",
        description: err.message,
      });
    } finally {
      Toast.remove(toastId);
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <AsyncSelectField
          key={resetKey}
          name="product"
          label="Product"
          loadOptions={async (search, page) => {
            const res: any =
              sale.resourceType === "combo"
                ? await getComboOfferList({ search, page, limit: 10, seller: vendorId })
                : await getProductList({
                    search,
                    page,
                    limit: 10,
                    seller: vendorId,
                  });

            const existingProductIds = offerList?.docs?.map((item: any) => item._id) || [];

            const products = res?.data?.docs ?? [];

            const options = products.filter((p: any) => !existingProductIds.includes(p._id));

            return {
              options: options,
              hasMore: res?.data?.pagination?.hasNextPage,
            };
          }}
          cb={(option) => {
            handleSelectProduct(option, (opt) => {
              form.setValue("sellingPrice", opt?.sellingPrice || 0);
              form.setValue("discountValue", 0);
            });
          }}
        />

        {sellingPrice > 0 && (
          <div className="bg-muted/30 rounded-lg border px-4 py-3 dark:border-[#2a2a2e] dark:bg-[#1f1f23]">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Selling Price</span>
                <span className="font-semibold">{sellingPrice.toLocaleString()} BDT</span>
              </div>

              {pricePreview && (
                <>
                  <div className="text-muted-foreground">→</div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-semibold text-orange-500">-{pricePreview.discount.toLocaleString()} BDT</span>
                  </div>

                  <div className="text-muted-foreground">→</div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Final Price</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{pricePreview.final.toLocaleString()} BDT</span>
                  </div>
                </>
              )}
            </div>

            {pricePreview && pricePreview.final <= 0 && (
              <p className="text-destructive mt-2 text-xs">⚠️ Discount exceeds the selling price!</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            name="discountType"
            label="Discount Type"
            type="select"
            options={[
              { value: "flat", label: "Flat" },
              { value: "percentage", label: "Percentage" },
            ]}
          />

          <InputField name="discountValue" minNum={0} label="Discount Value" type="number" />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            Add Product
          </Button>
        </div>
      </form>

      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[420px] rounded-lg bg-white p-5 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">Offer Warning</h2>

            <p className="text-muted-foreground mt-2 text-sm">
              This product already has an active offer. If you continue, the previous price will be restored.
            </p>

            <div className="bg-muted/40 mt-3 rounded-md p-3 text-sm">
              <p>
                Previous Price: <b>{pendingProduct?.option?.sellingPrice} BDT</b>
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowOfferModal(false);
                  setPendingProduct(null);
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  const { option, onSelect } = pendingProduct;

                  onSelect(option);

                  setShowOfferModal(false);
                  setPendingProduct(null);
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </FormProvider>
  );
}
