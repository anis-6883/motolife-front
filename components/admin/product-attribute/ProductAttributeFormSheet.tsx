import { createProductAttribute, updateProductAttribute } from "@/actions/admin/product-management/product-attribute-actions";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import TagInput from "@/components/form/TagInput";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useFormSheet } from "@/context/FormSheetContext";
import { Attribute } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

export default function ProductAttributeFormSheet({
  attribute,
  setSelectedAttribute,
}: {
  attribute: Attribute | null;
  setSelectedAttribute: Dispatch<SetStateAction<Attribute | null>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, closeSheet } = useFormSheet();
  const [isEditMode, setIsEditMode] = useState<boolean>(!!attribute);

  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(2, "Attribute name must be at least 2 characters")
      .max(50, "Attribute name must be less than 50 characters"),
    // .regex(/^[a-zA-Z0-9\s&-]+$/, "Only letters, numbers, spaces, &, and - are allowed"),
    values: z.array(z.string()).min(1, "Attribute values are required!"),
    status: z.boolean(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      values: [],
      status: true,
    },
  });

  useEffect(() => {
    if (attribute) {
      form.reset({
        name: attribute.name,
        status: attribute.status,
        values: attribute.values,
      });
    }
  }, [attribute, form]);

  // Form Resetter
  const resetForm = () => {
    closeSheet();
    form.reset({
      name: "",
      values: [],
      status: true,
    });
    setIsEditMode(false);
    setSelectedAttribute(null);
  };

  // Submit Handler
  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: isEditMode ? "Updating the attribute..." : "Creating the attribute...",
    });

    try {
      if (isEditMode) {
        const _updatedBrand: any = {
          ...data,
        };

        if (attribute?._id) await updateProductAttribute(attribute._id, _updatedBrand);
        setIsLoading(false);
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Attribute updated successfully!" });
        resetForm();
      } else {
        await createProductAttribute(data);
        setIsLoading(false);
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Attribute created successfully!" });
        resetForm();
      }
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to attribute operation!" });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={resetForm}>
      <SheetContent className="sm:max-w-lg dark:bg-[#18181C] dark:text-white">
        <SheetHeader className="scrollbar-none overflow-y-auto">
          <SheetTitle className="text-primary text-xl dark:text-white">
            {isEditMode ? "Update Product Attribute" : "Add New Product Attribute"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update the product attribute for better user experience"
              : "Add a new product attribute for creating new variation 🎊"}
          </SheetDescription>

          <FormProvider {...form}>
            <div className="mt-4">
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
                  <CardHeader>
                    <CardTitle>Attribute Information</CardTitle>
                    <CardDescription>Basic information about the attribute</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <InputField name="name" label="Name" placeholder="Enter attribute name" type="text" required />
                    <TagInput name="values" label="Values" placeholder="Enter attribute values" />
                    <FormSwitch name="status" label="Visibility" description="Control attribute visibility!" />
                  </CardContent>
                </Card>

                <div className="mt-5 flex justify-between gap-4 md:justify-end">
                  <Button onClick={closeSheet} type="button" variant="outline" disabled={isLoading} className="max-md:px-2">
                    Cancel
                  </Button>

                  <Button className="cool" type="submit" disabled={isLoading}>
                    {isEditMode ? "Update Attribute" : "Submit"}
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
