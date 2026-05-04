"use client";

import { updateGeneralSettings } from "@/actions/admin/settings-action";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { GeneralSettingsFormValues, generalSettingsSchema } from "./schemas";

// ---------------------- Component ----------------------
interface GeneralSettingsFormProps {
  defaultValues?: Partial<GeneralSettingsFormValues>;
}

export default function GeneralSettingsForm({ defaultValues = {} }: GeneralSettingsFormProps) {
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isFavIconUploading, setIsFavIconUploading] = useState(false);
  const [isOGImageUploading, setIsOGImageUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      tagline: defaultValues.tagline || "",
      logo: defaultValues.logo || "",
      favIcon: defaultValues.favIcon || "",
      openGraphImage: defaultValues.openGraphImage || "",
      openGraphTitle: defaultValues.openGraphTitle || "",
      openGraphDescription: defaultValues.openGraphDescription || "",
    },
  });

  const logoInitials = useWatch({ control: form.control, name: "tagline", defaultValue: "Logo" })
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const favIconInitials = useWatch({ control: form.control, name: "tagline", defaultValue: "Favicon" })
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const ogImageInitials = useWatch({ control: form.control, name: "openGraphTitle", defaultValue: "OG" })
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSubmit = async (data: GeneralSettingsFormValues) => {
    setIsLoading(true);
    const t = Toast.loading({ title: "Status", description: "Saving general settings..." });

    try {
      await updateGeneralSettings(data);
      setIsLoading(false);
      Toast.remove(t);
      Toast.success({ title: "Success", description: "General settings updated successfully!" });
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to update general settings" });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Identity</CardTitle>
            <CardDescription>Basic brand identity and website appearance settings.</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <InputField name="tagline" label="Tagline" type="text" required placeholder="Enter site tagline" className="md:col-span-2" />

            <SingleImageUpload
              variant="dropzone"
              setIsUploading={setIsLogoUploading}
              fallbackText={logoInitials || "Logo"}
              existingImage={form.getValues("logo")}
              name="logo"
              label="Logo Image"
              folderName="general-settings/logo"
              setUploadImageCredentials={(cred) => form.setValue("logo", cred.publicUrl)}
              uploadImageCredentials={{ fileKey: "", publicUrl: form.getValues("logo") }}
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
            />

            <SingleImageUpload
              variant="dropzone"
              setIsUploading={setIsFavIconUploading}
              fallbackText={favIconInitials || "Favicon"}
              existingImage={form.getValues("favIcon")}
              name="favIcon"
              label="Favicon Image"
              folderName="general-settings/favicon"
              setUploadImageCredentials={(cred) => form.setValue("favIcon", cred.publicUrl)}
              uploadImageCredentials={{ fileKey: "", publicUrl: form.getValues("favIcon") }}
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Social Sharing</CardTitle>
            <CardDescription>Social sharing settings.</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <SingleImageUpload
              variant="dropzone"
              setIsUploading={setIsOGImageUploading}
              fallbackText={ogImageInitials || "OG"}
              existingImage={form.getValues("openGraphImage")}
              name="openGraphImage"
              label="Open Graph Image"
              folderName="general-settings/og-image"
              setUploadImageCredentials={(cred) => form.setValue("openGraphImage", cred.publicUrl)}
              uploadImageCredentials={{ fileKey: "", publicUrl: form.getValues("openGraphImage")! }}
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
            />

            <div className="space-y-6">
              <InputField name="openGraphTitle" label="Open Graph Title" type="text" placeholder="Enter Open Graph title" />
              <InputField
                name="openGraphDescription"
                label="Open Graph Description"
                type="textarea"
                placeholder="Enter Open Graph description"
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading || isLogoUploading || isFavIconUploading || isOGImageUploading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
