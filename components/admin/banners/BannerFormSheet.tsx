"use client";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useFormSheet } from "@/context/FormSheetContext";
import BannerForm from "./BannerForm";
import { BannerItem } from "./type";

export default function BannerFormSheet({
  banner,
  setSelectBanner,
}: {
  banner?: BannerItem | null;
  setSelectBanner?: (value: any) => any;
}) {
  const { isOpen, closeSheet } = useFormSheet();

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => {
        closeSheet();
        if (setSelectBanner) {
          setSelectBanner(null);
        }
      }}
    >
      <SheetContent className="scrollbar-none overflow-y-auto px-10 sm:max-w-lg dark:bg-[#18181C] dark:text-white">
        <div className="mt-0 flex flex-col gap-3 py-6">
          <div>
            <SheetTitle className="text-primary text-xl dark:text-white">{banner ? "Update Banner Content" : "Add Banner"}</SheetTitle>
            <SheetDescription>
              {banner ? "Update the banner content information" : "Create a new banner for the website 🎊"}
            </SheetDescription>
          </div>
          <BannerForm banner={banner ?? undefined} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
