import { createBrand, updateBrand } from "@/actions/admin/product-management/brand-actions";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useFormSheet } from "@/context/FormSheetContext";
import { Brand } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

export default function ProductBrandFormSheet({
  brand,
  setSelectedBrand,
}: {
  brand: Brand | null;
  setSelectedBrand: Dispatch<SetStateAction<Brand | null>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, closeSheet } = useFormSheet();
  const [uploadImageCredentials, setUploadImageCredentials] = useState<{
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }>({
    fileKey: "",
    publicUrl: "",
    uploaded: false,
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(!!brand);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);

  const formSchema = z.object({
    name: z.string().trim().min(2, "Brand name must be at least 2 characters").max(50, "Brand name must be less than 50 characters"),
    // .regex(/^[a-zA-Z0-9\s&-]+$/, "Only letters, numbers, spaces, &, and - are allowed"),
    status: z.boolean(),
    image: z.string(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: true,
      image: "",
    },
  });

  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        status: brand.status,
        image: brand.image,
      });
    }
  }, [brand, form]);

  // Form Resetter
  const resetForm = () => {
    closeSheet();
    form.reset({
      name: "",
      status: true,
      image: "",
    });
    setUploadImageCredentials({
      fileKey: "",
      publicUrl: "",
      uploaded: false,
    });
    setIsEditMode(false);
    setSelectedBrand(null);
  };

  // Submit Handler
  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: isEditMode ? "Updating the category..." : "Creating the category...",
    });

    try {
      if (isEditMode) {
        const _updatedBrand: any = {
          ...data,
        };

        if (uploadImageCredentials.uploaded) {
          _updatedBrand.image = uploadImageCredentials.publicUrl;
          _updatedBrand._uploaded = true;
        }

        if (brand?._id) await updateBrand(brand._id, _updatedBrand);
        setIsLoading(false);
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Brand updated successfully!" });
        resetForm();
      } else {
        if (uploadImageCredentials.uploaded) {
          data.image = uploadImageCredentials.publicUrl;
        }
        await createBrand(data);
        setIsLoading(false);
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Brand created successfully!" });
        resetForm();
      }
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to category operation!" });
    }
  };

  const initials =
    useWatch({
      control: form.control,
      name: "name",
      defaultValue: "",
    })
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Logo";

  return (
    <Sheet open={isOpen} onOpenChange={resetForm}>
      <SheetContent className="sm:max-w-lg dark:bg-[#18181C] dark:text-white">
        <SheetHeader>
          <SheetTitle className="text-primary text-xl dark:text-white">
            {isEditMode ? "Update Product Brand" : "Add New Product Brand"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update the product brand for better user experience"
              : "Add a new product brand for creating new trustworthiness 💯"}
          </SheetDescription>

          <FormProvider {...form}>
            <div className="mt-4">
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
                  <CardHeader>
                    <CardTitle>Brand Information</CardTitle>
                    <CardDescription>Basic information about the brand</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SingleImageUpload
                      setIsUploading={setIsImageUploading}
                      fallbackText={initials}
                      existingImage={brand?.image}
                      name="image"
                      label="Logo"
                      avatarSize="h-42 w-42"
                      folderName="product-brand"
                      uploadImageCredentials={uploadImageCredentials}
                      setUploadImageCredentials={setUploadImageCredentials}
                      description="Hint: Circular Shape Image |"
                      accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
                    />
                    <InputField name="name" label="Name" placeholder="Enter brand name" type="text" required />
                    <FormSwitch name="status" label="Visibility" description="Control brand visibility!" />
                  </CardContent>
                </Card>

                <div className="mt-5 flex justify-between gap-4 md:justify-end">
                  <Button
                    onClick={closeSheet}
                    type="button"
                    variant="outline"
                    disabled={isLoading || isImageUploading}
                    className="max-md:px-2"
                  >
                    Cancel
                  </Button>

                  <Button className="cool" type="submit" disabled={isLoading || isImageUploading}>
                    {isEditMode ? "Update Brand" : "Submit"}
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
