"use client";

import { Button } from "@/components/ui/button";
import { useFormSheet } from "@/context/FormSheetContext";
import { useResourceType } from "@/store/useResourceType";
import { Lock, Plus } from "lucide-react";
export default function AddNewSaleButton() {
  const { openSheet } = useFormSheet();
  const { type } = useResourceType();
  const isHaveAllType = type.includes("flash_sale") && type.includes("todays_deal");

  return (
    <Button
      size="sm"
      className="cool"
      disabled={isHaveAllType}
      onClick={() => {
        openSheet();
      }}
    >
      {isHaveAllType ? <Lock className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      Add New Sale
    </Button>
  );
}
