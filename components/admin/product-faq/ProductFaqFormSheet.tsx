import { getInHouseProducts } from "@/actions/admin/product-management/in-house-product-actions";
import { createProductFaq, updateProductFaq } from "@/actions/admin/product-management/product-faq-actions";
import AsyncSelectField from "@/components/form/AsynSelectFiled";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useFormSheet } from "@/context/FormSheetContext";
import { ProductFAQ } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

export default function ProductFaqFormSheet({
  productFAQ,
  setSelectedProductFAQ,
}: {
  productFAQ: ProductFAQ | null;
  setSelectedProductFAQ: Dispatch<SetStateAction<ProductFAQ | null>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, closeSheet } = useFormSheet();
  const [isEditMode, setIsEditMode] = useState<boolean>(!!productFAQ);

  const formSchema = z.object({
    question: z.string().min(1, "Question is required!"),
    answer: z.string().min(1, "Answer is required!"),
    customerName: z.string().min(1, "Customer Name is required!"),
    customerEmail: z.string().optional(),
    product: z.string().min(1, "Product is required!"),
    status: z.boolean(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: productFAQ?.question || "",
      answer: productFAQ?.answer ?? "",
      status: productFAQ?.status || true,
      customerName: productFAQ?.customerName || "",
      customerEmail: productFAQ?.customerEmail ?? "",
      product: productFAQ?.product?.name || "",
    },
  });

  useEffect(() => {
    if (productFAQ) {
      form.reset({
        question: productFAQ.question,
        answer: productFAQ.answer ?? "",
        status: productFAQ.status,
        customerName: productFAQ.customerName,
        customerEmail: productFAQ.customerEmail ?? "",
        product: productFAQ.product?.name,
      });
    }
  }, [productFAQ, form]);

  // Form Resetter
  const resetForm = () => {
    closeSheet();
    form.reset({
      question: "",
      answer: "",
      status: true,
      customerName: "",
      customerEmail: "",
      product: "",
    });
    setIsEditMode(false);
    setSelectedProductFAQ(null);
  };

  // Build loadOptions for product async select
  const loadSkuOptions = async (search: string, page: number) => {
    const filters: Record<string, any> = {
      page,
      limit: 10,
      isDamaged: false,
      productId: productFAQ?.product?._id,
    };

    if (search) filters.search = search;
    const res: any = await getInHouseProducts(filters);

    const options =
      res?.data?.data?.docs?.map((doc: any) => ({
        value: doc._id,
        label: doc.name,
      })) ?? [];

    return {
      options,
      hasMore: res?.data?.pagination?.hasNextPage ?? false,
    };
  };

  // Submit Handler
  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: isEditMode ? "Updating the product FAQ..." : "Creating the product FAQ...",
    });

    try {
      if (isEditMode) {
        const _updatedBrand: any = {
          ...data,
        };

        if (productFAQ?.product?.name === data.product) {
          _updatedBrand.product = productFAQ?.product?._id;
        }

        if (productFAQ?._id) await updateProductFaq(productFAQ._id, _updatedBrand);
        setIsLoading(false);
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Product FAQ updated successfully!" });
        resetForm();
      } else {
        await createProductFaq(data);
        setIsLoading(false);
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Product FAQ created successfully!" });
        resetForm();
      }
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to product FAQ operation!" });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={resetForm}>
      <SheetContent className="sm:max-w-2xl dark:bg-[#18181C] dark:text-white">
        <SheetHeader className="scrollbar-none overflow-y-auto">
          <SheetTitle className="text-primary text-xl dark:text-white">
            {isEditMode ? "Reply Product Question" : "Add New Product Question"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode ? "Reply the product question for better user experience" : "Add a new product question for better user experience"}
          </SheetDescription>

          <div>
            <FormProvider {...form}>
              <div className="mt-4">
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
                    {productFAQ && (
                      <CardHeader>
                        <div>
                          {productFAQ?.product?.thumbnail && (
                            <div className="relative flex w-full max-w-2xl flex-col items-center justify-center overflow-hidden text-center text-gray-600 md:aspect-16/5">
                              <img
                                src={productFAQ?.product?.thumbnail}
                                alt={productFAQ?.product?.name}
                                className="h-full rounded object-contain"
                              />
                            </div>
                          )}

                          <div className="bg-primary mt-4 space-y-1 rounded-lg p-4 text-white">
                            <p className="text-sm">
                              <span className="font-semibold">Customer Name:</span> {productFAQ?.customerName}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">Customer Email:</span> {productFAQ?.customerEmail ?? "N/A"}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">Product Name:</span> {productFAQ?.product?.name}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">Date:</span> {moment(productFAQ?.createdAt).format("MMM DD, YYYY")}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                    )}

                    <CardHeader>
                      <CardTitle>Reply Product Question</CardTitle>
                      <CardDescription>Basic information about the product question</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                          disabled={isEditMode}
                          name="customerName"
                          label="Customer Name"
                          placeholder="e.g. John Doe"
                          type="text"
                          required
                        />
                        <InputField
                          disabled={isEditMode}
                          name="customerEmail"
                          label="Customer Email"
                          placeholder="e.g. john@email.com"
                          type="email"
                          required
                        />
                      </div>

                      <AsyncSelectField
                        label="Product"
                        name="product"
                        placeholder="Select Product"
                        required
                        loadOptions={loadSkuOptions}
                        searchPlaceholder="Didn't find your product? Search here..."
                        hideAllOptionsLoaded
                      />
                      <InputField name="question" label="Question" placeholder="e.g. What is the return policy?" type="textarea" required />
                      <InputField name="answer" label="Answer" placeholder="Write your answer..." type="textarea" required />

                      <FormSwitch name="status" label="Visibility" description="Control product FAQ visibility!" />
                    </CardContent>
                  </Card>

                  <div className="mt-5 flex justify-between gap-4 md:justify-end">
                    <Button onClick={closeSheet} type="button" variant="outline" disabled={isLoading} className="max-md:px-2">
                      Cancel
                    </Button>

                    <Button className="cool" type="submit" disabled={isLoading}>
                      Submit
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
