"use client";

import { Icons } from "@/components/icons";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { allRoutes } from "@/config/constant";
import routes from "@/config/routes";
import { buildWhatsAppMessage } from "@/lib/client-utils";
import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { CartItem } from "@/store/cart/Cart-types";
import { useCartItems, useCartStore } from "@/store/cart/cartStore";
import { AlertTriangle, Minus, Plus, Share2, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { colorMap } from "../products/constants";
import { ShareModal } from "../shared/ShareModal";
import { generateAllAttributesAry } from "./helpers";
import { RequestRestockModal } from "./RequestRestockModal";
import { ProductDetailObj } from "./schemas";

export function ProductInfoQ({
  product,
  modalCloser,
  isComboProduct,
  selectedColorIndex,
  setSelectedColorIndex,
  setActiveMediaIndex,
}: {
  product: ProductDetailObj;
  modalCloser?: (open: boolean) => void;
  isComboProduct?: boolean;
  selectedColorIndex: number;
  setSelectedColorIndex: (index: number) => void;
  setActiveMediaIndex: (index: number) => void;
}) {
  const isOnVacation = product?.seller?.[0]?.businessSettings?.vacation?.isOnVacation;
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [itemToRestock, setItemToRestock] = useState<CartItem | null>(null);

  const router = useRouter();

  const { addItem, addToOrderNow, updateItem, setMinAmount, total, minAmount } = useCartStore();
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

  const handleSelect = (attribute: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attribute]: value }));
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

  const allAttributesAry = generateAllAttributesAry(product?.variants);
  const matchedVariant = product?.variants?.find((variant) =>
    variant?.attributes?.every((attr) => selectedAttributes[attr.name] === attr.value)
  );

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

  const isCompleteSelection = Object.keys(selectedAttributes).length === allAttributesAry.length && allAttributesAry.length > 0;
  const stock = isCompleteSelection ? (matchedVariant?.stock ?? 0) : product?.stockQuantity;
  // const variantSku = matchedVariant?.sku ?? product?.sku ?? "";
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

  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${routes.publicRoutes.productDetail(product?.slug)}`
      : routes.publicRoutes.productDetail(product?.slug);

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

  // ─── Cart item builder ────────────────────────────────────────────────────
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

  // const handleAddToCart = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   addItem(buildCartItem(), userId);
  //   Toast.success("Product added to cart");
  // };
  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();

    // const existing = cartItems.find((item) => item.productId === product._id && item.variantSku === variantSku);

    // if (existing) {
    //   // Item already in cart — update quantity instead of adding
    //   await updateItem(product._id, variantSku, quantity);
    // } else {
    await addItem(buildCartItem());
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

  // const handleOrderNow = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   addToOrderNow(buildCartItem());
  //   if (total < minAmount) {
  //     Toast.error(`Minimum order amount is ${minAmount} BDT`);
  //     return;
  //   }
  //   router.push(allRoutes.orderNow); // replace with your actual route
  // };
  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();

    const orderNowItem = buildCartItem();

    // Compute total including this item
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
  // console.log(product, "product detail data from productinfoq");
  return (
    <form onSubmit={handleAddToCart} className="flex flex-col">
      <div className="flex justify-between">
        <div className="flex-1">
          <h2 className="p-text-30 mb-3.5 font-bold text-black">{product.name}</h2>
        </div>
        <div className="flex gap-2 pr-10 md:pt-10">
          {/* <Button variant="outline" size="icon">
            <Icons.heartIcon className="size-5" />
          </Button> */}
          <Button onClick={handleShare} variant="outline" size="icon">
            <Share2 className="size-5" />
          </Button>
        </div>
      </div>

      <div className="">
        <div
          className={cn(
            "flex max-xl:flex-col md:pb-2.5 xl:items-center xl:gap-3",
            product?.rating || product.reviewCount || product.quantitySold ? "" : "hidden"
          )}
        >
          {product?.rating > 0 ? (
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("size-5", i < product?.rating ? "fill-secondary text-secondary" : "text-secondary")} />
              ))}
            </div>
          ) : null}
          {product?.reviewCount && Number(product?.reviewCount) > 0 ? (
            <p className="p-text-14 leading-5 font-medium text-black">({product?.reviewCount} reviews)</p>
          ) : null}
          {product?.quantitySold && Number(product?.quantitySold) > 0 ? (
            <p className="p-text-16 text-dark-gray leading-6">{product?.quantitySold}+ Sold</p>
          ) : null}
        </div>

        <div className="flex max-xl:flex-col md:pb-2.5 xl:items-center xl:gap-3">
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

        {/* <div className="flex items-center gap-2 py-5 md:gap-5 lg:gap-7">
          {product?.seller ? (
            <div className="p-text-14 text-dark-gray flex items-center gap-2 leading-5 font-medium">
              Sold by:{" "}
              <p className="p-text-16 text-dark-gray flex items-center gap-1">
                {product?.seller[0]?.store?.storeName} <BadgeCheck className="fill-blue-dark size-5! text-white" />
              </p>
            </div>
          ) : (
            <p className="p-text-16 text-black">Inhouse product</p>
          )}
        </div> */}

        {/* Price */}
        <div className="md:mb-4">
          <div className="mb-1 flex items-center gap-3.5">
            <span className="p-text-16 text-dark-gray pr-3.5 leading-5 font-semibold">Price</span>
            <span className="p-text-24 text-primary font-semibold">{formatNumber(Number(priceData.price))} BDT</span>
            {priceData.comparePrice && Number(priceData.comparePrice) > 0 ? (
              <span className="text-light-gray p-text-20 font-semibold line-through">
                {formatNumber(Number(priceData.comparePrice))} BDT
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
          <div className="md:mb-4">
            <div className="flex items-center justify-between md:mb-3">
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
                    // onClick={() => {
                    //   setSelectedColor(index);
                    //   handleSelect("Color", color?.color);
                    // }}
                    onClick={() => {
                      setSelectedColor(index);
                      handleSelect("Color", color.color);

                      // 🔥 NEW: update gallery index
                      const mediaIndex = product.colorWiseImages?.findIndex((c) => c.color === color.color);

                      if (mediaIndex !== -1) {
                        setActiveMediaIndex(mediaIndex + 1);
                      }
                    }}
                    className={cn(
                      "relative overflow-hidden rounded-lg border-2 transition-all",
                      !available && "cursor-not-allowed opacity-40",
                      selectedAttributes["Color"] === color?.color ? "border-primary" : "border-border hover:border-primary",
                      color?.image ? "h-16 w-16" : "h-10 w-10"
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
                <div key={index} className="md:mb-4">
                  <div className="flex items-center justify-between md:mb-3">
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
                            "rounded-lg border p-2 font-medium transition-all md:px-6",
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
            {stock > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border" aria-disabled={product?.isUpcoming}>
                  <button
                    type="button"
                    disabled={product?.isUpcoming}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    type="button"
                    disabled={product?.isUpcoming || quantity >= stock}
                    onClick={() => setQuantity((prev) => Math.min(stock, prev + 1))}
                    className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-1 md:space-y-3">
          {stock > 0 ? (
            <div className="flex gap-1 max-md:flex-col md:gap-3">
              <Button
                onClick={handleCallOrder}
                disabled={isOnVacation}
                className="h-10 flex-1 bg-linear-to-r from-[#578CFF] to-[#0057CC] text-sm font-semibold text-white uppercase hover:from-[#0057CC] hover:to-[#578CFF]"
              >
                <Icons.Phone className="mr-2 size-5" />
                Order via call
              </Button>
              <Button
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
                disabled={isOnVacation}
                type="button"
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

      {itemToRestock ? (
        <RequestRestockModal modalCloser={modalCloser} item={itemToRestock} open={restockOpen} onClose={() => setRestockOpen(false)} />
      ) : null}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        productTitle={product?.name}
        productUrl={productUrl}
      />
    </form>
  );
}
