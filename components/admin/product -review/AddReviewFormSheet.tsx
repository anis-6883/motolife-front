"use client";

import { createReview } from "@/actions/admin/product-review/review-action";
import { getComboOfferList, getProductList } from "@/actions/all-dropdownlist/all-dropdownlist-action";
import { uploadMultipleImages } from "@/actions/upload-image/upload-image-actions";
import AsyncSelectField from "@/components/form/AsynSelectFiled";
import InputField, { ErrorStr } from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useFormSheet } from "@/context/FormSheetContext";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const reviewSchema = z
  .object({
    isAnonymous: z.boolean(),
    customerName: z.string().optional(),
    category: z.string().optional(),
    productId: z.string().optional(),
    rating: z.number({ message: "Rating is required!" }).min(1).max(5),
    review: z.string().min(1, "Review is required!").max(1000),
    images: z.array(z.union([z.string(), z.instanceof(File)])).optional(),
    isCombo: z.boolean().optional(),
    comboProductId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isCombo) {
        return !!data.comboProductId;
      }
      return !!data.productId;
    },
    {
      message: "Product is required!",
      path: ["productId"],
    }
  );

type FormValues = z.infer<typeof reviewSchema>;

const defaultValues: FormValues = {
  isAnonymous: false,
  customerName: "",
  category: "all",
  productId: "",
  rating: 0,
  review: "",
  isCombo: false,
  comboProductId: "",
  images: [],
};

