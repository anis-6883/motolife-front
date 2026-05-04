"use client";

import { Button } from "@/components/ui/button";
import { useFormSheet } from "@/context/FormSheetContext";
export default function AddReviewButton() {
  const { openSheet } = useFormSheet();

  return (
    <Button
      size="sm"
      className="cool"
      onClick={() => {
        openSheet();
      }}
    >
      Add New Review
    </Button>
  );
}
