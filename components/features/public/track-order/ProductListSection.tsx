"use client";

import { Button } from "@/components/ui/button";
import { VendorGroup } from "@/lib/types";
import { TriangleAlert } from "lucide-react";
import { memo } from "react";
import { AllStatuses } from "../products/constants";
import { ProductCardPreview } from "./ProductCardPreview";

interface Props {
  vendorGroups: VendorGroup[];
  isDelivered: boolean;
  onCancel: () => void;
  status: string;
}

const ProductListSection = ({ vendorGroups, isDelivered, onCancel, status }: Props) => {
  return (
    <div className="space-y-5 rounded-lg lg:border lg:p-5">
      <p className="p-text-16 font-semibold">Product List</p>

      <div className="space-y-5">
        {vendorGroups.map((vendor) => (
          <ProductCardPreview key={vendor.vendorId} vendorName={vendor.vendorName} items={vendor.items} isDelivered={isDelivered} />
        ))}

        {status === AllStatuses.delivered.index ? (
          <Button variant="outline-primary" onClick={onCancel}>
            <TriangleAlert />
            cancel order
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default memo(ProductListSection);
