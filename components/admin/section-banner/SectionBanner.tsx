"use client";

import { createOrUpdate } from "@/actions/admin/section-banner/section-banner";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

export interface BannerRecord {
  _id?: string;
  url?: string;
  image?: string | null;
  status?: boolean;
  createdAt?: string;
  title?: string;
  description?: string;
}

const formSchema = z.object({
  url: z.string().optional(),
  image: z.string().nonempty("Image is required"),
  status: z.boolean().optional(),
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  existingBanner?: BannerRecord | null;
}

export default function ComboBannerUpload({ existingBanner }: Props) {
  const [bannerId, setBannerId] = useState<string | undefined>(existingBanner?._id);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [displayImage, setDisplayImage] = useState<string | undefined>(existingBanner?.image ?? undefined);

  const [imageCredentials, setImageCredentials] = useState<{
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }>({
    fileKey: "",
    publicUrl: existingBanner?.image ?? "",
    uploaded: false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: existingBanner?.url ?? "",
      image: existingBanner?.image ?? "",
      status: existingBanner?.status ?? true,
      title: existingBanner?.title ?? "",
      description: existingBanner?.description ?? "",
    },
  });

  const isEditMode = !!bannerId;

  const resetForm = () => {
    form.reset({
      url: "",
      image: "",
      status: true,
      title: "",
      description: "",
    });
    setImageCredentials({
      fileKey: "",
      publicUrl: "",
      uploaded: false,
    });
    setDisplayImage(undefined);
  };

  const handleSubmit = async (data: FormValues) => {
    if (!data.url?.trim() && !data.image) {
      Toast.error({ title: "Validation", description: "Please enter a URL or upload an image." });
      return;
    }

    if (isUploading) {
      Toast.error({ title: "Please wait", description: "Image is still uploading..." });
      return;
    }

    setIsLoading(true);
    const t = Toast.loading({
      title: "Status",
      description: isEditMode ? "Updating banner..." : "Creating banner...",
    });

    try {
      const payload = {
        ...(bannerId && { id: bannerId }),
        url: data.url ?? "",
        image: data.image ?? "",
        status: data.status ?? true,
        title: data.title,
        description: data.description,
      };

      const res = (await createOrUpdate(payload)) as any;
      if (res?.error) throw new Error(res?.error);

      if (res?.data?._id) setBannerId(res.data._id);

      Toast.remove(t);
      Toast.success({
        title: isEditMode ? "Updated" : "Created",
        description: isEditMode ? "Banner updated successfully!" : "Banner created successfully!",
      });
    } catch (err: any) {
      Toast.remove(t);
      Toast.error({ title: "Failed", description: err?.message || "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <InputField name="title" label="Title" required={true} type="rich-text" editorHeight="50" />
            <InputField name="description" label="Description" required={true} type="rich-text" editorHeight="100" />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormSwitch name="status" label="Visibility" description="Control combo offer banner visibility!" />
              <InputField name="url" label="Banner URL" type="text" placeholder="Input URL" className="max-w-xl flex-1" />
              {/* <InputField name="status" label="Status" type="switch" className="pb-1" /> */}
            </div>

            {/* Banner Image */}
            <SingleImageUpload
              name="image"
              label="Banner Image"
              variant="dropzone"
              folderName="combo-offer-banners"
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
              maxSizeMB={1}
              // allowedRatios={["4:3"]}
              aspect="portrait"
              existingImage={displayImage}
              uploadImageCredentials={imageCredentials}
              setUploadImageCredentials={setImageCredentials}
              setIsUploading={setIsUploading}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading || isUploading}>
                Reset
              </Button>
              <Button type="submit" disabled={isLoading || isUploading}>
                {isUploading ? "Uploading..." : isLoading ? (isEditMode ? "Updating..." : "Adding...") : isEditMode ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