// Modern Image Upload Component
function ModernImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
}: {
  value?: (string | File)[];
  onChange: (files: (string | File)[]) => void;
  maxFiles?: number;
}) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate previews for new files
  useEffect(() => {
    const newPreviews = value
      .map((item) => {
        if (item instanceof File) {
          return URL.createObjectURL(item);
        }
        return item as string;
      })
      .filter(Boolean);

    setPreviews(newPreviews);

    // Cleanup function
    return () => {
      newPreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [value]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);

      if (value.length + fileArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      onChange([...value, ...fileArray]);
    },
    [value, onChange, maxFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newValue = value.filter((_, i) => i !== index);
      onChange(newValue);
    },
    [value, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700",
          previews.length === 0 && "py-8"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />

        <div className="flex cursor-pointer flex-col items-center justify-center px-4 py-6" onClick={() => fileInputRef.current?.click()}>
          <div className="bg-primary/10 mb-3 rounded-full p-3">
            <Upload className="text-primary h-5 w-5" />
          </div>
          <p className="text-sm font-medium">
            <span className="text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-muted-foreground mt-1 text-xs">PNG, JPG, WEBP up to {maxFiles} files</p>
        </div>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {previews.length} {previews.length === 1 ? "image" : "images"} selected
            </p>
            <button type="button" onClick={() => onChange([])} className="text-destructive text-xs hover:underline">
              Remove all
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {previews.map((preview, index) => (
              <div key={`${preview}-${index}`} className="group bg-muted relative aspect-square overflow-hidden rounded-md border">
                <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                >
                  <X className="h-3 w-3 text-white" />
                </button>

                {/* Order badge */}
                <span className="absolute bottom-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/50 text-[10px] text-white">
                  {index + 1}
                </span>
              </div>
            ))}

            {/* Add more button */}
            {previews.length < maxFiles && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-muted/30 hover:border-primary hover:bg-primary/5 flex aspect-square items-center justify-center rounded-md border border-dashed border-gray-300 transition-colors dark:border-gray-700"
              >
                <ImageIcon className="text-muted-foreground h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StarRatingInput({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: string }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-900">
        How would you rate this product? <span className="text-destructive">*</span>
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || value);
          return (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(star)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`h-9 w-9 transition-colors ${filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-300"}`}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
      {error && <ErrorStr message={error} />}
    </div>
  );
}

export default function AddReviewFormSheet() {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, closeSheet } = useFormSheet();
  const form = useForm<FormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = form;
  const isAnonymous = useWatch({ control, name: "isAnonymous" });

  const reviewValue = watch("review");
  const category = useWatch({ control, name: "category" });

  const resetForm = () => {
    closeSheet();
    reset(defaultValues);
  };

  const handleFormSubmit = async (data: FormValues) => {
    setIsLoading(true);

    // Handle image uploads
    if (data.images && data.images.length > 0) {
      const newFiles = data.images.filter((img): img is File => img instanceof File);
      if (newFiles.length > 0) {
        const imagRes = await uploadMultipleImages(newFiles, "reviews");
        data.images = imagRes?.data?.map((img: any) => img.publicUrl) ?? [];
      }
    }

    const payload = {
      ...data,
      isCombo: data.category !== "all",
      comboProductId: data.category !== "all" ? data.productId : "",
      productId: data.category !== "all" ? "" : data.productId,
    };

    if (data.category !== "all") {
      delete payload.productId;
    } else {
      delete payload.comboProductId;
    }

    delete payload.category;

    const t = Toast.loading({
      title: "Status",
      description: "Submitting review...",
    });

    try {
      const res = await createReview(payload);

      if (res.data) {
        Toast.remove(t);
        Toast.success({
          title: "Success",
          description: "Review submitted successfully!",
        });
        resetForm();
      }
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || "Failed to submit review!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={resetForm}>
      <SheetContent className="sm:max-w-lg dark:bg-[#18181C] dark:text-white">
        <SheetHeader className="scrollbar-none overflow-y-auto">
          <SheetTitle className="text-primary text-xl dark:text-white">Add New Review</SheetTitle>
          <SheetDescription>Submit a product review on behalf of a customer</SheetDescription>

          <FormProvider {...form}>
            <div className="mt-4">
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
                  <CardHeader>
                    <CardTitle>Review Information</CardTitle>
                    <CardDescription>Fill in the review details below</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {/* Reviewer Name + Anonymous toggle */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-900">Reviewer Name</label>
                        <Controller
                          control={control}
                          name="isAnonymous"
                          render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-gray-900" />
                          )}
                        />
                      </div>
                      {!isAnonymous && <InputField name="customerName" type="text" placeholder="Simran" />}
                      {isAnonymous && <p className="text-muted-foreground text-xs">Review will be submitted anonymously</p>}
                    </div>

                    {/* Category / Product Selection */}
                    <div className="grid grid-cols-2 gap-3">
                      <InputField
                        type="select"
                        selectTriggerClassName="w-full"
                        name="category"
                        label="Category"
                        required
                        options={[
                          { label: "All Products", value: "all" },
                          { label: "Combo Product", value: "combo-product" },
                        ]}
                      />
                      <AsyncSelectField
                        name="productId"
                        label="Product"
                        required
                        loadOptions={async (search, page) => {
                          let res: any;
                          if (category === "all") {
                            res = await getProductList({ search, page, limit: 10 });
                            return {
                              options: res?.data?.docs ?? [],
                              hasMore: res?.data?.pagination?.hasNextPage,
                            };
                          } else {
                            res = await getComboOfferList({ search, page, limit: 10 });
                            return {
                              options: res?.data?.docs ?? [],
                              hasMore: res?.data?.pagination?.hasNextPage,
                            };
                          }
                        }}
                      />
                    </div>

                    {/* Star Rating */}
                    <Controller
                      control={control}
                      name="rating"
                      render={({ field }) => (
                        <StarRatingInput value={field.value} onChange={field.onChange} error={errors.rating?.message} />
                      )}
                    />

                    {/* Review Text */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-900">
                        Your Review <span className="text-destructive">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="review"
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={6}
                            placeholder="Write your review here..."
                            disabled={isLoading}
                            maxLength={1000}
                            className="border-input placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-xs focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        )}
                      />
                      <div className="flex items-start justify-between">
                        {errors.review ? <ErrorStr message={errors.review.message} /> : <span />}
                        <span className="text-muted-foreground ml-auto text-xs">{reviewValue?.length ?? 0}/1000</span>
                      </div>
                    </div>

                    {/* Modern Image Upload */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-900">
                        Upload Images <span className="text-muted-foreground font-normal">(Optional)</span>
                      </label>
                      <Controller
                        control={control}
                        name="images"
                        render={({ field }) => <ModernImageUpload value={field.value || []} onChange={field.onChange} maxFiles={5} />}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="mt-5 flex justify-end gap-3">
                  <Button onClick={resetForm} type="button" variant="outline" disabled={isLoading} className="rounded-full px-6">
                    Reset
                  </Button>
                  <Button type="submit" disabled={isLoading} className="cool rounded-full px-6">
                    Submit
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
