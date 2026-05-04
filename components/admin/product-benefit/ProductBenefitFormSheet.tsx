import { createProductBenefit, updateProductBenefit } from "@/actions/admin/product-management/product-benefit-actions";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFormSheet } from "@/context/FormSheetContext";
import { ProductBenefit } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { BsTrash } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import * as z from "zod";

export default function ProductBenefitFormSheet({
  productBenefit,
  setSelectedProductBenefit,
}: {
  productBenefit: ProductBenefit | null;
  setSelectedProductBenefit: (productBenefit: ProductBenefit | null) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, closeSheet } = useFormSheet();
  const isEditMode = !!productBenefit?._id;

  const formSchema = z.object({
    title: z.string().trim().min(2, "Title must be at least 2 characters").max(50, "Title must be less than 50 characters"),
    // .regex(/^[a-zA-Z0-9\s&-]+$/, "Only letters, numbers, spaces, &, and - are allowed"),
    benefits: z
      .array(
        z.object({
          heading: z.string().trim().min(2, "Heading must be at least 2 characters").max(100, "Heading must be less than 100 characters"),
          // .regex(/^[a-zA-Z0-9\s&-]+$/, "Only letters, numbers, spaces, &, and - are allowed"),
          text: z.string().trim().min(2, "Text must be at least 2 characters").max(200, "Text must be less than 200 characters"),
          // .regex(/^[a-zA-Z0-9\s&-]+$/, "Only letters, numbers, spaces, &, and - are allowed"),
        })
      )
      .min(1, "At least one benefit is required!"),
    status: z.boolean(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      benefits: [
        {
          heading: "",
          text: "",
        },
      ],
      status: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "benefits",
  });

  useEffect(() => {
    if (isOpen && isEditMode && productBenefit) {
      form.reset({
        title: productBenefit.title,
        benefits: productBenefit.benefits,
        status: productBenefit.status,
      });
    } else {
      form.reset({
        title: "",
        benefits: [
          {
            heading: "",
            text: "",
          },
        ],
        status: true,
      });
    }
  }, [isOpen, form, productBenefit, setSelectedProductBenefit, isEditMode]);

  // Form Resetter
  const resetForm = () => {
    form.reset({
      title: "",
      benefits: [
        {
          heading: "",
          text: "",
        },
      ],
      status: true,
    });
    closeSheet();
    setSelectedProductBenefit(null);
  };

  // Submit Handler
  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: isEditMode ? "Updating the benefit..." : "Creating the benefit...",
    });

    try {
      if (isEditMode) {
        console.log({ data });

        if (productBenefit?._id) await updateProductBenefit(productBenefit._id, data);
        setIsLoading(false);
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Benefit updated successfully!" });
        resetForm();
      } else {
        await createProductBenefit(data);
        setIsLoading(false);
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Benefit created successfully!" });
        resetForm();
      }
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to benefit operation!" });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={resetForm}>
      <SheetContent className="sm:max-w-lg dark:bg-[#18181C] dark:text-white">
        <SheetHeader className="scrollbar-none overflow-y-auto">
          <SheetTitle className="text-primary text-xl dark:text-white">
            {isEditMode ? "Update Product Benefit" : "Add New Product Benefit"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode ? "Update your product benefits to enhance sales 📈" : "Maintain your product benefits to enhance sales 📈"}
          </SheetDescription>

          <div className="scrollbar-none overflow-y-auto">
            <FormProvider {...form}>
              <div className="mt-4">
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
                    <CardHeader>
                      <CardTitle>Benefit Information</CardTitle>
                      <CardDescription>Basic information about the benefit</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <InputField name="title" label="Title" placeholder="Enter benefit title" type="text" required />

                      {fields.map((field, index) => (
                        <Card key={field.id} className="shadow-none dark:border-white/10 dark:bg-[#151515] dark:text-white">
                          <CardContent className="space-y-4">
                            <div className="mb-4 flex items-center justify-between">
                              <Badge className="rounded-full font-bold text-white ring-1">Benefit: {index + 1}</Badge>

                              {fields.length > 1 && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="border-primary rounded-full"
                                      size="icon"
                                      onClick={() => remove(index)}
                                    >
                                      <BsTrash className="text-primary text-2xl dark:text-white" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-primary [&_svg]:bg-primary [&_svg]:fill-primary text-white">
                                    <p>Delete</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>

                            <InputField
                              name={`benefits.${index}.heading`}
                              label="Heading"
                              placeholder="Enter benefit heading"
                              type="text"
                              required
                            />
                            <InputField
                              name={`benefits.${index}.text`}
                              label="Text"
                              placeholder="Enter benefit text"
                              type="text"
                              required
                            />
                          </CardContent>
                        </Card>
                      ))}

                      {fields.length > 0 && (
                        <div className="mt-5 flex justify-end">
                          <Button type="button" variant="outline" onClick={() => append({ heading: "", text: "" })}>
                            <FiPlus className="mr-2 h-4 w-4" />
                            Add More Benefits
                          </Button>
                        </div>
                      )}

                      <FormSwitch name="status" label="Visibility" description="Control benefit visibility!" />
                    </CardContent>
                  </Card>

                  <div className="mt-5 flex justify-between gap-4 md:justify-end">
                    <Button onClick={closeSheet} type="button" variant="outline" disabled={isLoading} className="max-md:px-2">
                      Cancel
                    </Button>

                    <Button className="cool" type="submit" disabled={isLoading}>
                      {isEditMode ? "Update Benefit" : "Submit"}
                    </Button>
                  </div>
                </form>
              </div>
            </FormProvider>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
