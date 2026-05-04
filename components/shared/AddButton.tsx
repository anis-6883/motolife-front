"use client";

import { Button } from "@/components/ui/button";
import { useFormSheet } from "@/context/FormSheetContext";
import { Plus } from "lucide-react";

export default function AddButton({ title }: { title: string }) {
  const { openSheet } = useFormSheet();

  return (
    <Button
      size="sm"
      className="cool"
      onClick={() => {
        openSheet();
      }}
    >
      <Plus className="h-4 w-4" />
      {title}
    </Button>
  );
}
