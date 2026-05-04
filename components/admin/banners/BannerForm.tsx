"use client";

import { createBanner, updateBanner } from "@/actions/admin/banners/banner-management-action";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useFormSheet } from "@/context/FormSheetContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { bannerFormSchema, BannerFormValues, BannerItem } from "./type";

// ─── Options ──────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────
export default function BannerForm({ banner }: { banner?: BannerItem }) {
  const isEditMode = !!banner?._id;
  const { closeSheet } = useFormSheet();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [uploadImageCredentials, setUploadImageCredentials] = useState<{
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }>({
    fileKey: "",
    publicUrl: "",
    uploaded: false,
  });

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      //   title: banner?.title || "",
      //   description: banner?.description || "",
      //   bgColor: banner?.bgColor || "",
      bannerUrl: banner?.bannerUrl || "",
      image: banner?.image || "",
    },
  });

  // watch conditional fields

  const handleSubmit = async (data: BannerFormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: isEditMode ? "Updating banner..." : "Creating banner...",
    });

    try {
      const payload = {
        type: "MAIN_SECTION_BANNER",
        resourceType: "custom",
        image: data.image,
        bannerUrl: data?.bannerUrl,
        // title: data.title,
        // description: data.description,
        // bgColor: data?.bgColor,
      };
      if (isEditMode) {
        const updateResponse: any = await updateBanner(banner._id, payload);
        if (updateResponse?.statusCode !== 200 && updateResponse?.error) {
          throw new Error(updateResponse?.error);
        }
      } else {
        const response: any = await createBanner(payload);
        if (response?.statusCode !== 201 && response?.error) {
          throw new Error(response?.error);
        }
      }

      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: isEditMode ? "Banner updated successfully!" : "Banner created successfully!",
      });

      closeSheet();
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || "Failed to save banner!",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    closeSheet();
    form.reset();
    setUploadImageCredentials({ fileKey: "", publicUrl: "", uploaded: false });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-6">
        <Card>
          <CardContent className="grid gap-6 pt-6">
            {/* Banner Type */}

            {/* Title & Description — conditional on MAIN_SECTION_BANNER */}

            {/* <InputField type="text" name="title" label="Title" placeholder="Enter Banner Title" required /> */}
            {/* <InputField type="textarea" name="description" label="Description" placeholder="Enter Banner Description" required /> */}
            {/* <ColorPickerField name="bgColor" required label="Select Bg Color" /> */}

            <InputField type="text" name="bannerUrl" label="Banner URL" placeholder="Enter URL or path (e.g., /combo-offers)" required />

            {/* Banner Image */}
            <SingleImageUpload
              setIsUploading={setIsImageUploading}
              variant="dropzone"
              fallbackText="Banner"
              existingImage={banner?.image}
              setUploadImageCredentials={setUploadImageCredentials}
              uploadImageCredentials={uploadImageCredentials}
              name="image"
              label="Banner Image"
              folderName="banners"
              disabled={isImageUploading}
              // allowedRatios={["1400:350"]}
              aspect="landscape"
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
            />
          </CardContent>
        </Card>

        {/* ── Actions ── */}
        <div className="mt-5 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading || isImageUploading}
            onClick={resetForm}
            className="rounded-full px-6"
          >
            Cancel
          </Button>
          <Button type="submit" className="cool rounded-full px-6" disabled={isLoading || isImageUploading || !form.formState.isDirty}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditMode ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
