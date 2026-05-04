import { getStockUnits } from "@/actions/admin/product-management/in-house-product-actions";
import AsyncSelectField from "@/components/form/AsynSelectFiled";
import InputField from "@/components/form/InputField";
import ActionButton from "@/components/shared/ActionButton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

export function DamageTable({ damageProduct }: { damageProduct: any }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "damages",
  });

  const hasVariants = damageProduct?.variants && damageProduct.variants.length > 0;

  const variationOptions = hasVariants
    ? damageProduct.variants.map((v: any) => ({
        value: v.variation,
        label: v.variation,
      }))
    : [];

  return (
    <div className="px-4">
      <div className="scrollbar-thin max-h-[300px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {hasVariants && <TableHead>Attribute Variation</TableHead>}
              <TableHead className="min-w-62.5">SKU</TableHead>
              <TableHead>Damage Percentage(%)</TableHead>
              <TableHead>Damage Description</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                  No damage entries added. Click "Add New" to add a row.
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field, index) => (
                <DamageTableRow
                  key={field.id}
                  index={index}
                  damageProduct={damageProduct}
                  hasVariants={hasVariants}
                  variationOptions={variationOptions}
                  onRemove={() => remove(index)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-start pb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-dashed"
          onClick={() =>
            append({
              _id: "",
              selectedVariation: "",
              damagePercentage: 0,
              damageDescription: "",
              isDamaged: true,
            })
          }
        >
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>
    </div>
  );
}

// ─── Row Component ────────────────────────────────────────────────
function DamageTableRow({
  index,
  damageProduct,
  hasVariants,
  variationOptions,
  onRemove,
}: {
  index: number;
  damageProduct: any;
  hasVariants: boolean;
  variationOptions: { value: string; label: string }[];
  onRemove: () => void;
}) {
  const { control, setValue } = useFormContext();

  // Watch the selected variation for this row
  const selectedVariation = useWatch({
    control,
    name: `damages.${index}.selectedVariation`,
  });

  const allDamages = useWatch({
    control,
    name: "damages",
  });

  // Build loadOptions for SKU async select
  const loadSkuOptions = async (search: string, page: number) => {
    const filters: Record<string, any> = {
      page,
      limit: 10,
      isDamaged: false,
      productId: damageProduct?._id,
    };

    if (hasVariants && selectedVariation) {
      filters.variation = selectedVariation;
    }

    if (search) {
      filters.search = search;
    }

    const res: any = await getStockUnits(filters);

    const options =
      res?.data?.data?.docs?.map((doc: any) => ({
        value: doc._id,
        label: doc.sku,
        isDisabled: allDamages?.some((d: any, i: number) => i !== index && d._id === doc._id) ?? false,
      })) ?? [];

    return {
      options,
      hasMore: res?.data?.pagination?.hasNextPage ?? false,
    };
  };

  return (
    <TableRow>
      {/* Attribute Variation */}
      {hasVariants && (
        <TableCell className="w-40">
          <InputField
            name={`damages.${index}.selectedVariation`}
            placeholder="Select variation"
            type="select"
            options={variationOptions}
            required
            cb={() => {
              // Reset SKU when variation changes
              setValue(`damages.${index}._id`, "");
            }}
          />
        </TableCell>
      )}

      {/* SKU (Async Select) */}
      <TableCell className="min-w-62.5">
        <AsyncSelectField
          name={`damages.${index}._id`}
          placeholder="Select SKU"
          required
          disabled={hasVariants && !selectedVariation}
          loadOptions={loadSkuOptions}
          searchPlaceholder="Didn't find your SKU? Search here"
          hideAllOptionsLoaded
          key={`sku-${index}-${selectedVariation || "no-variant"}`}
        />
      </TableCell>

      {/* Damage Percentage */}
      <TableCell className="w-40">
        <InputField name={`damages.${index}.damagePercentage`} placeholder="e.g. 10%" type="number" required />
      </TableCell>

      {/* Damage Description */}
      <TableCell>
        <InputField name={`damages.${index}.damageDescription`} placeholder="Write damage description" type="text" rowCount={1} required />
      </TableCell>

      {/* Action */}
      <TableCell className="text-right">
        <ActionButton type="delete" tooltip="Delete" onClick={onRemove} />
      </TableCell>
    </TableRow>
  );
}
