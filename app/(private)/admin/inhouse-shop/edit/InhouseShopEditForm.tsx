"use client";

import { updateInHouseShop } from "@/actions/admin/inhouse-shop/inhouse-shop-actions";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import routes from "@/config/routes";
import { onError } from "@/lib/client-utils";
import { InhouseShopData } from "@/types/shop";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { ShopFormValues, shopSchema } from "../schema";

interface ImageCredentials {
  fileKey: string;
  publicUrl: string;
  uploaded?: boolean;
}

const emptyCredentials = (): ImageCredentials => ({
  fileKey: "",
  publicUrl: "",
  uploaded: false,
});

function toFormValues(data: InhouseShopData): ShopFormValues {
  return {
    // store
    storeName: data.store.storeName,
    logoImage: data.store.logoImage,
    coverImage: data.store.coverImage,
    // businessSettings
    isAvailable: data.businessSettings.isAvailable,
    // isOnVacation: data.businessSettings.isOnVacation,
    vacationNote: data.businessSettings.vacationNote,
    vacationDuration: data.businessSettings.vacationDuration,
    minOrderAmount: data.businessSettings.minOrderAmount,
  };
}

function toApiPayload(values: ShopFormValues, logoCredentials: ImageCredentials, coverCredentials: ImageCredentials) {
  return {
    store: {
      storeName: values.storeName,
      logoImage: logoCredentials.uploaded ? logoCredentials.publicUrl : values.logoImage,
      coverImage: coverCredentials.uploaded ? coverCredentials.publicUrl : values.coverImage,
    },
  };
}

const Skeleton = ({ h = 40, r = 8 }: { h?: number; r?: number }) => (
  <div
    style={{
      width: "100%",
      height: h,
      borderRadius: r,
      background: "linear-gradient(90deg,#f0f0f0 25%,#e6e6e6 50%,#f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }}
  />
);

interface Props {
  initialData: InhouseShopData | null;
}

export default function EditShopInformation({ initialData }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoCredentials, setLogoCredentials] = useState<ImageCredentials>(emptyCredentials());
  const [coverCredentials, setCoverCredentials] = useState<ImageCredentials>(emptyCredentials());
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
    defaultValues: initialData
      ? toFormValues(initialData)
      : {
          storeName: "",
          logoImage: "",
          coverImage: "",
          isAvailable: true,
          // isOnVacation: false,
          vacationNote: "",
          vacationDuration: "",
          minOrderAmount: 0,
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(toFormValues(initialData));
    }
  }, [initialData, form]);

  const handleSubmit: SubmitHandler<ShopFormValues> = async (values) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Updating shop information...",
    });

    try {
      const payload = toApiPayload(values, logoCredentials, coverCredentials);
      await updateInHouseShop(payload);

      setIsLoading(false);
      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: "Shop information updated successfully!",
      });

      setLogoCredentials(emptyCredentials());
      setCoverCredentials(emptyCredentials());

      router.push(routes.privateRoutes.admin.inhouseShop);
    } catch (error: unknown) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error instanceof Error ? error.message : "Failed to update shop information.",
      });
    }
  };

  const initials =
    useWatch({ control: form.control, name: "storeName", defaultValue: "" })
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "BD";

  const isBusy = isLoading || isLogoUploading || isCoverUploading;
  const isDataMissing = !initialData;

  return (
    <>
      <div>
        {/* ── Info alert ── */}
        {/* <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5">
          <InfoIcon />

          <p className="text-[12.5px] leading-[1.7] text-amber-800">
            After changes all information make sure you click <strong>Save button</strong>. This setup is not related to or will not
            overwrite the business information.
          </p>
        </div> */}

        {/* {isDataMissing && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 px-5 text-sm text-red-600">
            ⚠️ Could not load shop data. Please refresh the page.
          </div>
        )} */}

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, onError)} noValidate>
            <Card className="p-4">
              {isDataMissing ? (
                <>
                  <Skeleton h={40} />
                  <div style={{ display: "flex", gap: 20 }}>
                    <Skeleton h={184} r={10} />
                    <Skeleton h={184} r={10} />
                  </div>
                </>
              ) : (
                <>
                  <InputField name="storeName" label="Store Name" placeholder="Enter store name" type="text" required disabled={isBusy} />

                  {/* Images */}
                  <div className="grid gap-6 md:col-span-3 md:grid-cols-2">
                    <SingleImageUpload
                      name="logoImage"
                      variant="avatar"
                      label="Company Logo"
                      description={`Initials: ${initials}`}
                      folderName="shop-logo"
                      existingImage={initialData?.store?.logoImage}
                      fallbackText={initials}
                      uploadImageCredentials={logoCredentials}
                      setUploadImageCredentials={setLogoCredentials}
                      setIsUploading={setIsLogoUploading}
                      disabled={isBusy}
                      accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
                      avatarSize="h-42 w-42"
                    />

                    <SingleImageUpload
                      name="coverImage"
                      variant="dropzone"
                      label="Cover Image"
                      description="Hint: 16:9 wide banner"
                      folderName="shop-cover"
                      existingImage={form.getValues("coverImage") || undefined}
                      fallbackText="Cover"
                      uploadImageCredentials={coverCredentials}
                      setUploadImageCredentials={setCoverCredentials}
                      setIsUploading={setIsCoverUploading}
                      disabled={isBusy}
                      accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
                    />
                  </div>
                </>
              )}
            </Card>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <Link href={routes.privateRoutes.admin.inhouseShop}>
                <Button type="button" variant="outline" disabled={isBusy}>
                  Cancel
                </Button>
              </Link>

              <Button type="submit" disabled={isBusy || isDataMissing}>
                Update Shop
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
