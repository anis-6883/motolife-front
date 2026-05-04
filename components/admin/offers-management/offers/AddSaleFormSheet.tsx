"use client";

import { createSalesOffer, updateOffers } from "@/actions/admin/offers-management/offers-actions";
import { getProductCategoriesList } from "@/actions/all-dropdownlist/all-dropdownlist-action";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import SingleImageUpload, { ImageRatio } from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useFormSheet } from "@/context/FormSheetContext";
import { generateSlug } from "@/lib/utils";
import { useResourceType } from "@/store/useResourceType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { offersSchema } from "./schema";
import { ResourceType, Sale } from "./types";

type FormValues = z.infer<typeof offersSchema>;

const defaultValues: FormValues = {
  title: "",
  startDate: "",
  endDate: "",
  resourceType: undefined,
  //   bannerUrl: "",
  image: "",
  status: true,
  categoryId: "",
  sellerId: "",
  comboProductId: "",
};

const toDateInputValue = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toISOString().split("T")[0];
};

const saleToFormValues = (sale: Sale): FormValues => ({
  title: sale.title ?? "",
  startDate: toDateInputValue(sale.startDate || sale.startDate),
  endDate: toDateInputValue(sale.endDate),
  resourceType: sale.resourceType ?? "",
  //   bannerUrl: sale.bannerUrl ?? "",
  image: sale.image ?? "",
  status: sale.status ?? true,
  categoryId: sale?.category?._id,
  sellerId: sale?.seller?._id,
  comboProductId: sale?.comboProduct?._id,
});

