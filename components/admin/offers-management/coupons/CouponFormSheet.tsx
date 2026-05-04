import { createProductAttribute, updateProductAttribute } from "@/actions/admin/product-management/product-attribute-actions";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DISCOUNT_OPTIONS } from "@/config/constant";
import { useFormSheet } from "@/context/FormSheetContext";
import { TCoupon } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

export default function CouponFormSheet({
  coupon,
  setSelectedCoupon,
}: {
  coupon: TCoupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<TCoupon | null>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, closeSheet } = useFormSheet();
  const [isEditMode, setIsEditMode] = useState<boolean>(!!coupon);

  const formSchema = z.object({
    couponType: z.string().min(1, "Coupon type is required!"),
    bearer: z.string().min(1, "Bearer is required!"),
    title: z.string().min(1, "Title is required!"),
    code: z.string().min(1, "Code is required!"),
    discountType: z.string().min(1, "Discount type is required!"),
    discountValue: z.number().min(1, "Discount value is required!"),
    limit: z.number().min(1, "Limit is required!"),
    sellerThreshold: z.number().min(1, "Seller threshold is required!"),
    startDate: z.string().min(1, "Start date is required!"),
    endDate: z.string().min(1, "End date is required!"),
    pointsRequired: z.number().min(1, "Points required is required!"),
    status: z.boolean(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      couponType: "",
      bearer: "",
      title: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
      limit: 0,
      sellerThreshold: 0,
      startDate: "",
      endDate: "",
      pointsRequired: 0,
      status: true,
    },
  });

  useEffect(() => {
    if (coupon) {
      form.reset({
        couponType: coupon.couponType,
        bearer: coupon.bearer,
        title: coupon.title,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        limit: coupon.limit,
        sellerThreshold: coupon.sellerThreshold,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        pointsRequired: coupon.pointsRequired,
        status: coupon.status,
      });
    }
  }, [coupon, form]);

  // Form Resetter
  const resetForm = () => {
    closeSheet();
    form.reset({
      couponType: "",
      bearer: "",
      title: "",
      code: "",
      discountType: "",
      discountValue: 0,
      limit: 0,
      sellerThreshold: 0,
      startDate: "",
      endDate: "",
      pointsRequired: 0,
      status: true,
    });
    setIsEditMode(false);
    setSelectedCoupon(null);
  };

  const [discountType] = useWatch({
    control: form.control,
    name: ["discountType"],
    defaultValue: {
      discountType: "percentage",
    },
  });

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

        if (coupon?._id) await updateProductAttribute(coupon._id, _updatedBrand);
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

  // const queryClient = new QueryClient();

  return (
    <Sheet open={isOpen} onOpenChange={resetForm}>
      <SheetContent className="sm:max-w-2xl dark:bg-[#18181C] dark:text-white">
        <SheetHeader className="scrollbar-none overflow-y-auto">
          <SheetTitle className="text-primary text-xl dark:text-white">{isEditMode ? "Update Coupon" : "Add New Coupon"}</SheetTitle>
          <SheetDescription>
            {isEditMode ? "Update the coupon for increasing customer engagement" : "Add a new coupon for increasing customer engagement "}
          </SheetDescription>

          {/* <QueryClientProvider client={queryClient}>
            <FormSelectExample />
          </QueryClientProvider> */}

          <FormProvider {...form}>
            <div className="mt-4">
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
                  <CardHeader>
                    <CardTitle>Coupon Information</CardTitle>
                    <CardDescription>Basic information about the coupon</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputField
                        name="couponType"
                        label="Coupon Type"
                        type="select"
                        options={[
                          { label: "Discount on Purchase", value: "discount_on_purchase" },
                          { label: "Free Delivery", value: "free_delivery" },
                          { label: "First Order", value: "first_order" },
                          { label: "Product Based", value: "product_based" },
                        ]}
                        required
                      />
                      <InputField
                        name="bearer"
                        label="Bearer"
                        type="select"
                        options={[
                          { label: "Admin", value: "admin" },
                          { label: "Vendor", value: "vendor" },
                        ]}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputField name="title" label="Title" placeholder="e.g. Eid Special" type="text" required />
                      <InputField name="code" label="Code" placeholder="e.g. EID20" type="text" required />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputField name="discountType" label="Discount Type" type="select" options={DISCOUNT_OPTIONS} required />
                      <InputField
                        name="discountValue"
                        label="Discount Value"
                        placeholder="Enter discount value"
                        type="number"
                        required
                        tooltipContent={discountType === "percentage" ? "Discount value can't exceed 90%" : ""}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputField name="limit" label="Limit" placeholder="e.g. 10" type="number" required />
                      <InputField name="sellerThreshold" label="Seller Threshold" placeholder="e.g. 1000" type="number" required />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputField name="startDate" label="Start Date" type="date" required />
                      <InputField name="endDate" label="End Date" type="date" required />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <InputField name="pointsRequired" label="Need Points" placeholder="e.g. 10" type="number" required />
                    </div>

                    <FormSwitch name="status" label="Status" description="Control coupon application status!" />
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
