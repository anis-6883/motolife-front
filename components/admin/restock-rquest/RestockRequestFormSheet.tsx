"use client";

import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useFormSheet } from "@/context/FormSheetContext";
import Image from "next/image";
import ProductAttributeForm from "./ProductAttributeForm";
import ProductStockForm from "./ProductStockForm";
import { RestockRequest } from "./type";

// ─── Sub-components ──────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-1 text-sm">
      <span className="text-muted-foreground w-28 shrink-0">{label}</span>
      <span className="text-foreground font-medium">: {value}</span>
    </div>
  );
}

export default function RestockRequestFormSheet({ restockRequest }: { restockRequest: RestockRequest }) {
  const { isOpen, closeSheet } = useFormSheet();

  const totalRequests = restockRequest.product?.variants?.reduce((sum, v: any) => sum + (v.numberOfRequests ?? 0), 0) ?? 0;

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="scrollbar-none overflow-y-auto px-10 sm:max-w-lg xl:w-[62%] xl:max-w-none dark:bg-[#18181C] dark:text-white">
        {/* ── Top Section ── */}
        <div className="mt-0 flex flex-col gap-3 py-6">
          <SheetTitle className="text-xl font-semibold dark:text-white">Product Restock Request Details</SheetTitle>
          {/* Product header + stat cards */}
          <Card className="flex flex-col items-start gap-4 px-4 sm:flex-row">
            {/* Thumbnail */}
            <div className="bg-muted/30 flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
              {restockRequest.product?.thumbnail ? (
                <Image
                  src={restockRequest.product?.thumbnail}
                  alt={restockRequest.product?.name}
                  width={144}
                  height={144}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              ) : (
                <span className="text-muted-foreground text-xs">No image</span>
              )}
            </div>

            {/* Name + general + price info */}
            <div className="flex-1">
              <h2 className="text-lg leading-tight font-bold uppercase">{restockRequest.product?.name}</h2>

              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 sm:grid-cols-2">
                {/* General Information */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-widest uppercase">General Information</p>
                  <InfoRow
                    label="Category"
                    value={
                      typeof restockRequest.product?.category === "object"
                        ? (restockRequest.product?.category as any)?.name
                        : restockRequest.product?.category
                    }
                  />
                  <InfoRow
                    label="Sub Category"
                    value={
                      typeof restockRequest.product?.subCategory === "object"
                        ? (restockRequest.product?.subCategory as any)?.name
                        : restockRequest.product?.subCategory
                    }
                  />
                  <InfoRow
                    label="Brand"
                    value={
                      typeof restockRequest.product?.brand === "object"
                        ? (restockRequest.product?.brand as any)?.name
                        : restockRequest.product?.brand
                    }
                  />
                  <InfoRow label="Product SKU" value={restockRequest.product?.sku} />
                </div>

                {/* Price Information */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-widest uppercase">Price Information</p>
                  <InfoRow label="Selling Price" value={`${restockRequest.product?.sellingPrice?.toLocaleString()} BDT`} />
                  <InfoRow label="Buying Price" value={`${restockRequest.product?.buyingPrice?.toLocaleString()} BDT`} />
                  <InfoRow label="Discount Price" value={`${restockRequest.product?.discountPrice?.toLocaleString()} BDT`} />
                  <InfoRow label="Shipping Cost" value="80 BDT" />
                </div>
              </div>
            </div>

            {/* Stat cards */}
            {restockRequest?.variantRequests?.length > 0 ? (
              <div className="flex w-[300px] flex-col gap-3 rounded bg-[#F4F4F4] p-5">
                <div>
                  <p>Total Number of Request</p>
                  <p className="text-2xl font-semibold text-red-500">{totalRequests}</p>
                </div>

                <div>
                  <p>Main Stock</p>
                  <p className="text-2xl font-semibold text-red-500">{restockRequest.product?.stockQuantity ?? 0}</p>
                </div>
              </div>
            ) : (
              <ProductStockForm product={restockRequest.product} totalRequest={restockRequest?.totalRequests} />
            )}
          </Card>

          {restockRequest?.variantRequests?.length > 0 && <ProductAttributeForm product={restockRequest?.product} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