export default function AddSaleFormSheet({ sale }: { sale?: Sale | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeRatio, setActiveRatio] = useState<ImageRatio[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [uploadImageCredentials, setUploadImageCredentials] = useState<{
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }>({ fileKey: "", publicUrl: "", uploaded: false });

  const { isOpen, closeSheet } = useFormSheet();
  const isEditMode = !!sale?._id;
  const { type } = useResourceType();
  const form = useForm<FormValues>({
    resolver: zodResolver(offersSchema),
    defaultValues, // always start with empty defaults
  });

  const resourceTypeOptions: { value: ResourceType; label: string; ratio?: string; disabled?: boolean }[] = [
    // { value: "custom", label: "Custom" },
    // { value: "category", label: "Category", ratio: "4:3", disabled: type.includes("category") && sale?.resourceType !== "category" },
    // { value: "store", label: "Store" },
    {
      value: "flash_sale",
      label: "Flash Sale",
      ratio: "9:16",
      disabled: type.includes("flash_sale") && sale?.resourceType !== "flash_sale",
    },
    {
      value: "todays_deal",
      label: "Todays Deal",
      ratio: "7:8",
      disabled: type.includes("todays_deal") && sale?.resourceType !== "todays_deal",
    },
    // { value: "combo", label: "Combo offer" }, //combo offer temporary remove order by nazat vai
  ];
  // ── KEY FIX ──────────────────────────────────────────────────────────────
  // useForm only reads `defaultValues` once on initial mount.
  // To populate edit mode (or clear when switching create → edit → create),
  // we call form.reset() inside a useEffect that watches the `sale` prop and `isOpen`.
  // This handles three cases:
  //   1. Sheet opens in create mode  → sale is null  → reset to empty defaults
  //   2. Sheet opens in edit mode    → sale has data  → reset to sale values
  //   3. Sheet switches between records (sale._id changes) → re-populates correctly
  useEffect(() => {
    if (isOpen) {
      if (sale) {
        form.reset(saleToFormValues(sale));
        // Set existing image for the uploader
        setUploadImageCredentials({
          fileKey: "",
          publicUrl: sale.image || "",
          uploaded: false,
        });
      } else {
        form.reset(defaultValues);
        // Clear the image uploader state
        setUploadImageCredentials({ fileKey: "", publicUrl: "", uploaded: false });
      }
    }
  }, [sale, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Watch resource type to conditionally show Banner URL
  const resourceType = useWatch({ control: form.control, name: "resourceType" });
  const isCategory = resourceType === "category";
  // const isStore = resourceType === "store";
  // const isCombo = resourceType === "combo";
  // ── Handlers ──────────────────────────────────────────────────────────────
  const resetForm = () => {
    closeSheet();
    form.reset(defaultValues);
    setUploadImageCredentials({ fileKey: "", publicUrl: "", uploaded: false });
  };

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: isEditMode ? "Updating the sale..." : "Creating the sale...",
    });

    try {
      const payload = {
        title: data.title,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        image: data.image,
        resourceType: data.resourceType,
        status: data.status,
        // ...(data?.bannerUrl && {
        //   url: data?.bannerUrl,
        // }),
        ...(isCategory && {
          categoryId: data?.categoryId,
        }),
        // ...(isStore && {
        //   sellerId: data?.sellerId,
        // }),
        // ...(isCombo && {
        //   comboProductId: data?.comboProductId,
        // }),
        ...(!isEditMode && {
          slug: generateSlug(data?.title),
        }),
      };

      let res: any;

      if (isEditMode && sale?._id) {
        // TODO: Implement updateSalesOffer action
        // res = await updateSalesOffer(sale._id, payload);
        // if (!res.ok) throw new Error(res.message || "Failed to update offer!");
        res = await updateOffers(sale._id, payload);
        Toast.remove(t);
        Toast.success({
          title: "Success",
          description: "Sale updated successfully!",
        });
        resetForm();
      } else {
        res = await createSalesOffer(payload);
        Toast.remove(t);

        // Check if the response indicates an error
        if (!res.ok) {
          Toast.error({
            title: "Failed",
            description: res.message || "Failed to create offer!",
          });
          return; // Exit early, don't reset form on error
        }

        // Success case
        Toast.success({
          title: "Success",
          description: "Sale created successfully!",
        });
        resetForm();
      }
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || "Failed to complete sale operation!",
      });
      setActiveRatio([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isCategory) {
      const getCategoriesOptions = async () => {
        setIsLoading(true);
        const response: any = await getProductCategoriesList();
        setCategoryOptions(response?.data);
        setIsLoading(false);
      };
      getCategoriesOptions();
    }
  }, [isCategory]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Sheet open={isOpen} onOpenChange={resetForm}>
      <SheetContent className="sm:max-w-lg dark:bg-[#18181C] dark:text-white">
        <SheetHeader className="scrollbar-none overflow-y-auto">
          <SheetTitle className="text-primary text-xl dark:text-white">{isEditMode ? "Update Sale" : "Add New Sale"}</SheetTitle>
          <SheetDescription>
            {isEditMode ? "Update the sale details and banner information" : "Create a new promotional sale with banner and scheduling 🎊"}
          </SheetDescription>

          <FormProvider {...form}>
            <div className="mt-4">
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
                  <CardHeader>
                    <CardTitle>Sale Information</CardTitle>
                    <CardDescription>Basic information about the sale</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Sale Title */}
                    <InputField name="title" label="Sale Title" placeholder="Enter sale title" type="text" required />

                    {/* Start Date & End Date */}
                    <div className="grid grid-cols-2 gap-4">
                      <InputField name="startDate" label="Start Date" placeholder="Pick a date" type="date" required />
                      <InputField name="endDate" label="End Date" placeholder="Pick a date" type="date" required />
                    </div>

                    {/* Resource Type */}
                    <InputField
                      name="resourceType"
                      label="Resource Type"
                      type="select"
                      required
                      selectTriggerClassName="w-full"
                      options={resourceTypeOptions}
                      placeholder="Select resource type"
                      cb={(val) => {
                        const activeType = resourceTypeOptions.find((item) => item.value === val);
                        if (activeType?.ratio) {
                          setActiveRatio([activeType.ratio as ImageRatio]);
                        }
                      }}
                    />

                    {/* Banner URL — only shown when resourceType !== "custom" */}
                    {isCategory && (
                      <InputField
                        type="select"
                        selectTriggerClassName="w-full"
                        name="categoryId"
                        label="Category"
                        required
                        options={categoryOptions}
                      />
                    )}
                    {/* {isProduct && (
                      <AsyncSelectField
                        name="productId"
                        label="Product"
                        required
                        defaultOption={sale?.product ? { value: sale.product?._id, label: sale.product?.name } : undefined}
                        loadOptions={async (search, page) => {
                          const res: any = await getProductList({ search, page, limit: 10 });
                          return {
                            options: res?.data?.docs ?? [],
                            hasMore: res?.data?.pagination?.hasNextPage,
                          };
                        }}
                      />
                    )} */}
                    {/* {isStore && (
                      <AsyncSelectField
                        name="sellerId"
                        label="Store"
                        required
                        defaultOption={sale?.seller ? { value: sale.seller?._id, label: sale.seller?.name } : undefined}
                        loadOptions={async (search, page) => {
                          const res: any = await getStoreList({ search, page, limit: 10 });
                          return {
                            options: res?.data?.docs ?? [],
                            hasMore: res?.data?.pagination?.hasNextPage,
                          };
                        }}
                      />
                    )}
                    {isCombo && (
                      <AsyncSelectField
                        name="comboProductId"
                        label="Combo Offer"
                        required
                        defaultOption={sale?.comboProduct ? { value: sale.comboProduct?._id, label: sale.comboProduct?.name } : undefined}
                        loadOptions={async (search, page) => {
                          const res: any = await getComboOfferList({ search, page, limit: 10 });
                          return {
                            options: res?.data?.docs ?? [],
                            hasMore: res?.data?.pagination?.hasNextPage,
                          };
                        }}
                      />
                    )} */}
                    {/* <InputField
                      name="bannerUrl"
                      label="Banner URL"
                      placeholder="Enter URL or path (e.g., /product-list)"
                      type="text"
                      required
                    /> */}
                    {/* Upload Image */}
                    <SingleImageUpload
                      name="image"
                      label="Upload Image"
                      variant="dropzone"
                      setIsUploading={setIsImageUploading}
                      existingImage={isEditMode ? sale?.image : ""}
                      uploadImageCredentials={uploadImageCredentials}
                      setUploadImageCredentials={setUploadImageCredentials}
                      accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
                      maxSizeMB={1}
                      folderName="sales/banners"
                      // allowedRatios={activeRatio}
                      aspect="square"
                      disabled={!resourceType}
                    />

                    {/* Status */}
                    <FormSwitch name="status" label="Status" description="Control sale visibility!" />
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="mt-5 flex justify-end gap-3">
                  <Button
                    onClick={resetForm}
                    type="button"
                    variant="outline"
                    disabled={isLoading || isImageUploading}
                    className="rounded-full px-6"
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={isLoading || isImageUploading} className="cool rounded-full px-6">
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          </FormProvider>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
