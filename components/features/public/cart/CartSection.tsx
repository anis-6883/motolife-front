"use client";

import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { allRoutes } from "@/config/constant";
import routes from "@/config/routes";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart/cartStore";
import { ChevronDown, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { CartCard } from "./CartCard";

export interface CartFormItem {
  productId: string;
  variantSku: string;
  vendorId: string;
  vendorName: string;
  name: string;
  thumbnail: string;
  variation: string;
  quantity: number;
  sellingPrice: number;
}

export interface CartFormValues {
  items: CartFormItem[];
}

export interface VendorGroup {
  vendorId: string;
  vendorName: string;
  items: (CartFormItem & { index: number })[];
}

// const SHIPPING_RATE = 80;
// const TAX_RATE = 0.08;

export default function CartSection() {
  const itemKey = (item: CartFormItem) => `${item.productId}-${item.variantSku}`;
  const router = useRouter();
  const { items: storeItems, updateItem, removeItem, initCheckoutAndNavigate, isCreatingCart } = useCartStore();
  console.log(storeItems, "storeItems", isCreatingCart, "isCreatingCart");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(new Set());

  // Mirror store items into RHF so CartCard can stay form-driven
  const methods = useForm<CartFormValues>({
    defaultValues: {
      items: storeItems.map((i) => ({
        productId: i.productId,
        variantSku: i.variantSku,
        vendorId: "inhouse", // replace with real vendorId once available on CartItem
        vendorName: "Moto Life", // replace with real vendorName once available on CartItem
        name: i.name,
        thumbnail: i.thumbnail,
        variation: i.variation,
        quantity: i.quantity,
        sellingPrice: i.sellingPrice,
      })),
    },
  });
  useEffect(() => {
    if (storeItems?.length) {
      methods.reset({
        items: storeItems.map((i) => ({
          productId: i.productId,
          variantSku: i.variantSku,
          vendorId: "inhouse",
          vendorName: "Moto Life",
          name: i.name,
          thumbnail: i.thumbnail,
          variation: i.variation,
          quantity: i.quantity,
          sellingPrice: i.sellingPrice,
        })),
      });
    }
  }, [storeItems, methods]);
  const { control } = methods;
  const { fields, remove, update } = useFieldArray({ control, name: "items" });
  const watchedItems = useWatch({ control, name: "items" });
  const items = useMemo(() => watchedItems ?? [], [watchedItems]);
  useEffect(() => {
    if (!items.length) return;
    if (selectedItems.size > 0) return; // prevent override

    const allItemKeys = new Set(items.map((item) => itemKey(item)));
    const allVendorIds = new Set(items.map((item) => item.vendorId));

    setSelectedItems(allItemKeys);
    setSelectedVendors(allVendorIds);
  }, [items]);

  // Group by vendor
  const vendorGroups: VendorGroup[] = useMemo(() => {
    return fields.reduce((acc, field, index) => {
      const item = items[index];
      const existing = acc.find((g) => g.vendorId === item.vendorId);
      if (existing) {
        existing.items.push({ ...item, index });
      } else {
        acc.push({ vendorId: item.vendorId, vendorName: item.vendorName, items: [{ ...item, index }] });
      }
      return acc;
    }, [] as VendorGroup[]);
  }, [fields, items]);

  // Order summary based on selected items
  const orderSummary = useMemo(() => {
    const selected = items.filter((item) => selectedItems.has(itemKey(item)));
    const subtotal = selected.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
    // const shipping = selected.length > 0 ? SHIPPING_RATE : 0;
    // const tax = subtotal * TAX_RATE;
    const total = subtotal;
    return {
      subtotal: subtotal.toFixed(2),
      // shipping: shipping.toFixed(2),
      // tax: tax.toFixed(2),
      total: total.toFixed(2),
      itemCount: selected.length,
    };
  }, [items, selectedItems]);

  // ─── Selection handlers ───────────────────────────────────────────────────

  const handleVendorSelect = (vendorId: string, checked: boolean) => {
    const group = vendorGroups.find((g) => g.vendorId === vendorId);
    const newVendors = new Set(selectedVendors);

    if (checked) {
      newVendors.add(vendorId);
      group?.items.forEach((item) => setSelectedItems((prev) => new Set(prev).add(itemKey(item))));
    } else {
      newVendors.delete(vendorId);
      group?.items.forEach((item) =>
        setSelectedItems((prev) => {
          const s = new Set(prev);
          s.delete(itemKey(item));
          return s;
        })
      );
    }
    setSelectedVendors(newVendors);
  };

  const handleItemSelect = (key: string, vendorId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(key);
    } else {
      newSelected.delete(key);
      setSelectedVendors((prev) => {
        const s = new Set(prev);
        s.delete(vendorId);
        return s;
      });
    }
    setSelectedItems(newSelected);

    const group = vendorGroups.find((g) => g.vendorId === vendorId);
    const allSelected = group?.items.every((item) => (itemKey(item) === key ? checked : newSelected.has(itemKey(item))));
    if (allSelected) setSelectedVendors((prev) => new Set(prev).add(vendorId));
  };

  // ─── Quantity / remove ────────────────────────────────────────────────────

  const handleUpdateQuantity = (index: number, delta: number) => {
    const item = items[index];
    const newQty = Math.max(1, item.quantity + delta);
    update(index, { ...item, quantity: newQty });
    updateItem(item.productId, item.variantSku, newQty); // sync to store
  };

  const removeVendorItems = (vendorId: string) => {
    const group = vendorGroups.find((g) => g.vendorId === vendorId);
    const toRemove = group?.items.filter((item) => selectedItems.has(itemKey(item))) ?? [];

    if (toRemove.length === 0) {
      Toast.warning({ title: "Warning", description: "Please select items to remove" });
      return;
    }

    // Remove from RHF in reverse index order to avoid index shifting
    [...toRemove].sort((a, b) => b.index - a.index).forEach((item) => remove(item.index));

    // Remove from store
    toRemove.forEach((item) => removeItem(item.productId, item.variantSku));

    setSelectedItems((prev) => {
      const s = new Set(prev);
      toRemove.forEach((item) => s.delete(itemKey(item)));
      return s;
    });
    setSelectedVendors((prev) => {
      const s = new Set(prev);
      s.delete(vendorId);
      return s;
    });
  };

  // ─── Checkout ─────────────────────────────────────────────────────────────

  const onSubmit = async () => {
    const selectedStoreItems = storeItems.filter((i) => selectedItems.has(`${i.productId}-${i.variantSku}`));

    if (selectedStoreItems.length === 0) {
      Toast.warning({ title: "Warning", description: "Please select at least one item to checkout" });
      return;
    }

    const data = await initCheckoutAndNavigate("cart", selectedStoreItems);
    if (!data.success) return;
    router.push(allRoutes.checkout);
  };
  // useEffect(() => {
  //   console.log(vendorGroups);
  // }, [vendorGroups]);
  return (
    <FormProvider {...methods}>
      <form className="bg-white" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="pb-10">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px] xl:gap-8">
            {/* ── Item List ──────────────────────────────────────────────── */}
            <div className="space-y-4">
              {vendorGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Package className="mb-4 h-16 w-16 text-gray-300" />
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">Your cart is empty</h3>
                  <p className="mb-6 text-gray-600">Add some items to get started</p>
                  <Link href={routes.publicRoutes.home}>
                    <Button type="button" className="bg-black text-white hover:bg-black/90">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                vendorGroups.map((vendorGroup) => (
                  <CartCard
                    key={vendorGroup.vendorId}
                    vendorId={vendorGroup.vendorId}
                    vendorName={vendorGroup.vendorName}
                    items={vendorGroup.items}
                    selectedItems={selectedItems}
                    selectedVendors={selectedVendors}
                    onVendorSelect={handleVendorSelect}
                    onItemSelect={handleItemSelect}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveVendorItems={removeVendorItems}
                  />
                ))
              )}
            </div>

            {/* ── Order Summary ──────────────────────────────────────────── */}
            <div className="max-md:pt-14">
              <div className="sticky top-40 h-max rounded-xl bg-gray-50 px-4 py-5 max-md:hidden md:px-5 md:py-6 lg:px-6 lg:py-7">
                <div className="mb-6 flex items-center gap-3">
                  <Package className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                </div>

                <div className="text-dark-gray space-y-3 border-b pb-4 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({orderSummary.itemCount} items)</span>
                    <span>{orderSummary.subtotal} BDT</span>
                  </div>
                  <div className="text-center">Shipping charge will be added at checkout</div>
                  {/* <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{orderSummary.shipping} BDT</span>
                  </div> */}
                  {/* <div className="flex justify-between">
                    <span>TAX (8%)</span>
                    <span>{orderSummary.tax} BDT</span>
                  </div> */}
                </div>

                <div className="flex items-center justify-between pt-4 pb-6">
                  <span className="font-semibold text-black">Total</span>
                  <span className="text-lg font-semibold text-black">{orderSummary.total} BDT</span>
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={orderSummary.itemCount === 0 || isCreatingCart}
                    className="h-11 w-full bg-black text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isCreatingCart ? "Processing..." : "PROCEED TO CHECKOUT"}
                  </Button>
                  <Link href={routes.publicRoutes.productList}>
                    <Button type="button" variant="outline" className="h-11 w-full border-black text-black hover:bg-black hover:text-white">
                      CONTINUE SHOPPING
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="fixed right-0 bottom-0 left-0 z-20 border-t bg-white shadow-lg transition-all duration-300 md:hidden">
              <div className="space-y-2 p-3">
                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="flex w-full items-center justify-center text-sm text-gray-500"
                >
                  {expanded ? <>Show less</> : <>Show more</>}
                  <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-300", !expanded && "rotate-180")} />
                </button>

                {/* Expanded Content */}
                {expanded && (
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal ({orderSummary.itemCount} items)</span>
                      <span>{orderSummary.subtotal} BDT</span>
                    </div>

                    <div className="text-center text-xs">Shipping charge will be added at checkout</div>

                    <div className="flex justify-between border-t pt-2 font-semibold text-black">
                      <span>Total</span>
                      <span>{orderSummary.total} BDT</span>
                    </div>
                  </div>
                )}

                {/* Always Visible Bottom Row */}
                {!expanded && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total ({orderSummary.itemCount})</span>
                    <span className="font-semibold text-black">{orderSummary.total} BDT</span>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={orderSummary.itemCount === 0 || isCreatingCart}
                  className="w-full bg-black text-white disabled:opacity-50"
                >
                  {isCreatingCart ? "Processing..." : "PROCEED TO CHECKOUT"}
                </Button>

                <Link href={routes.publicRoutes.productList}>
                  <Button type="button" variant="outline" className="w-full border-black text-black">
                    CONTINUE SHOPPING
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
