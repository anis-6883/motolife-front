import SortDateTable from "@/components/shared/SortDateTable";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SubcategorySheetProps } from "@/lib/types";
import { removeColumnsByKeys } from "@/lib/utils";

export default function SubcategorySheet({
  showSubCategory,
  setShowSubCategory,
  selectedCategory,
  columns,
  tableId,
  isLoading,
  handleSort,
}: SubcategorySheetProps) {
  return (
    <Sheet open={showSubCategory} onOpenChange={setShowSubCategory}>
      <SheetContent className="sm:max-w-lg dark:bg-gray-900 dark:text-white">
        <SheetHeader>
          <SheetTitle className="text-primary text-xl dark:text-white">Subcategory List</SheetTitle>
          <SheetDescription>
            List of subcategories for <span className="text-primary text-base font-bold">{selectedCategory?.name}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="p-4">
          <SortDateTable
            data={selectedCategory?.subCategories || []}
            columns={removeColumnsByKeys(columns, ["actions", "subCategories", "image"])}
            tableId={tableId}
            isLoading={isLoading}
            onSortEnd={handleSort}
            pagination={false}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
