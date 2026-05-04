"use client";

import PremiumBenefits from "@/components/admin/shared/PremiumBenefits";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect, useRef, useState } from "react";
import { MobileOrderBar } from "./BottomOrderManagement";
import { ProductDetailsTabs } from "./ProductDetailsTabs";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { StickyProductBar } from "./StickyProductBar";
import { ProductDetailObj } from "./schemas";

export default function ProductDetailsPage({ product, isComboProduct }: { product: ProductDetailObj; isComboProduct?: boolean }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [showStickyMenu, setShowStickyMenu] = useState(false);
  const isTablet = useMediaQuery(1024);

  // 🔥 Shared state for variants & quantity
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [matchedVariant, setMatchedVariant] = useState<any>(null);
  const [isCompleteSelection, setIsCompleteSelection] = useState(false);
  const [stock, setStock] = useState(product?.stockQuantity || 0);
  const [quantity, setQuantity] = useState(1); // shared quantity
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setShowStickyMenu(!entry.isIntersecting), { threshold: 0 });

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div className="relative mx-auto">
      {/* Sticky product bar for non-tablet */}
      {!isTablet && showStickyMenu && (
        <StickyProductBar
          product={product}
          stock={stock}
          matchedVariant={matchedVariant}
          isCompleteSelection={isCompleteSelection}
          selectedQuantity={quantity}
          isComboProduct={isComboProduct}
        />
      )}

      {/* Main product section */}
      <div ref={sectionRef} className="grid md:gap-7 lg:grid-cols-[1fr_1.3fr]">
        <ProductGallery product={product} activeIndex={activeMediaIndex} onChange={setActiveMediaIndex} />

        <ProductInfo
          product={product}
          isComboProduct={isComboProduct}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
          setMatchedVariant={setMatchedVariant}
          setIsCompleteSelection={setIsCompleteSelection}
          setStock={setStock}
          quantity={quantity}
          setQuantity={setQuantity}
          selectedColorIndex={selectedColorIndex}
          setSelectedColorIndex={setSelectedColorIndex}
          setActiveMediaIndex={setActiveMediaIndex}
        />
      </div>

      {/* Tabs */}
      <ProductDetailsTabs product={product} isComboProduct={isComboProduct} />
      <div className="pt-2 md:hidden">{product?.benefit ? <PremiumBenefits benefitsAry={product?.benefit} /> : null}</div>
      {/* Mobile bottom order bar */}
      <MobileOrderBar
        product={product}
        stock={stock}
        isComboProduct={isComboProduct}
        matchedVariant={matchedVariant}
        isCompleteSelection={isCompleteSelection}
        selectedQuantity={quantity}
      />
    </div>
  );
}
