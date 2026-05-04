"use client";

import { createComboOffer, updateComboOffer } from "@/actions/admin/product-management/combo-offer-actions";
import { createInHouseProduct, updateInHouseProduct } from "@/actions/admin/product-management/in-house-product-actions";
import { getYoutubeVideoTitle } from "@/actions/admin/product-management/product-actions";
import FormSwitch from "@/components/form/FormSwitch";
import InputField, { ErrorStr } from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import TagInput from "@/components/form/TagInput";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DISCOUNT_OPTIONS } from "@/config/constant";
import routes from "@/config/routes";
import { InHouseProduct } from "@/lib/types";
import { countChars, generateSlug, generateUniqueSKU, getYouTubeThumbnail, removeEmptyValues } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { AiOutlineHome } from "react-icons/ai";
import { FiPlusCircle } from "react-icons/fi";
import { GrEdit } from "react-icons/gr";
import { PiBarcodeBold, PiImageLight, PiReadCvLogo } from "react-icons/pi";
import { RiDiscountPercentLine } from "react-icons/ri";
import { TbCoinTaka } from "react-icons/tb";
import * as z from "zod";

export default function InHouseProductForm({
  product,
  categories,
  brands,
  benefits,
  attributes,
  mode = "in-house",
  isDamaged = false,
}: {
  product?: InHouseProduct;
  categories: { label: string; value: string; subCategories: { label: string; value: string }[] | null }[];
  brands: { label: string; value: string }[];
  benefits: { label: string; value: string }[];
  attributes: { label: string; value: string; relatedValues: { label: string; value: string }[] }[];
  mode?: "in-house" | "combo-offer";
  isDamaged?: boolean;
}) {
  const router = useRouter();
  const isEditMode = !!product?._id;
  const [isLoading, setIsLoading] = useState(false);
  const [editSkuDisabled, setEditSkuDisabled] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [editDiscountPriceDisabled, setEditDiscountPriceDisabled] = useState(true);
  const [subCategories, setSubCategories] = useState<{ label: string; value: string }[] | null>(null);
  const [uploadImageCredentials, setUploadImageCredentials] = useState<{
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }>({
    fileKey: "",
    publicUrl: "",
    uploaded: false,
  });

  const [uploadMultipleImageCredentials, setUploadMultipleImageCredentials] = useState<
    {
      fileKey: string;
      publicUrl: string;
      uploaded?: boolean;
    }[]
  >([]);
  const [uploadMultipleSizeGuideImageCredentials, setUploadMultipleSizeGuideImageCredentials] = useState<
    {
      fileKey: string;
      publicUrl: string;
      uploaded?: boolean;
    }[]
  >([]);
  const [uploadMultipleColorImageCredentials, setUploadMultipleColorImageCredentials] = useState<
    {
      fileKey: string;
      publicUrl: string;
      uploaded?: boolean;
    }[]
  >([]);

  const YOUTUBE_REGEX =
    /^(?:https?:\/\/)?(?:(?:www\.|m\.|music\.)?youtube\.com\/(?:watch\?(?:[^&]*&)*v=|shorts\/|live\/|embed\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:[?&#].*)?$/;

  const ProductFormSchema = z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Product name is required!")
        .max(100, "Product name cannot exceed 100 characters!")
        .regex(/[a-zA-Z]/, "Product name must contain at least one letter!"),
      thumbnail: z.any().refine((val) => val?.length > 0, { message: "Product thumbnail is required!" }),
      category: z.string().optional(),
      subCategory: z.string().optional(),
      brand: z.string().optional(),
      unit: z.string().optional(),
      sku: z.string().min(1, "SKU is required!"),
      searchTags: z.array(z.string()).optional(),
      description: z
        .string()
        .refine((val) => countChars(val) > 0, { message: "Description is required!" })
        .refine((val) => countChars(val) <= 1200, { message: "Description must be at most 1200 characters!" }),
      showSizeGuide: z.boolean(),
      sizeGuide: z.string().optional(),
      sizeGuideImages: z.array(z.any()).optional(),
      images: z.array(z.any()).optional(),
      videoLinks: z.array(
        z.object({
          title: z.string().optional(),
          thumbnail: z.string().optional(),
          url: z.string().refine((val) => YOUTUBE_REGEX.test(val.trim()), {
            message: "Invalid YouTube video link!",
          }),
        })
      ),
      snapshotLink: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val || val.trim() === "") return true; // optional — empty is fine
            return YOUTUBE_REGEX.test(val.trim());
          },
          { message: "Please enter a valid YouTube video link!" }
        ),
      showBenefit: z.boolean(),
      benefit: z.string().optional(),
      sellingPrice: z.number(),
      buyingPrice: z.number(),
      stockQuantity: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
      showDiscount: z.boolean(),
      discountType: z.string().optional(),
      discountValue: z.number().optional(),
      discountPrice: z.number().optional(),
      showVariation: z.boolean(),
      variants: z
        .array(
          z.object({
            attributeName: z.string(),
            attributeValue: z.array(z.string()),
            showColorWiseImages: z.boolean(),
            images: z.array(z.any()).optional(),
          })
        )
        .optional(),
      variantCombinations: z
        .array(
          z.object({
            attributes: z.array(z.any()),

            variation: z.string().trim().min(1, "Variation name is required!").max(100, "Variation name cannot exceed 100 characters!"),

            sku: z
              .string()
              .trim()
              .min(1, "SKU is required!")
              .min(3, "SKU must be at least 3 characters!")
              .max(50, "SKU cannot exceed 50 characters!"),

            variantPrice: z
              .number()
              .refine((val) => typeof val === "number" && !isNaN(val), {
                message: "Variant price must be a number!",
              })
              .min(1, "Variant price must be at least 1!")
              .max(10_00_000, "Variant price cannot exceed 10,00,000!"),

            discountPrice: z
              .number()
              .refine((val) => typeof val === "number" && !isNaN(val), {
                message: "Discount price must be a number!",
              })
              .min(1, "Discount price must be at least 1!")
              .max(10_00_000, "Discount price cannot exceed 10,00,000!")
              .optional(),

            discountType: z.string().optional(),

            discountValue: z
              .number()
              .refine((val) => typeof val === "number" && !isNaN(val), {
                message: "Discount value must be a number!",
              })
              .min(1, "Discount value must be at least 1!")
              .max(90, "Discount value cannot exceed 90!")
              .optional(),
            stock: z.preprocess(
              (val) => (val === "" ? undefined : Number(val)),
              z
                .number()
                .refine((val) => typeof val === "number" && !isNaN(val), {
                  message: "Stock must be a number!",
                })
                .min(0, "Stock cannot be negative!")
                .max(1_00_000, "Stock cannot exceed 1,00,000!")
            ),
          })
        )
        .optional(),
      isPublished: z.boolean(),
      isFeatured: z.boolean(),
      isNewArrived: z.boolean(),
      isUpcoming: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (mode === "in-house") {
        if (!data.category || data.category.trim().length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Category is required!",
            path: ["category"],
          });
        }

        if (!data.unit || data.unit.trim().length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Unit is required!",
            path: ["unit"],
          });
        }

        if (!data.brand || data.brand.trim().length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Brand is required!",
            path: ["brand"],
          });
        }

        const selectedCategory = categories.find((c) => c.value === data.category);
        const hasSubCategories = selectedCategory?.subCategories && selectedCategory.subCategories.length > 0;

        if (hasSubCategories && !data.subCategory) {
          ctx.addIssue({
            code: "custom",
            message: "Subcategory is required!",
            path: ["subCategory"],
          });
        }
      }

      if (data.showBenefit && !data.benefit) {
        ctx.addIssue({
          code: "custom",
          message: "Benefit is required!",
          path: ["benefit"],
        });
      }

      // Selling price validation
      if (data.sellingPrice === undefined || data.sellingPrice === null) {
        ctx.addIssue({
          code: "custom",
          message: "Selling price is required!",
          path: ["sellingPrice"],
        });
      } else if (data.sellingPrice < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Selling price must be at least 1!",
          path: ["sellingPrice"],
        });
      } else if (data.sellingPrice > 10_00_000) {
        ctx.addIssue({
          code: "custom",
          message: "Selling price cannot exceed 10,00,000!",
          path: ["sellingPrice"],
        });
      }

      // Buying price validation
      if (data.buyingPrice === undefined || data.buyingPrice === null) {
        ctx.addIssue({
          code: "custom",
          message: "Buying price is required!",
          path: ["buyingPrice"],
        });
      } else if (data.buyingPrice < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Buying price must be at least 1!",
          path: ["buyingPrice"],
        });
      } else if (data.buyingPrice > 10_00_000) {
        ctx.addIssue({
          code: "custom",
          message: "Buying price cannot exceed 10,00,000!",
          path: ["buyingPrice"],
        });
      }

      // Price comparison validation
      if (data.sellingPrice !== undefined && data.buyingPrice !== undefined) {
        if (data.sellingPrice < data.buyingPrice) {
          ctx.addIssue({
            code: "custom",
            message: "Must be greater than or equal to buying price!",
            path: ["sellingPrice"],
          });
        }
      }

      if (data.showDiscount) {
        if (!data.discountType) {
          ctx.addIssue({
            code: "custom",
            message: "Discount type is required!",
            path: ["discountType"],
          });
        }

        if (!data.discountValue || data.discountValue < 1) {
          ctx.addIssue({
            code: "custom",
            message: "Discount value is required!",
            path: ["discountValue"],
          });
        }

        if (!data.discountPrice || data.discountPrice < 1) {
          ctx.addIssue({
            code: "custom",
            message: "Discount price is required!",
            path: ["discountPrice"],
          });
        }

        if (data.discountType === "percentage") {
          if ((data.discountValue ?? 0) > 90) {
            ctx.addIssue({
              code: "custom",
              message: "Discount value cannot exceed 90%",
              path: ["discountValue"],
            });
          }
        }
      }

      if (data.showVariation) {
        if (!data.variants || data.variants.length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "At least one variant is required!",
            path: ["variants"],
          });
        }

        if (data.variants && data.variants.length > 0) {
          const hasColorAttribute = data.variants.some((v) => v.attributeName.toLowerCase().startsWith("col") && v.showColorWiseImages);
          if (hasColorAttribute && (!data.variantCombinations || data.variantCombinations.length === 0)) {
            ctx.addIssue({
              code: "custom",
              message: "Variant combinations are required!",
              path: ["variantCombinations"],
            });
          }

          if (data.variantCombinations && data.variantCombinations.length > 0) {
            data.variantCombinations.forEach((item, index) => {
              if (item.stock === undefined || item.stock === null) {
                ctx.addIssue({
                  code: "custom",
                  message: "Variant stock is required!",
                  path: ["variantCombinations", index, "stock"],
                });
              }
            });
          }
        }
      } else {
        if (data.stockQuantity === undefined || data.stockQuantity === null) {
          ctx.addIssue({
            code: "custom",
            message: "Stock quantity is required!",
            path: ["stockQuantity"],
          });
        }
      }

      if (data.showSizeGuide) {
        if (!data.sizeGuide || data.sizeGuide.trim().length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Size guide is required!",
            path: ["sizeGuide"],
          });
        }

        if (!data.sizeGuideImages || data.sizeGuideImages.length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Size guide images are required!",
            path: ["sizeGuideImages"],
          });
        }
      }
    });

  type FormValues = z.infer<typeof ProductFormSchema>;

  const groupedVariants = convertVariantsToAttributes(product?.variants || [], attributes, product?.colorWiseImages || []);
  // console.log(product, "whole product data");
  const form = useForm<FormValues, unknown>({
    resolver: zodResolver(ProductFormSchema as any),
    defaultValues: {
      name: product?.name || "",
      thumbnail: product?.thumbnail || "",
      category: product?.category || "",
      subCategory: product?.subCategory || "",
      brand: product?.brand || "",
      unit: product?.unit || "",
      sku: product?.sku || "",
      searchTags: product?.searchTags || [],
      description: product?.description || "",
      sizeGuide: product?.sizeGuide?.description || "",
      sizeGuideImages: product?.sizeGuide?.images || [],
      images: product?.images || [],
      videoLinks: product?.videoLinks || [],
      snapshotLink: "",
      showBenefit: product?.benefit ? true : false,
      benefit: product?.benefit || "",
      showDiscount: product?.discountValue ? true : false,
      showSizeGuide: product?.sizeGuide ? true : false,
      showVariation: product?.variants && product?.variants.length > 0 ? true : false,
      variants:
        groupedVariants.length > 0 && mode === "in-house"
          ? groupedVariants
          : [
              {
                attributeName: "",
                attributeValue: [],
                showColorWiseImages: false,
                images: [],
              },
            ],
      variantCombinations: product?.variants || [],
      sellingPrice: Number(product?.sellingPrice) || 0,
      buyingPrice: Number(product?.buyingPrice) || 0,
      stockQuantity: Number(product?.stockQuantity) || 0,
      discountType: product?.discountType || "percentage",
      discountValue: Number(product?.discountValue) || 0,
      discountPrice: Number(product?.discountPrice) || 0,
      isPublished: product?.isPublished ?? false,
      isFeatured: product?.isFeatured ?? false,
      isNewArrived: product?.isNewArrived ?? false,
      isUpcoming: product?.isUpcoming ?? false,
    },
  });

  const { append: appendVideoLink, remove: removeVideoLink } = useFieldArray<any>({
    control: form.control,
    name: "videoLinks",
  });

  const { append: appendVariant, remove: removeVariant } = useFieldArray<any>({
    control: form.control,
    name: "variants",
  });

  const { replace: replaceVariantCombinations, fields: variantCombinationsFields } = useFieldArray({
    control: form.control,
    name: "variantCombinations",
  });

  const variantCombinations = useWatch({
    control: form.control,
    name: "variantCombinations",
    defaultValue: [],
  });

  const [
    category,
    subCategory,
    sku,
    sellingPrice,
    discountType,
    discountValue,
    showDiscount,
    showBenefit,
    showSizeGuide,
    showVariation,
    productName,
    variants,
  ] = useWatch({
    control: form.control,
    name: [
      "category",
      "subCategory",
      "sku",
      "sellingPrice",
      "discountType",
      "discountValue",
      "showDiscount",
      "showBenefit",
      "showSizeGuide",
      "showVariation",
      "name",
      "variants",
    ],
    defaultValue: {
      category: "",
      subCategory: "",
      sku: "",
      sellingPrice: 0,
      discountType: "percentage",
      discountValue: 0,
      showDiscount: false,
      showBenefit: false,
      showSizeGuide: false,
      showVariation: false,
      name: "",
      variants: [],
    },
  });

  const initials =
    productName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Image";

  // Select SubCategory based on Category
  useEffect(() => {
    if (category) {
      const selectedCategory = categories.find((c) => c.value === category);
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategories ?? null);
      }

      if (product?.subCategory) {
        form.setValue("subCategory", product?.subCategory);
      }
    } else {
      form.setValue("subCategory", "");
      form.clearErrors("subCategory");
      setSubCategories(null);
    }
  }, [category, categories, form, product]);

  // Generate SKU on Product Name Change
  useEffect(() => {
    if (!isEditMode) {
      if (productName) {
        form.setValue("name", productName, { shouldTouch: true });
        form.setValue("sku", generateUniqueSKU(productName), { shouldTouch: true });
        form.clearErrors("sku");
      } else if (form.formState.touchedFields.name) {
        form.setValue("sku", "", { shouldTouch: true });
      }
    }
  }, [form, productName, isEditMode]);

  // Push Product Images into Upload Multiple Image Container
  useEffect(() => {
    if (product?.images && product?.images.length > 0) {
      const images = product?.images.map((img) => {
        return {
          fileKey: "",
          publicUrl: img,
          uploaded: false,
        };
      });
      setUploadMultipleImageCredentials(images);
    }
  }, [product]);

  // Push Size Guide Images into Upload Multiple Size Guide Image Container
  useEffect(() => {
    if (product?.colorWiseImages && product?.colorWiseImages.length > 0) {
      const images = product?.colorWiseImages
        .filter((img: any) => img?.image)
        .map((img: any) => {
          return {
            fileKey: "",
            publicUrl: img.image,
            uploaded: false,
          };
        });
      setUploadMultipleColorImageCredentials(images);
    }
  }, [product]);

  // Push Size Guide Images into Upload Multiple Size Guide Image Container
  useEffect(() => {
    if (product?.sizeGuide?.images && product?.sizeGuide?.images.length > 0) {
      const images = product?.sizeGuide?.images.map((img) => {
        return {
          fileKey: "",
          publicUrl: img,
          uploaded: false,
        };
      });
      setUploadMultipleSizeGuideImageCredentials(images);
    }
  }, [product]);

  // Calculate Discount Price
  useEffect(() => {
    if (sellingPrice <= 0) return;
    if (!discountValue || discountValue <= 0) return;
    if (isEditMode && product?.discountValue === discountValue && product?.discountType === discountType) return;

    let finalPrice = sellingPrice;
    if (discountType === "percentage") {
      const discountAmount = (sellingPrice * discountValue) / 100;
      finalPrice = sellingPrice - discountAmount;

      if (finalPrice < 0) {
        Toast.error({
          title: "Error",
          description: "Discount percentage cannot be greater than 100!",
        });
        finalPrice = 0;
        form.setValue("discountValue", 0);
      }
    } else {
      finalPrice = sellingPrice - discountValue;

      if (finalPrice < 0) {
        Toast.error({
          title: "Error",
          description: "Discount price cannot be greater than selling price!",
        });
        finalPrice = 0;
        form.setValue("discountValue", 0);
      }
    }

    form.setValue("discountPrice", Number(finalPrice.toFixed(2)));
  }, [showDiscount, discountType, discountValue, sellingPrice, form, isEditMode, product]);

  // Set Variant Combinations
  useEffect(() => {
    const combinations = generateVariantCombinations(
      variants ?? [],
      attributes,
      sku,
      product?.variants,
      sellingPrice
      // ✅ No longer passing discountType/discountValue here
    );

    const currentValues = form.getValues("variantCombinations") ?? [];
    const existingMap = new Map(currentValues.map((item) => [item.variation, item]));

    let merged = combinations.map((combo) => {
      const existing = existingMap.get(combo.variation);
      return {
        ...combo,
        variantPrice: existing?.variantPrice ?? combo.variantPrice,
        stock: existing?.stock ?? combo.stock,
        sku: existing?.sku ?? combo.sku,
        // ✅ Don't restore discountPrice from form state — always recompute below
      };
    });

    // ✅ Auto-populate discountPrice for each row based on its variantPrice
    if (showDiscount && discountValue && discountValue > 0) {
      merged = merged.map((combo: any) => {
        const base = combo.variantPrice || 0;
        let dp: number;

        if (discountType === "percentage") {
          dp = Number((base - (base * discountValue) / 100).toFixed(2));
        } else {
          // flat
          dp = Number((base - discountValue).toFixed(2));
        }

        dp = Math.max(0, dp);

        return dp < base ? { ...combo, discountPrice: dp } : { ...combo }; // don't set discountPrice if not actually reduced
      });
    } else {
      // Strip discountPrice if discount is off
      merged = merged.map(({ discountPrice, ...rest }: any) => rest);
    }

    if (mode === "in-house") {
      replaceVariantCombinations(merged);
    }
  }, [variants, replaceVariantCombinations, attributes, sku, product, form, mode, discountType, discountValue, sellingPrice, showDiscount]);
  // useEffect(() => {
  //   const combinations = generateVariantCombinations(
  //     variants ?? [],
  //     attributes,
  //     sku,
  //     product?.variants,
  //     sellingPrice,
  //     discountType,
  //     discountValue
  //   );

  //   // Get current field values before replacing
  //   const currentValues = form.getValues("variantCombinations") ?? [];

  //   // Build a map of existing values keyed by variation string
  //   const existingMap = new Map(currentValues.map((item) => [item.variation, item]));

  //   // Merge: keep user-entered data if combination already existed
  //   let merged = combinations.map((combo) => {
  //     const existing = existingMap.get(combo.variation);

  //     if (existing) {
  //       return {
  //         ...combo,
  //         variantPrice: existing.variantPrice,
  //         discountPrice: existing.discountPrice,
  //         stock: existing.stock,
  //         sku: existing.sku,
  //       };
  //     }
  //     return combo;
  //   });

  //   if (showDiscount && discountValue && discountValue > 0) {
  //     merged = merged.map((combo: any) => {
  //       combo.discountType = discountType;
  //       combo.discountValue = discountValue;
  //       return combo;
  //     });
  //   }

  //   if (mode === "in-house") {
  //     replaceVariantCombinations(merged);
  //   }
  // }, [variants, replaceVariantCombinations, attributes, sku, product, form, mode, discountType, discountValue, sellingPrice, showDiscount]);

  // Scrape Video Title
  const handleScrapeVideoTitle = async () => {
    const videoUrl = form.getValues("snapshotLink");
    if (!videoUrl) return Toast.warning({ title: "Warning", description: "Please enter a product video link!" });

    const t = Toast.loading({ title: "Please Wait", description: "Fetching video title..." });

    try {
      const res = await getYoutubeVideoTitle(videoUrl);

      if (res?.status) {
        appendVideoLink({ title: res?.data?.title, url: videoUrl, thumbnail: getYouTubeThumbnail(videoUrl) });
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Video title fetched successfully!" });
      } else {
        appendVideoLink({
          title: "Not Found",
          url: videoUrl,
          thumbnail: getYouTubeThumbnail(videoUrl),
        });
        Toast.remove(t);
        Toast.error({
          title: "Error",
          description: res?.message || "Could not retrieve the video title. Please check the link and try again.",
        });
      }
    } catch (error: any) {
      appendVideoLink({
        title: "Not Found",
        url: videoUrl,
        thumbnail: getYouTubeThumbnail(videoUrl),
      });

      Toast.remove(t);
      Toast.error({
        title: "Error",
        description: error?.message || "Something went wrong while fetching the video title. Please try again.",
      });
    }
  };

  // Prepare Product Payload Data
  const prepareProductData = (data: any) => {
    // Thumbnail
    if (uploadImageCredentials.uploaded) {
      data.thumbnail = uploadImageCredentials.publicUrl;
      if (isEditMode) data._thumbnailUploaded = true;
    }

    // Multiple images
    if (uploadMultipleImageCredentials.length > 0 && data?.images) {
      const newImages = uploadMultipleImageCredentials.map((cred) => cred.publicUrl);

      if (isEditMode) {
        const deletedImages = product.images.filter((img: string) => !newImages.includes(img)) || [];

        data.images = newImages.filter((img) => !deletedImages.includes(img));
        data._deletedImages = deletedImages;
      } else {
        data.images = newImages;
      }
    }

    // Color Wise Images
    if (uploadMultipleColorImageCredentials.length > 0) {
      const newImages = uploadMultipleColorImageCredentials.map((cred) => cred.publicUrl);

      if (isEditMode) {
        const deletedImages = product.colorWiseImages.filter((img: any) => !newImages.includes(img?.image)) || [];

        data.colorWiseImages = newImages.filter((img: any) => !deletedImages.includes(img?.image));
        data._deletedColorWiseImages = deletedImages.map((img: any) => img?.image).filter((img: any) => img);
      } else {
        data.colorWiseImages = newImages;
      }
    }

    // Size Guide
    // if (!data.showSizeGuide) {
    //   data = removeEmptyValues(data, ["showSizeGuide", "sizeGuide", "sizeGuideImages"]);
    // }
    if (!data.showSizeGuide) {
      delete data.sizeGuide;
      delete data.sizeGuideImages;
      delete data.showSizeGuide;
      if (isEditMode) {
        data.sizeGuide = null;
        data._deletedSizeGuideImages = product?.sizeGuide?.images || [];
      }
    } else {
      const newImages = uploadMultipleSizeGuideImageCredentials.map((cred) => cred.publicUrl);

      if (isEditMode) {
        const deletedImages = product?.sizeGuide?.images.filter((img: string) => !newImages.includes(img)) || [];

        data.sizeGuide = {
          description: data.sizeGuide,
          images: newImages.filter((img) => !deletedImages.includes(img)),
        };
        data._deletedSizeGuideImages = deletedImages;
      } else {
        data.sizeGuide = {
          description: data.sizeGuide,
          images: newImages,
        };
      }
    }

    // Discount
    if (!data.showDiscount) {
      data = removeEmptyValues(data, ["showDiscount", "discountType", "discountValue", "discountPrice"]);
    } else {
      data.hasDiscount = true;
      if (data.discountPrice && data.sellingPrice && data.sellingPrice > 0) {
        if (data.discountType === "percentage") {
          data.discountValue = Number((((data.sellingPrice - data.discountPrice) / data.sellingPrice) * 100).toFixed(2));
        } else {
          data.discountValue = Number((data.sellingPrice - data.discountPrice).toFixed(2));
        }
      }
    }

    // Video Links
    if (!data.videoLinks || (Array.isArray(data.videoLinks) && data.videoLinks.length <= 0)) {
      data = removeEmptyValues(data, ["videoLinks"]);
    }

    // Color-wise images
    const showColorWiseImages = data.variants?.some((v: any) => v.showColorWiseImages);

    if (showColorWiseImages && uploadMultipleColorImageCredentials.length > 0) {
      const colorAttrValue = attributes.find((attr) => attr.label.toLowerCase().startsWith("col"))?.value;

      const colorWiseImages: string[] | undefined = variants?.find(
        (variant: any) => variant.attributeName === colorAttrValue
      )?.attributeValue;

      data.colorWiseImages = data.variants
        .find((variant: any) => variant.showColorWiseImages)
        ?.attributeValue.map((_: any, index: number) => ({
          color: colorWiseImages?.[index] ?? "",
          image: uploadMultipleColorImageCredentials?.[index]?.publicUrl,
        }));
    }

    // Variations
    if (mode === "in-house") {
      if (!data.showVariation) {
        data = removeEmptyValues(data, ["variants", "variantCombinations"]);
      } else {
        data.variants = data.variantCombinations;
        data = removeEmptyValues(data, ["variantCombinations"]);
      }
    } else {
      data = removeEmptyValues(data, ["variants", "variantCombinations"]);
    }

    // Damage Product
    if (isDamaged) data.isDamaged = true;

    return data;
  };

  // Submit Handler
  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    const t = Toast.loading({
      title: "Status",
      description:
        mode === "in-house"
          ? isEditMode
            ? `Updating the product...`
            : `Creating the product...`
          : isEditMode
            ? "Updating the combo offer..."
            : "Creating the combo offer...",
    });

    try {
      // const payload = prepareProductData(data);
      // if (Array.isArray(payload.variants) && payload.variants.length > 0) {
      //   const skuList = payload.variants.map((v: any) => v.sku?.trim()).filter(Boolean); // remove empty/null

      //   const uniqueSkuSet = new Set(skuList);

      //   if (skuList.length !== uniqueSkuSet.size) {
      //     Toast.warning({
      //       title: "Duplicate SKU",
      //       description: "All variant SKUs must be unique!",
      //     });

      //     Toast.remove(t);
      //     setIsLoading(false);
      //     return;
      //   }
      // }
      const payload = prepareProductData(data);

      // ✅ Recompute variant discount fields from actual variantPrice at submit time
      if (Array.isArray(payload.variants)) {
        if (payload.showDiscount && payload.discountType && payload.discountValue > 0) {
          payload.variants = payload.variants.map((variant: any) => {
            // const base = variant.variantPrice || 0;
            // let dp: number;

            // if (payload.discountType === "percentage") {
            //   dp = Number((base - (base * payload.discountValue) / 100).toFixed(2));
            // } else {
            //   dp = Number((base - payload.discountValue).toFixed(2));
            // }

            // dp = Math.max(0, dp);

            // const { discountPrice, discountType, discountValue, ...rest } = variant;
            // return dp < base
            //   ? { ...rest, discountPrice: dp, discountType: payload.discountType, discountValue: payload.discountValue }
            //   : rest;
            const base = variant.variantPrice || 0;
            const dp = variant.discountPrice != null ? Number(variant.discountPrice) : null;

            const { discountPrice: _dp, discountType: _dt, discountValue: _dv, ...rest } = variant;

            if (dp != null && dp > 0 && dp < base) {
              let computedDiscountValue: number;

              if (payload.discountType === "percentage") {
                computedDiscountValue = Number((((base - dp) / base) * 100).toFixed(2));
              } else {
                // flat
                computedDiscountValue = Number((base - dp).toFixed(2));
              }

              return {
                ...rest,
                discountPrice: dp,
                discountType: payload.discountType,
                discountValue: computedDiscountValue, // ✅ derived, always accurate
              };
            }

            return rest; // no discount
          });
        } else {
          // Strip any leftover discount fields
          payload.variants = payload.variants.map(({ discountPrice, discountType, discountValue, ...rest }: any) => rest);
        }
      }
      let res;

      if (payload.variants && payload.variants.length > 0) {
        const stockQuantity = payload?.variants?.reduce((acc: number, variant: any) => acc + variant.stock, 0);

        if (isEditMode && stockQuantity < payload.stockQuantity) {
          Toast.warning({
            title: "Warning",
            description: "To decrease stock, go to Manage Stock!",
          });
          Toast.remove(t);
          setIsLoading(false);
          return;
        } else {
          payload.stockQuantity = stockQuantity;
        }
      }
      if (isEditMode && !payload.sizeGuide) {
        payload.sizeGuide = null;
      }

      if (isEditMode && !payload.variants && product?.stockQuantity > payload?.stockQuantity) {
        Toast.warning({
          title: "Warning",
          description: "To decrease stock, go to Manage Stock!",
        });
        Toast.remove(t);
        setIsLoading(false);
        return;
      }

      if (payload.showVariation && Array.isArray(payload.variants) && payload.variants.length <= 0) {
        Toast.warning({ title: "Warning", description: "Attributes name & value in variation is required!" });
        Toast.remove(t);
        setIsLoading(false);
        return;
      }

      if (payload.showVariation && Array.isArray(payload.variants) && payload.variants.length > 0) {
        const variantPrice = payload?.variants?.some((variant: any) => variant.variantPrice <= 0);

        if (variantPrice) {
          Toast.warning({
            title: "Warning",
            description: "Variant price must be greater than 0!",
          });
          Toast.remove(t);
          setIsLoading(false);
          return;
        }

        if (payload.discountType === "flat") {
          const falseDiscountPrice = payload?.variants?.some((variant: any) => variant.variantPrice <= variant.discountPrice);

          if (falseDiscountPrice) {
            Toast.warning({
              title: "Warning",
              description: "Discount price must be less than variant price!",
            });
            Toast.remove(t);
            setIsLoading(false);
            return;
          }
        }
      }

      if (isEditMode && !data.showBenefit) payload.benefit = null;
      if (!isEditMode) payload.slug = generateSlug(payload.name);

      if (isEditMode) {
        if (mode === "in-house") {
          res = await updateInHouseProduct(product._id, payload);
          // console.log(res, "response after update");
          // console.log(payload, "updated data");
        } else {
          res = await updateComboOffer(product._id, payload);
        }
      } else {
        if (mode === "in-house") {
          res = await createInHouseProduct(payload);
        } else {
          res = await createComboOffer(payload);
        }
      }

      if (res?.data?.status == true) {
        Toast.success({
          title: "Success",
          description:
            mode === "in-house"
              ? isEditMode
                ? "Product updated successfully!"
                : "Product created successfully!"
              : isEditMode
                ? "Combo offer updated successfully!"
                : "Combo offer created successfully!",
        });

        router.push(
          mode === "in-house"
            ? isDamaged
              ? routes.privateRoutes.admin.productManagement.damageProduct.home
              : routes.privateRoutes.admin.productManagement.inHouseProduct.home
            : routes.privateRoutes.admin.productManagement.comboOffer.home
        );
        // router.back();
      } else {
        Toast.error({
          title: "Error",
          description: res?.data?.message || (res as any)?.error || "Something went wrong while creating product!",
        });
      }

      setIsLoading(false);
      Toast.remove(t);
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || (error as any)?.error || "Failed to product operation!" });
    }
  };
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="relative flex h-[calc(100vh-250px)] flex-col">
        {/* Product Basic Information */}
        <div className="relative z-10 max-w-full flex-1 space-y-6 overflow-y-auto">
          <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
            <div className="grid grid-cols-1 gap-5 pb-5 md:grid-cols-12">
              <div className="col-span-12 md:col-span-4">
                <CardHeader>
                  <CardTitle>Product Thumbnail</CardTitle>
                </CardHeader>
                <CardContent className="flex h-full items-center justify-center">
                  <SingleImageUpload
                    setIsUploading={setIsUploading}
                    fallbackText={initials}
                    existingImage={product?.thumbnail}
                    name="thumbnail"
                    avatarSize="h-42 w-42"
                    folderName="product-in-house"
                    uploadImageCredentials={uploadImageCredentials}
                    setUploadImageCredentials={setUploadImageCredentials}
                    description="Hint: Circular Shape Image |"
                    accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
                  />
                </CardContent>
              </div>
              <div className="col-span-12 md:col-span-8">
                <CardHeader>
                  <CardTitle>General Setup</CardTitle>
                </CardHeader>
                <CardContent className="mt-4 space-y-4">
                  <InputField name="name" label="Name" placeholder="Enter product name" type="text" required />

                  {mode === "in-house" && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <InputField name="category" label="Category" type="select" options={categories} required />

                      <InputField
                        key={subCategory}
                        name="subCategory"
                        label="Subcategory"
                        type="select"
                        options={subCategories || []}
                        disabled={!subCategories}
                        tooltipContent={
                          !category
                            ? "Please select a category first!"
                            : category && subCategories === null
                              ? "No subcategories found!"
                              : ""
                        }
                        required={subCategories?.length || 0 > 0 ? true : false}
                      />

                      <InputField name="brand" label="Brand" type="select" options={brands} required />
                    </div>
                  )}

                  <div className={`grid grid-cols-1 gap-4 ${mode === "in-house" ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
                    {mode === "in-house" && (
                      <InputField
                        name="unit"
                        label="Unit"
                        type="select"
                        options={[
                          { label: "pc", value: "pc" },
                          { label: "kg", value: "kg" },
                          { label: "liter", value: "liter" },
                        ]}
                        required
                      />
                    )}

                    <InputField
                      name="sku"
                      label="Product SKU"
                      placeholder="Enter product SKU"
                      tooltipContent="Stock Keeping Unit (SKU) | Auto Generate by Name"
                      type="text"
                      required={true}
                      disabled={editSkuDisabled}
                      suffixIcon={editSkuDisabled ? <GrEdit /> : <PiReadCvLogo className="text-xl" />}
                      suffixTooltipContent={editSkuDisabled ? "Editable" : "Read Only"}
                      onSuffixClick={() => setEditSkuDisabled(!editSkuDisabled)}
                    />
                  </div>

                  <TagInput name="searchTags" label="Product Search Tags" placeholder="Type and press enter to add new tag" />
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Product Description */}
          <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <InputField name="description" label="Full Description" required={true} type="rich-text" />
            </CardContent>
          </Card>

          {/* Additional Product Images or Videos */}
          <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
            <CardHeader>
              <CardTitle>Additional Product Images or Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <InputField
                setIsImageUploading={setIsUploading}
                tooltipContent="Only 10 images are allowed!"
                type="image-multiple"
                label="Images"
                maxNum={10}
                name="images"
                //   placeholder="Only .jpg, .png, .webp files allowed. Size : Max 5 MB Ratio 1:1 (500 x 500 px)"
                folderName="product-in-house"
                uploadMultipleImageCredentials={uploadMultipleImageCredentials}
                setUploadMultipleImageCredentials={setUploadMultipleImageCredentials}
              />
            </CardContent>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <InputField
                  type="text"
                  tooltipContent="Only youtube video link allowed!"
                  label="Youtube Video Link"
                  name="snapshotLink"
                  placeholder="Enter product video link"
                  suffixIcon={<FiPlusCircle className="text-xl" />}
                  suffixTooltipContent="Add Video"
                  onSuffixClick={async () => {
                    const snapshotLink = form.getValues("snapshotLink");
                    if (!snapshotLink || snapshotLink.trim() === "") {
                      Toast.warning({ title: "Warning", description: "Please enter a product video link!" });
                      return;
                    }
                    const isValid = await form.trigger("snapshotLink");
                    if (!isValid) return;
                    await handleScrapeVideoTitle();
                    form.setValue("snapshotLink", "");
                    form.clearErrors("snapshotLink");
                  }}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-12">
                {form?.getValues("videoLinks").map((videoLink, index) => (
                  <div className="col-span-4" key={index}>
                    <div className="relative flex min-w-0 gap-4 rounded-md border bg-gray-200 p-2">
                      <img src={videoLink?.thumbnail ?? "#"} alt="Thumbnail" className="h-20 w-32 shrink-0 object-cover" />
                      <div className="flex flex-col gap-2">
                        <p className="line-clamp-2 min-w-0 text-sm font-medium break-all">{videoLink.title}</p>
                        <p className="text-muted-foreground line-clamp-2 min-w-0 text-xs font-medium break-all">{videoLink.url}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeVideoLink(index)}
                        className="bg-primary absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg transition-colors hover:bg-red-600"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Benefits */}
          <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
            <CardHeader>
              <CardTitle>Product Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-3">
                <FormSwitch
                  name="showBenefit"
                  label="Add Product Benefit?"
                  description="Do you want to show the benefits in product details page?"
                />

                {showBenefit && <InputField name="benefit" label="Benefit" type="select" options={benefits} required />}
              </div>
            </CardContent>
          </Card>

          {/* Product Pricing */}
          <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Product Pricing</CardTitle>
              {isEditMode && mode === "in-house" && (
                <Link href={routes.privateRoutes.admin.productManagement.inHouseProduct?.showVariants(product?._id || "")}>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 capitalize">
                    <Package className="h-4 w-4" /> Manage Stock
                  </Button>
                </Link>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-3">
                <InputField
                  prefixIcon={<TbCoinTaka className="text-xl" />}
                  name="sellingPrice"
                  label="Selling Price (BDT)"
                  placeholder="Enter selling price"
                  type="number"
                  required
                />

                <InputField
                  prefixIcon={<TbCoinTaka className="text-xl" />}
                  name="buyingPrice"
                  label="Buying Price (BDT)"
                  placeholder="Enter buying price"
                  type="number"
                  required
                />

                <InputField
                  prefixIcon={<AiOutlineHome className="text-xl" />}
                  name="stockQuantity"
                  label="Stock Quantity"
                  placeholder="Enter stock quantity"
                  type="number"
                  allowDecimal={false}
                  required
                  disabled={isEditMode && showVariation}
                  tooltipContent={isEditMode && showVariation ? "Stock quantity is auto-calculated from total variation stock!" : ""}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Discount */}
          <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
            <CardHeader>
              <CardTitle>Product Discount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-3">
                <FormSwitch
                  name="showDiscount"
                  label="Enable Product Discount?"
                  description="Do you want to add a discount to this product?"
                />

                {showDiscount && (
                  <>
                    <InputField
                      prefixIcon={
                        discountType === "percentage" ? <RiDiscountPercentLine className="text-xl" /> : <TbCoinTaka className="text-xl" />
                      }
                      name="discountType"
                      label="Discount Type"
                      type="select"
                      options={DISCOUNT_OPTIONS}
                      required
                    />

                    <InputField
                      prefixIcon={
                        discountType === "percentage" ? <RiDiscountPercentLine className="text-xl" /> : <TbCoinTaka className="text-xl" />
                      }
                      name="discountValue"
                      label="Discount Value"
                      placeholder="Enter discount value"
                      type="number"
                      required
                      tooltipContent={discountType === "percentage" ? "Discount value can't exceed 90%" : ""}
                    />

                    <InputField
                      prefixIcon={<TbCoinTaka className="text-xl" />}
                      name="discountPrice"
                      label="Discount Price"
                      placeholder="Enter discount price"
                      type="number"
                      required={true}
                      // disabled={editDiscountPriceDisabled}
                      disabled={true}
                      // suffixIcon={editDiscountPriceDisabled ? <GrEdit /> : <PiReadCvLogo className="text-xl" />}
                      // suffixTooltipContent={editDiscountPriceDisabled ? "Editable" : "Read Only"}
                      // onSuffixClick={() => setEditDiscountPriceDisabled(!editDiscountPriceDisabled)}
                      // tooltipContent="Automatically deducted from selling price"
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Size Guide */}
          <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
            <CardHeader>
              <CardTitle>Size Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-3">
                <div className="col-span-3 md:col-span-1">
                  <FormSwitch
                    name="showSizeGuide"
                    label="Enable Size Guide?"
                    description="Do you want to add a size guide to this product?"
                  />
                </div>

                {showSizeGuide && (
                  <>
                    <div className="col-span-3 md:col-span-3">
                      <InputField
                        setIsImageUploading={setIsUploading}
                        type="image-multiple"
                        label="Size Guide Images"
                        name="sizeGuideImages"
                        maxNum={5}
                        //   placeholder="Only .jpg, .png, .webp files allowed. Size : Max 5 MB Ratio 1:1 (500 x 500 px)"
                        tooltipContent="Only 5 images are allowed!"
                        folderName="product-in-house-size-guide"
                        uploadMultipleImageCredentials={uploadMultipleSizeGuideImageCredentials}
                        setUploadMultipleImageCredentials={setUploadMultipleSizeGuideImageCredentials}
                      />
                      <div className="mt-5">
                        <InputField name="sizeGuide" label="Size Guide Description" type="rich-text" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Add Product Variation */}
          {mode === "in-house" && (
            <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
              <CardHeader>
                <CardTitle>Add Product Variation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-3">
                  <FormSwitch
                    disabled={isEditMode}
                    name="showVariation"
                    label="Enable Product Variation?"
                    description="Do you want to add a product variation to this product? You can only add 3 variations!"
                    tooltipContent={isEditMode ? `You can't ${showVariation ? "disable" : "enable"} variation after adding it!` : ""}
                  />
                </div>

                {showVariation &&
                  form?.getValues("variants")?.map((variant, index) => {
                    const selectedAttributeNames = form?.getValues("variants")?.map((v) => v.attributeName);
                    const attributeValues = attributes.find((attr: any) => attr.value === variant.attributeName)?.relatedValues || [];
                    const attributeLabel = attributes.find((attr: any) => attr.value === variant.attributeName)?.label;
                    const colorAttrValue = attributes.find((attr) => attr.label.toLowerCase().startsWith("col"))?.value;
                    const colorWiseImages = form
                      ?.getValues("variants")
                      ?.find((attr) => attr.attributeName === colorAttrValue)?.attributeValue;

                    const activeAttributes = attributes.map((attr) => {
                      if (selectedAttributeNames?.includes(attr.value)) {
                        return { ...attr, disabled: true };
                      }
                      return attr;
                    });

                    return (
                      <div key={index} className="relative mt-4 grid grid-cols-1 items-center gap-5 md:grid-cols-2">
                        <div className="relative col-span-2 md:col-span-1">
                          <InputField
                            name={`variants.${index}.attributeName`}
                            label="Attribute Name"
                            type="select"
                            options={activeAttributes}
                            selectTriggerClassName="pl-10"
                          />

                          <div className="absolute top-[31px] left-[10px]">
                            <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full text-center text-white">
                              {index + 1}
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                          <InputField
                            name={`variants.${index}.attributeValue`}
                            label="Attribute Value"
                            type="react-select-multi"
                            options={attributeValues}
                            tooltipContent={variant.attributeName === "" ? "Please select attribute name first!" : ""}
                            disabled={variant.attributeName === ""}
                          />
                        </div>

                        {attributeLabel && attributeLabel.toLowerCase().startsWith("col") && (
                          <FormSwitch
                            prefixIcon={<PiImageLight className="text-xl" />}
                            name={`variants.${index}.showColorWiseImages`}
                            label="Enable Product Color-Wise Images?"
                          />
                        )}

                        {attributeLabel &&
                          attributeLabel.toLowerCase().startsWith("col") &&
                          variant.showColorWiseImages &&
                          variantCombinations && (
                            <div className="col-span-2">
                              <InputField
                                tooltipContent={`Only ${colorWiseImages?.length || 0} images are allowed!`}
                                type="colorWiseImage"
                                label="Product Color-wise Images"
                                maxNum={colorWiseImages?.length || 0}
                                name={`variants.${index}.images`}
                                placeholder="Only .jpg, .png, .webp files allowed. Size : Max 5 MB Ratio 1:1 (500 x 500 px)"
                                colors={variant.attributeValue}
                                folderName="in-house-product-color-wise-images"
                                uploadMultipleImageCredentials={uploadMultipleColorImageCredentials}
                                setUploadMultipleImageCredentials={setUploadMultipleColorImageCredentials}
                              />
                            </div>
                          )}

                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="bg-primary absolute top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg transition-colors hover:bg-red-600"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        )}

                        {index < 2 ? (
                          <div className="border-light-gray col-span-2 border-t border-dotted dark:border-white/10"></div>
                        ) : null}
                      </div>
                    );
                  })}

                {showVariation && variants && variants.length < 3 && (
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendVariant({
                          attributeName: "",
                          attributeValue: [],
                          variantPrice: 0,
                          sku: "",
                          stock: 0,
                          showColorWiseImages: false,
                          images: [],
                        })
                      }
                    >
                      <FiPlusCircle className="mr-2 h-4 w-4" />
                      Add Variant
                    </Button>
                    <div className="border-light-gray w-full border-t-2 border-dashed dark:border-white/10"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Product Variant Wise Price, SKU & Stock Setup */}
          {mode === "in-house" && showVariation && (
            <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Product Variant Wise Price, SKU & Stock Setup {variantCombinations && `(Total: ${variantCombinations.length})`}
                  {isEditMode && (
                    <Link href={routes.privateRoutes.admin.productManagement.inHouseProduct?.showVariants(product?._id || "")}>
                      <Button variant="outline" size="sm" className="flex items-center gap-2 capitalize">
                        <Package className="h-4 w-4" /> Manage Stock
                      </Button>
                    </Link>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Table>
                    <TableHeader className="bg-light-gray dark:bg-white/10 dark:text-black">
                      <TableRow>
                        <TableHead className="w-[100px] font-semibold text-white dark:text-black">SL</TableHead>
                        <TableHead className="font-semibold text-white dark:text-black">Attribute Variant</TableHead>
                        <TableHead className="font-semibold text-white dark:text-black">Variant Price </TableHead>
                        {showDiscount && <TableHead className="font-semibold text-white dark:text-black">Discount Price </TableHead>}
                        <TableHead className="font-semibold text-white dark:text-black">Variant SKU</TableHead>
                        <TableHead className="flex items-center gap-1 font-semibold text-white dark:text-black">Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variantCombinationsFields && variantCombinationsFields.length > 0 ? (
                        variantCombinationsFields.map((variant, index) => (
                          <TableRow key={variant.variation}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{variant.variation}</TableCell>
                            <TableCell>
                              <InputField
                                prefixIcon={<TbCoinTaka className="text-xl" />}
                                name={`variantCombinations.${index}.variantPrice`}
                                type="number"
                                required={true}
                              />
                            </TableCell>
                            {showDiscount && (
                              <TableCell>
                                <InputField
                                  prefixIcon={<TbCoinTaka className="text-xl" />}
                                  name={`variantCombinations.${index}.discountPrice`}
                                  type="number"
                                  required={true}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <InputField
                                prefixIcon={<PiBarcodeBold className="text-xl" />}
                                name={`variantCombinations.${index}.sku`}
                                type="text"
                                required={true}
                              />
                            </TableCell>
                            <TableCell>
                              <InputField
                                prefixIcon={<AiOutlineHome className="text-xl" />}
                                name={`variantCombinations.${index}.stock`}
                                type="number"
                                required={true}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No variant combinations found!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Tags */}
          <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
            <CardHeader>
              <CardTitle>Product Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormSwitch name="isFeatured" label="Featured" description="Mark as featured to highlight it across the store!" />
                <FormSwitch name="isNewArrived" label="New Arrival" description="Mark as a new arrival product!" />
                <FormSwitch name="isUpcoming" label="Upcoming" description="Indicate that this product will be available soon!" />
                <FormSwitch name="isPublished" label="Publish" description="Make this product visible to customers!" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="sticky bottom-0 z-20 border-t bg-white p-4 dark:bg-[#151515]">
          <div className="flex justify-end pb-2">{hasErrors && <ErrorStr message={"Please fill all the required fields"} />}</div>
          <div className="flex justify-between gap-4 md:justify-end">
            <Link
              href={
                mode === "in-house"
                  ? isDamaged
                    ? routes.privateRoutes.admin.productManagement.damageProduct.home
                    : routes.privateRoutes.admin.productManagement.inHouseProduct.home
                  : routes.privateRoutes.admin.productManagement.comboOffer.home
              }
            >
              <Button type="button" variant="outline" disabled={isLoading} className="max-md:px-2">
                Cancel
              </Button>
            </Link>
            <Button className="cool max-md:px-2" type="submit" disabled={isLoading || isUploading}>
              {mode === "in-house"
                ? isEditMode
                  ? isDamaged
                    ? "Update Damage Product"
                    : "Update Product"
                  : isDamaged
                    ? "Add New Damage Product"
                    : "Add New Product"
                : isEditMode
                  ? "Update Combo Offer"
                  : "Add New Combo Offer"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

interface Variant {
  attributeName: string;
  attributeValue: string[];
  showColorWiseImages?: boolean;
  images?: string[];
}

interface VariantCombination {
  attributes: {
    name: string;
    value: string;
  }[];
  variation: string; // e.g. "Red - S"
  variantPrice: number;
  discountPrice: number;
  sku: string;
  stock: number;
}

function cartesianProduct<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>((acc, curr) => acc.flatMap((combo) => curr.map((item) => [...combo, item])), [[]]);
}

export function generateVariantCombinations(
  variants: Variant[],
  attributes: { label: string; value: string; relatedValues: { label: string; value: string }[] }[],
  productSKU: string,
  productVariants?: Variant[],
  sellingPrice?: number,
  discountType?: string | undefined,
  discountValue?: number
): VariantCombination[] {
  const validVariants = variants.filter(
    (v) =>
      v?.attributeName?.trim() !== "" &&
      Array.isArray(v?.attributeValue) &&
      v.attributeValue.length > 0 &&
      v.attributeValue.some((val) => val?.trim() !== "")
  );

  if (validVariants.length === 0) return [];

  // ✅ Deduplicate values inside each attribute
  const valueArrays = validVariants.map((v) => [...new Set(v.attributeValue.filter((val) => val?.trim() !== ""))]);

  const combos = cartesianProduct(valueArrays);

  if (!productSKU) {
    Toast.warning({
      title: "Warning",
      description: "Please enter the product name for generate SKU!",
    });
    return [];
  }

  const seen = new Set<string>();

  const totalVariants: VariantCombination[] = combos
    .map((combo) => {
      // ✅ Build UNIQUE key using attributeName:value
      const variationKey = combo
        .map((value, index) => {
          const attrName = validVariants[index].attributeName;
          return `${attrName}:${value}`;
        })
        .join("|"); // use separator that won't conflict

      if (seen.has(variationKey)) return null;
      seen.add(variationKey);

      const finalPrice = sellingPrice || 0;

      // const skuPart = combo.map((val) => val.replace(/\s+/g, "").toUpperCase()).join("-");
      // if (discountType === "percentage" && discountValue) {
      //   const discountAmount = ((sellingPrice || 0) * discountValue) / 100;
      //   finalPrice = (sellingPrice || 0) - discountAmount;
      // } else if (discountType === "fixed" && discountValue) {
      //   finalPrice = (sellingPrice || 0) - discountValue;
      // }

      // if (finalPrice < 0) finalPrice = 0;

      // return {
      //   attributes: combo.map((value, variantIndex) => {
      //     const attrName = attributes.find((attr) => attr.value === validVariants[variantIndex].attributeName)?.label ?? "";

      //     return {
      //       name: attrName,
      //       value: value,
      //     };
      //   }),

      //   // ✅ Human-readable variation (optional change)
      //   variation: combo.join("-"),

      //   sku: `${productSKU}-${skuPart}`,

      //   variantPrice: sellingPrice || 0,
      //   discountPrice: finalPrice,
      //   stock: 0,
      // };
      let skuPart = combo.map((val) => val.replace(/\s+/g, "").toUpperCase()).join("-");

      let generatedSKU = `${productSKU}-${skuPart}`;
      if (generatedSKU.length > 50) {
        const excessLength = generatedSKU.length - 50;
        skuPart = skuPart.slice(0, skuPart.length - excessLength);
        generatedSKU = `${productSKU}-${skuPart}`;
      }

      return {
        attributes: combo.map((value, variantIndex) => {
          const attrName = attributes.find((attr) => attr.value === validVariants[variantIndex].attributeName)?.label ?? "";
          return {
            name: attrName,
            value: value,
          };
        }),

        variation: combo.join("-"),
        sku: generatedSKU,
        variantPrice: sellingPrice || 0,
        // ✅ Only include discountPrice if different from variantPrice
        ...(finalPrice !== (sellingPrice || 0) ? { discountPrice: finalPrice } : {}),
        stock: 0,
      };
    })
    .filter((v): v is VariantCombination => v !== null);

  if (productVariants) {
    return totalVariants.map((item) => {
      const matched: any = productVariants.find((v: any) => v.variation === item.variation);

      return {
        ...item,
        variantPrice: matched ? matched.variantPrice : item.variantPrice,
        discountPrice: matched ? matched.discountPrice : item.discountPrice,
        stock: matched ? matched.stock : 0,
      };
    });
  }

  return totalVariants;
}

type FormVariant = {
  attributeName: string;
  attributeValue: string[];
  showColorWiseImages: boolean;
  images: any[];
};

export function groupVariantsForForm(apiVariants: any[]): FormVariant[] {
  return Object.values(
    apiVariants.reduce<Record<string, FormVariant>>((acc, item) => {
      const name = item.attributes?.[0]?.name;
      const value = item.attributes?.[0]?.value;

      if (!name || !value) return acc;

      if (!acc[name]) {
        acc[name] = {
          attributeName: name,
          attributeValue: [],
          showColorWiseImages: false,
          images: [],
        };
      }

      acc[name].attributeValue.push(value);

      return acc;
    }, {})
  );
}

interface AttributeResult {
  attributeName: string;
  attributeValue: string[];
  variantPrice?: number;
  sku?: string;
  stock?: number;
  showColorWiseImages: boolean;
  images: string[];
}

function convertVariantsToAttributes(
  variants: any[],
  attributeOptions: any[],
  colorWiseImages: {
    color: string;
    image: string;
  }[]
): AttributeResult[] {
  const attributeMap = new Map<string, Set<string>>();

  for (const variant of variants) {
    for (const attribute of variant.attributes) {
      if (!attributeMap.has(attribute.name)) {
        attributeMap.set(attribute.name, new Set());
      }
      attributeMap.get(attribute.name)!.add(attribute.value);
    }
  }

  const attributeNames = Array.from(attributeMap.keys());
  const colorAttrValue = attributeOptions.find((attr) => attr.label.toLowerCase().startsWith("col"))?.value;

  return attributeNames.map((name) => {
    const matched = attributeOptions.find((option) => option.label === name);
    const attributeId = matched ? matched.value : name;
    const colorValues = Array.from(attributeMap.get(name)!);

    const result: AttributeResult = {
      attributeName: attributeId,
      attributeValue: colorValues,
      showColorWiseImages: colorAttrValue === attributeId && colorWiseImages?.length > 0 ? true : false,
      images:
        colorWiseImages?.length > 0 && colorWiseImages.some((item) => colorValues.includes(item.color))
          ? colorWiseImages.map((item) => item.image).filter((item) => item)
          : [],
    };

    return result;
  });
}
