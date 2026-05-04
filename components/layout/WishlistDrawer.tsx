"use client";

import { getWishList } from "@/actions/landing/wishList-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { allRoutes } from "@/config/constant";
import { useWishlistStore } from "@/store/wishlist/wishlistStore";
import { Star, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icons } from "../icons";
import ImageWithFallback from "../shared/ImageWithFallback";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface IStore {
  storeName: string;
  logoImage: string;
}
export interface ISeller {
  _id: string;
  accountStatus: "live" | "inactive" | "suspended";
  verificationStatus: "verified" | "unverified";
  store: IStore;
}
export interface IVariantAttribute {
  name: string;
  value: string;
}
export interface IVariant {
  attributes: IVariantAttribute[];
  variation: string;
  variantPrice: number;
  sku: string;
  stock: number;
  discountType?: "percentage" | "flat";
  discountValue?: number;
  discountPrice?: number;
  hasDiscount?: boolean;
}
export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  thumbnail: string;
  sellingPrice: number;
  hasDiscount?: boolean;
  discountPrice?: number;
  stockQuantity: number;
  rating?: number;
  seller: ISeller;
  variants: IVariant[];
}
export interface WishlistItem {
  product?: IProduct;
  comboProduct?: IProduct;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function resolveItem(item: WishlistItem): IProduct | null {
  return item.product ?? item.comboProduct ?? null;
}

function resolvePrice(p: IProduct): { price: number; original?: number } {
  if (p.variants?.length) {
    const v = p.variants[0];
    return {
      price: v.discountPrice ?? v.variantPrice,
      original: v.discountPrice ? v.variantPrice : undefined,
    };
  }
  return {
    price: p.discountPrice ?? p.sellingPrice,
    original: p.discountPrice ? p.sellingPrice : undefined,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export function WishlistDrawer({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Zustand store — shared with product cards
  const { toggle, isLoading } = useWishlistStore();

  useEffect(() => {
    if (!open) return;

    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const res = await getWishList();
        if (res.ok) {
          setItems(res.data?.data?.data?.docs ?? []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [open]);

  // Uses store toggle — syncs heart state on all product cards automatically
  const handleRemove = async (productId: string, isCombo: boolean) => {
    await toggle(productId, isCombo); // fires API + updates wishlistedIds in store
    setItems((prev) =>
      prev.filter((i) => {
        const p = resolveItem(i);
        return p?._id !== productId;
      })
    );
  };

  const handleClearAll = async () => {
    for (const item of items) {
      const p = resolveItem(item);
      if (p) await toggle(p._id, !!item.comboProduct);
    }
    setItems([]);
  };

  // const itemCount = items.length;
  const itemCount = useWishlistStore((state) => state.totalCount());

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon" className="relative border-0 p-0! shadow-none transition-colors hover:bg-transparent">
            <Icons.heartIcon className="size-5! md:size-7!" />
            {itemCount > 0 && (
              <Badge className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex size-6! items-center justify-center rounded-full">
                <span className="p-text-14 font-medium">{itemCount}</span>
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col overflow-hidden rounded-l-2xl p-0 md:max-w-lg xl:max-w-xl [&>button:first-of-type]:hidden">
        <SheetHeader className="px-3 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex w-full items-center gap-2 border-b">
              <p className="p-text-36 font-grandstander leading-12 font-semibold -tracking-[0.72px]">My Wishlist</p>
              <Badge className="bg-dark-backround size-7.5 rounded-full text-black">
                <p className="p-text-18 font-semibold -tracking-[0.18px]">{itemCount}</p>
              </Badge>
            </SheetTitle>
            <button onClick={() => setOpen(false)}>
              <X className="size-6" />
            </button>
          </div>
        </SheetHeader>

        {loading ? (
          <div className="flex flex-1 flex-col gap-4 px-3 md:px-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid animate-pulse grid-cols-[50px_1fr] gap-3 md:grid-cols-[130px_1fr]">
                <div className="aspect-132/140 w-full rounded-lg bg-gray-200" />
                <div className="space-y-2 py-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-5 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-3 py-12 text-center md:px-6">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pink-50">
              <Icons.heartIcon className="h-12 w-12 text-pink-300" />
            </div>
            <h3 className="mb-2 text-xl font-medium">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6 max-w-xs text-sm">
              Save items you love for later by clicking the heart icon on any item.
            </p>
            <Link href="/products" onClick={() => setOpen(false)}>
              <Button className="rounded-full px-8">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="px-3 md:px-6">
              <button
                onClick={handleClearAll}
                className="p-text-16 text-primary hover:text-primary/80 leading-6 font-medium hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="custom-scrollbar flex-1 space-y-4 divide-y overflow-y-auto px-3 md:px-6">
              {items.map((item) => {
                const p = resolveItem(item);
                if (!p) return null;
                const { price, original } = resolvePrice(p);
                const isCombo = !!item.comboProduct;
                const removing = isLoading(p._id); // from store — same spinner as card

                return (
                  <div
                    key={p._id}
                    className="grid grid-cols-[50px_1fr_20px] items-start gap-3 bg-white p-2.5 md:grid-cols-[130px_1fr_40px]"
                  >
                    <div className="bg-dark-gray relative aspect-132/140 w-full overflow-hidden rounded-lg">
                      <ImageWithFallback
                        fallbackSrc="/images/auth/logo.png"
                        src={p.thumbnail}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-125"
                      />
                    </div>

                    <div className="flex flex-col justify-between">
                      <Link href={`${isCombo ? allRoutes.comboOffer : allRoutes.products}/${p.slug}`}>
                        <h3 className="text-sm leading-5 font-semibold text-wrap hover:underline md:text-base">{p.name}</h3>
                      </Link>

                      {p.rating && p.rating > 0 ? (
                        <p className="p-text-14 text-dark-gray mt-1 flex items-center gap-1">
                          {p.rating.toFixed(1)}
                          <Star className="size-4! fill-current text-[#FDAB00]" />
                        </p>
                      ) : null}

                      <div className="mt-1 flex flex-col items-baseline gap-x-1.5 xl:flex-row">
                        <div className="flex items-baseline gap-1 xl:mt-3">
                          <span className="p-text-20 xl:font-semibold">{price.toFixed(2)}</span>
                          <span className="p-text-16 leading-5">৳</span>
                        </div>
                        {original ? (
                          <span className="flex items-baseline gap-1 text-sm text-gray-400 line-through xl:text-base">
                            {original.toFixed(2)}
                            <span className="p-text-16 leading-5">৳</span>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex h-full flex-col justify-center">
                      <Button
                        variant="link"
                        size="icon"
                        disabled={removing}
                        className="hover:text-primary/80 text-primary h-7 w-7 rounded-full hover:no-underline disabled:opacity-50"
                        onClick={() => handleRemove(p._id, isCombo)}
                      >
                        {removing ? <Icons.spinner className="size-4 animate-spin" /> : <Trash2 className="size-5!" />}
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-primary gap-6 space-y-2 border-t bg-gray-50 px-3 py-4 md:flex md:px-6 xl:py-10">
              <Link href={allRoutes.cart} className="block flex-1 max-lg:w-full" onClick={() => setOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full flex-1 border-black font-semibold text-black hover:bg-black hover:text-white md:h-11"
                >
                  Go to Shopping Cart
                </Button>
              </Link>
              <Link href={allRoutes.wishlist} className="flex-1 max-lg:w-full" onClick={() => setOpen(false)}>
                <Button className="w-full flex-1 bg-black font-semibold text-white hover:bg-black/90 md:h-11">View full Wishlist</Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
