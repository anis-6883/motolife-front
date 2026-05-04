"use client";

import PremiumBenefits from "@/components/admin/shared/PremiumBenefits";
import { Icons } from "@/components/icons";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { allRoutes } from "@/config/constant";
import { buildWhatsAppMessage } from "@/lib/client-utils";
import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { CartItem } from "@/store/cart/Cart-types";
import { useCartItems, useCartStore } from "@/store/cart/cartStore";
import { AlertTriangle, Minus, Plus, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { colorMap } from "../products/constants";
import { ShareModal } from "../shared/ShareModal";
import StarsComp from "../shared/Stars";
import { generateAllAttributesAry } from "./helpers";
import { RequestRestockModal } from "./RequestRestockModal";
import { ProductDetailObj } from "./schemas";

export function ProductInfo({
  product,
  isComboProduct,
  selectedAttributes,
  setSelectedAttributes,
  setMatchedVariant,
  setIsCompleteSelection,
  setStock,
  quantity,
  setQuantity,
  selectedColorIndex,
  setSelectedColorIndex,
  setActiveMediaIndex,
}: {
  product: ProductDetailObj;
  isComboProduct?: boolean;
  selectedAttributes: Record<string, string>;
  setSelectedAttributes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setMatchedVariant: (v: any) => void;
  setIsCompleteSelection: (v: boolean) => void;
  setStock: (stock: number) => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectedColorIndex: number;
  setSelectedColorIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveMediaIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const isOnVacation = product?.seller?.[0]?.businessSettings?.vacation?.isOnVacation;
  const [selectedColor, setSelectedColor] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);

  const [itemToRestock, setItemToRestock] = useState<CartItem | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id as string | undefined;

  const { addItem, updateItem, addToOrderNow, setMinAmount, minAmount } = useCartStore();
  useEffect(() => {
    const minAmount = product?.seller?.[0]?.businessSettings?.minOrderAmount;

    if (typeof minAmount === "number") {
      setMinAmount(minAmount);
    } else {
      setMinAmount(0);
    }
  }, [product, setMinAmount]);
  const cartItems = useCartItems();

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsShareModalOpen(true);
  };
  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUM;
    const variantText = hasVariants ? Object.values(selectedAttributes).join(" / ") : "Standard";
    const text = buildWhatsAppMessage(selectedAttributes, product, quantity, priceData, productUrl, variantText);
    const url = `https://api.whatsapp.com/send/?phone=${phone}&text=${text}&type=phone_number&app_absent=0`;
    window.open(url, "_blank");
  };
  const handleCallOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUM;

    window.location.href = `tel:${phone}`;
  };
  const handleSelect = (attribute: string, value: string) => {
    setSelectedAttributes((prev: any) => ({ ...prev, [attribute]: value }));
  };

  const allAttributesAry = generateAllAttributesAry(product?.variants);

  const matchedVariant = product?.variants?.find((variant) =>
    variant?.attributes?.every((attr) => selectedAttributes[attr.name] === attr.value)
  );

  const isCompleteSelection = Object.keys(selectedAttributes).length === allAttributesAry.length && allAttributesAry.length > 0;

  const stock = isCompleteSelection ? (matchedVariant?.stock ?? 0) : product?.stockQuantity;

  const priceData = (() => {
    if (matchedVariant) {
      if (matchedVariant.discountPrice && Number(matchedVariant.discountPrice) > 0) {
        return { price: matchedVariant.discountPrice, comparePrice: matchedVariant.variantPrice, hasDiscount: true };
      }
      return { price: matchedVariant.variantPrice, comparePrice: undefined, hasDiscount: false };
    }
    if (product?.discountPrice && Number(product?.discountPrice) > 0) {
      return { price: product?.discountPrice, comparePrice: product?.sellingPrice, hasDiscount: true };
    }
    return { price: product?.sellingPrice, comparePrice: undefined, hasDiscount: false };
  })();
  useEffect(() => {
    setMatchedVariant(matchedVariant);
    setIsCompleteSelection(isCompleteSelection);
    setStock(stock);
  }, [matchedVariant, isCompleteSelection, stock]);
  const hasVariants = product?.variants && product.variants.length > 0;

  const variantSku = hasVariants ? (matchedVariant?.sku ?? "") : "";

  const isOptionAvailable = (attributeName: string, value: string) => {
    const simulatedSelection = { ...selectedAttributes, [attributeName]: value };
    if (attributeName === "Color") {
      return product?.variants?.some((variant) => variant?.attributes?.some((attr) => attr.name === "Color" && attr.value === value));
    }
    return product?.variants?.some((variant) =>
      variant?.attributes?.every((attr) => !simulatedSelection[attr.name] || simulatedSelection[attr.name] === attr.value)
    );
  };
  const currentPath = usePathname();
  const productUrl = typeof window !== "undefined" ? `${window.location.origin}${currentPath}` : currentPath;

  useEffect(() => {
    if (quantity > stock) setQuantity(stock || 1);
  }, [stock]);

  useEffect(() => {
    if (!product?.variants?.length) return;
    const firstVariant = product.variants[0];
    const initialAttributes: Record<string, string> = {};
    firstVariant.attributes?.forEach((attr) => {
      initialAttributes[attr.name] = attr.value;
    });
    setSelectedAttributes(initialAttributes);
    const colorIndex = product?.colorWiseImages?.findIndex((c) => c.color === initialAttributes["Color"]);
    if (colorIndex >= 0) setSelectedColor(colorIndex);
  }, [product]);

  useEffect(() => {
    if (!matchedVariant) {
      setQuantity(1);
      return;
    }
    const cartItem = cartItems.find((item) => item.productId === product._id && item.variantSku === matchedVariant.sku);
    setQuantity(cartItem ? cartItem.quantity : 1);
  }, [matchedVariant, cartItems]);
  const buildCartItem = (): CartItem => ({
    productId: product._id,
    variantSku,
    thumbnail: product?.colorWiseImages?.[selectedColor]?.image ?? product?.thumbnail ?? "",
    variation: Object.values(selectedAttributes).join(" / "),
    attributes: Object.entries(selectedAttributes).map(([name, value]) => ({ name, value })),
    isCombo: isComboProduct ?? false,
    quantity,
    sellingPrice: Number(priceData.price),
    name: product.name,
    ...(matchedVariant?.discountPrice && Number(matchedVariant?.discountPrice) > 0
      ? { hasDiscount: true }
      : product?.discountPrice && Number(product?.discountPrice) > 0 && { hasDiscount: true }),
  });
  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();

    // const existing = cartItems.find((item) => item.productId === product._id && item.variantSku === variantSku);

    // if (existing) {
    //   await updateItem(product._id, variantSku, quantity);
    // } else {
    const item = buildCartItem();
    await addItem(item);
    // }

    Toast.clickable(
      {
        title: "Added to cart",
        description: "Click to view your cart",
      },
      () => {
        useCartStore.getState().setCartDrawerOpen(true);
      }
    );
  };
  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    const orderNowItem = buildCartItem();
    const dynamicTotal = orderNowItem.sellingPrice * orderNowItem.quantity;

    if (dynamicTotal < minAmount) {
      Toast.error(`Minimum order amount is ${minAmount} BDT`);
      return;
    }

    addToOrderNow(orderNowItem);
    router.push(allRoutes.orderNow);
  };
  const colors =
    product?.colorWiseImages?.length > 0
      ? product.colorWiseImages.map((c) => ({ color: c.color, image: c.image }))
      : (product?.variants
          ?.map((v) => {
            const colorAttr = v?.attributes?.find((a) => a.name === "Color");
            return colorAttr ? { color: colorAttr.value } : null;
          })
          .filter(Boolean)
          .filter(
            (v, index, self) => self.findIndex((t) => t!.color === v!.color) === index // remove duplicates
          ) as { color: string; image?: string }[]);

  const handleWish = () => {
    // const wishlist = useWishlist();
    // if (wishlist.isLoading) return;
    // if (!wishlist.data) return;
    // const productInWishlist = wishlist.data.find((product) => product.productId === product._id);
    // if (productInWishlist) {
    //   toast.success("Product already in wishlist");
    //   return;
    // }
    // addWishlist(product._id, product.name);
    // toast.success("Added to wishlist");
  };
  return (
    <form onSubmit={handleAddToCart} className="flex flex-col">
      <div className="flex justify-between">
        <div className="flex-1">
          <h2 className="p-text-30 font-bold text-black md:mb-3.5">{product.name}</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleWish} variant="outline" size="icon" className="lg:size-11">
            <Icons.heartIcon className="size-7" />
          </Button>
          <Button onClick={handleShare} variant="outline" size="icon" className="size-6 lg:size-11">
            <Share2 className="size-4 lg:size-7" />
          </Button>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[1.5fr_1fr]">
        <div className="">
          <div
            className={cn(
              "flex gap-4 md:pb-2.5 xl:items-center xl:gap-3",
              product?.rating || product.reviewCount || product.quantitySold ? "" : "hidden"
            )}
          >
            {product?.rating > 0 ? (
              <div className="flex gap-2">
                <StarsComp rating={product?.rating} outlineColor="text-secondary" />
              </div>
            ) : null}
            {product?.reviewCount && Number(product?.reviewCount) > 0 ? (
              <p className="p-text-14 leading-5 font-medium text-black">({product?.reviewCount} reviews)</p>
            ) : null}
            {product?.quantitySold && Number(product?.quantitySold) > 0 ? (
              <p className="p-text-16 text-dark-gray leading-6">{product?.quantitySold}+ Sold</p>
            ) : null}
          </div>

          <div className="flex flex-wrap max-xl:flex-col md:pb-2.5 xl:items-center xl:gap-3">
            {variantSku ? (
              <p className="p-text-14 text-dark-gray leading-5 font-medium">
                SKU : <span className="p-text-16 leading-5 font-semibold">{variantSku}</span>
              </p>
            ) : null}
            {product?.brand && variantSku ? <div className="bg-dark-gray/50 mx-2 h-3 w-px max-xl:hidden" /> : null}
            {product?.brand ? (
              <p className="p-text-14 text-dark-gray leading-5 font-medium">
                Brand Name: <span className="p-text-16 leading-5 font-semibold">{product?.brand?.name}</span>
              </p>
            ) : null}
          </div>

          {/* Price */}
          <div className="md:mb-4">
            <div className="mb-1 flex items-center gap-2 md:gap-3.5">
              <span className="p-text-16 text-dark-gray pr-3.5 leading-5 font-semibold">Price</span>
              <span className="p-text-24 text-primary font-semibold max-md:text-sm">{formatNumber(Number(priceData.price))} ৳</span>
              {priceData.comparePrice && Number(priceData.comparePrice) > 0 ? (
                <span className="text-light-gray p-text-20 font-semibold line-through max-md:text-[10px]">
                  {formatNumber(Number(priceData.comparePrice))} ৳
                </span>
              ) : null}
            </div>
            {product?.variants?.length > 0 && (
              <div className="text-blue-dark p-text-14 flex items-center gap-2">
                <AlertTriangle className="size-4" />
                Price may vary based on color and size
              </div>
            )}
          </div>

          {/* Color Selection */}
          {colors?.length > 0 && (
            <div className="mb-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="p-text-16 text-dark-gray pr-3.5 leading-5 font-semibold">
                  Color - <span className="text-black">{colors[selectedColor]?.color}</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => {
                  const colorValue = color?.color;
                  if (!colorValue) return null;
                  const available = isOptionAvailable("Color", colorValue);
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={!available}
                      onClick={() => {
                        setSelectedColor(index);
                        handleSelect("Color", color.color);

                        // 🔥 NEW: update gallery index
                        const mediaIndex = product.colorWiseImages?.findIndex((c) => c.color === color.color);

                        if (mediaIndex !== -1) {
                          setActiveMediaIndex(mediaIndex + 1);
                        }
                      }}
                      // onClick={() => {
                      //   setSelectedColor(index);
                      //   handleSelect("Color", color?.color);
                      // }}
                      className={cn(
                        "relative overflow-hidden rounded-lg border-2 transition-all",
                        !available && "cursor-not-allowed opacity-40",
                        selectedAttributes["Color"] === color?.color ? "border-primary" : "border-border hover:border-primary",
                        color && color?.image ? "h-16 w-16" : "h-10 w-10"
                      )}
                    >
                      {"image" in color! && color?.image ? (
                        <Image src={(color?.image as string) ?? ""} alt={color?.color ?? ""} fill className="object-cover" />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{
                            backgroundColor: colorMap[color?.color] || color?.color!.toLowerCase(), // fallback
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other Attributes */}
          {allAttributesAry?.length > 0
            ? allAttributesAry
                ?.filter((attribute) => attribute.attributeName !== "Color")
                .map((attribute, index) => (
                  <div key={index} className="mb-1 md:mb-4">
                    <div className="mb-1flex flex-wrap items-center justify-between md:mb-3">
                      <span className="p-text-16 text-dark-gray pr-3.5 leading-5 font-semibold">{attribute.attributeName}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {attribute.fields.map((field, fieldIndex) => {
                        const available = isOptionAvailable(attribute.attributeName, field);
                        return (
                          <button
                            key={fieldIndex}
                            type="button"
                            disabled={!available}
                            onClick={() => handleSelect(attribute.attributeName, field)}
                            className={cn(
                              "rounded-lg border p-2 font-medium transition-all max-md:text-xs md:px-6",
                              !available && "cursor-not-allowed opacity-40",
                              selectedAttributes[attribute.attributeName] === field
                                ? "border-primary text-primary"
                                : "border-border hover:border-primary"
                            )}
                          >
                            {field}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
            : null}

          {/* Stock Status */}
          <div className="mb-3">
            <p
              className={`${product?.isUpcoming ? "text-blue-dark" : stock > 0 ? "text-green-dark" : "text-destructive"} p-text-16 font-semibold`}
            >
              {product?.isUpcoming ? "Upcoming" : stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
            <div className="flex items-center gap-6 max-md:flex-wrap">
              {stock > 0 ? <span className="p-text-16 text-dark-gray pr-3.5 leading-5 font-semibold">Select Quantity</span> : null}
              {stock > 0 && (
                <div className="flex items-center gap-2 max-md:gap-1">
                  <div className="flex items-center rounded-lg border" aria-disabled={product?.isUpcoming}>
                    <button
                      type="button"
                      disabled={product?.isUpcoming}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-gray-50 disabled:opacity-50 max-md:h-6 max-md:w-6"
                    >
                      <Minus className="h-4 w-4 max-md:h-2 max-md:w-2" />
                    </button>
                    <span className="w-10 text-center font-medium max-md:text-xs">{quantity}</span>
                    <button
                      type="button"
                      disabled={product?.isUpcoming || quantity >= stock}
                      onClick={() => setQuantity((prev) => Math.min(stock, prev + 1))}
                      className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-gray-50 disabled:opacity-50 max-md:h-6 max-md:w-6"
                    >
                      <Plus className="h-4 w-4 max-md:h-2 max-md:w-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-1 md:space-y-3">
            {stock > 0 ? (
              <div className="flex gap-1 max-md:flex-col md:gap-3">
                <Button
                  type="button"
                  onClick={handleCallOrder}
                  disabled={isOnVacation}
                  className="h-10 flex-1 bg-linear-to-r from-[#578CFF] to-[#0057CC] text-sm font-semibold text-white uppercase hover:from-[#0057CC] hover:to-[#578CFF]"
                >
                  <Icons.Phone className="mr-2 size-5" />
                  Order via call
                </Button>
                <Button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  disabled={isOnVacation}
                  className="h-10 flex-1 bg-green-500 text-sm font-semibold text-white uppercase hover:bg-green-700"
                >
                  <Icons.WhatsappMessageBubble className="mr-2 size-5" />
                  ORDER VIA WHATSAPP
                </Button>
              </div>
            ) : null}
            <div className="flex gap-1 md:gap-3">
              <Button
                type="submit"
                disabled={product?.isUpcoming || stock <= 0 || isOnVacation}
                className="h-10 flex-1 bg-black text-sm font-semibold text-white uppercase hover:bg-black/90"
              >
                <Icons.cartAddIcon className="mr-2 size-5" />
                ADD TO CART
              </Button>
              {stock > 0 ? (
                <Button
                  type="button"
                  disabled={
                    (!matchedVariant && !isCompleteSelection && allAttributesAry.length > 0) ||
                    product?.isUpcoming ||
                    stock <= 0 ||
                    isOnVacation
                  }
                  onClick={handleOrderNow}
                  className="bg-primary hover:bg-primary/80 h-10 w-full flex-1 text-sm font-semibold text-white uppercase"
                >
                  ORDER NOW
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isOnVacation}
                  onClick={() => {
                    setRestockOpen(true);
                    setItemToRestock(buildCartItem());
                  }}
                  className="bg-primary hover:bg-primary/80 h-10 w-full flex-1 text-sm font-semibold text-white uppercase"
                >
                  Request Restock
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="max-md:hidden">{product?.benefit ? <PremiumBenefits benefitsAry={product?.benefit} /> : null}</div>
      </div>

      {itemToRestock ? <RequestRestockModal item={itemToRestock} open={restockOpen} onClose={() => setRestockOpen(false)} /> : null}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        productTitle={product?.name}
        productUrl={productUrl}
      />
    </form>
  );
}
