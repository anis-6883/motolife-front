"use client";

import InputField from "@/components/form/InputField";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getAllDistricts, getThanasByDistrict } from "@/lib/address-helpers";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

export function CheckoutPaymentMethod() {
  const {
    control,
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  // const selectedValue = watch("paymentMethod");
  // const paymentMethods = [
  //   { title: "Cash on Delivery", value: "cash" },
  //   { title: "Mobile Banking", value: "mb" },
  // ];
  const billing = watch("billingAddress");
  const billingAddressTypeAry = [
    {
      title: "Same as shipping address",
      value: "same",
    },
    {
      title: "Use a different billing address",
      value: "different",
    },
  ];
  const [districtId, setDistrictId] = useState<number | null>(null);
  const districts = getAllDistricts();

  useEffect(() => {
    if (billing !== "different") setDistrictId(null);
  }, [billing]);

  useEffect(() => {
    if (billing !== "different") {
      setValue("billing", {});
      clearErrors("billing");
    }
  }, [billing, setValue, clearErrors]);
  useEffect(() => {
    if (billing == "different") {
      setValue("billing", {
        fullName: "",
        phone: "",
        district: "",
        thana: "",
        address: "",
      });
    }
  }, [billing]);
  return (
    <>
      <div className="space-y-1 rounded-lg border p-2 md:space-y-6 md:p-5">
        {/* <h3 className="p-text-28 font-medium">Payment</h3>
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <RadioGroup value={field.value} onValueChange={field.onChange}>
              {paymentMethods.map((method) => {
                return (
                  <div
                    key={method.value}
                    className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-4 ${
                      selectedValue === method.value ? "border-primary" : ""
                    }`}
                  >
                    <RadioGroupItem value={method.value} id={method.value} />
                    <Label htmlFor={method.value} className="flex flex-1 cursor-pointer items-center justify-between">
                      <span className="font-semibold">{method.title}</span>
                      {method.value === "mb" ? (
                        <div className="relative aspect-166/24 h-6 w-40 max-md:hidden">
                          <ImageWithFallback
                            fallbackSrc="/images/sample-data-images/mobileBanking.png"
                            alt="Mobile Banking icon"
                            src="/images/sample-data-images/mobileBanking.png"
                            fill
                          />
                        </div>
                      ) : null}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          )}
        /> */}

        <div className="space-y-2 md:space-y-6">
          <h3 className="p-text-28 font-medium">Billing Address</h3>
          <Controller
            name="billingAddress"
            control={control}
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="md:space-y-4">
                {billingAddressTypeAry.map((v) => (
                  <label
                    key={v.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border p-2 md:p-4",
                      field.value === v.value ? "border-primary text-primary" : "border-gray-300"
                    )}
                  >
                    <RadioGroupItem value={v.value} className="peer" />
                    <span className="ml-2 capitalize">{v.title}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />

          {billing === "different" && (
            <div className="space-y-1 rounded-lg border p-2 md:space-y-4 md:p-4">
              <h4 className="text-sm font-medium max-md:hidden md:text-lg md:font-semibold">Billing Details</h4>
              <InputField name="billing.fullName" required label="Full Name" placeholder="Enter full name" type="text" />
              <InputField name="billing.phone" required label="Phone" placeholder="Enter phone" type="phone" maxLength={10} />
              {/* <div className="grid gap-1 md:grid-cols-2 md:gap-4">
                <div className="space-y-1 md:space-y-3">
                  <Label>Full Name</Label>
                  <input {...register("billing.fullName")} placeholder="Enter full name" className="w-full rounded-md border p-2 md:h-11" />
                  {(errors.billing as any)?.fullName && (
                    <p className="text-sm text-red-500">{(errors.billing as any)?.fullName.message as string}</p>
                  )}
                </div>

                <div className="space-y-1 md:space-y-3">
                  <Label>Phone</Label>
                  <input {...register("billing.phone")} placeholder="Enter phone" className="w-full rounded-md border p-2 md:h-11" />
                  {(errors.billing as any)?.phone && (
                    <p className="text-sm text-red-500">{(errors.billing as any)?.phone.message as string}</p>
                  )}
                </div> */}

              {/* <div className="space-y-1 md:space-y-3">
                  <Label>Email</Label>
                  <input {...register("billing.email")} placeholder="Enter email" className="w-full rounded-md border p-2 md:h-11" />
                  {(errors.billing as any)?.email && (
                    <p className="text-sm text-red-500">{(errors.billing as any)?.email.message as string}</p>
                  )}
                </div> */}

              {/* <div className="space-y-1 md:space-y-3">
                  <InputField required name="billing.area" label="Area" placeholder="Area" type="text" />
                </div> */}
              {/* </div> */}

              {/* District + Thana */}
              <div className="grid gap-1 md:grid-cols-2 md:gap-4">
                <InputField
                  required
                  name="billing.district"
                  label="District"
                  type="select"
                  options={districts.map((district) => ({
                    value: district.name,
                    label: district.name,
                  }))}
                  cb={(value) => {
                    const selectedDistrict = districts.find((d) => d.name === value);
                    if (selectedDistrict) {
                      setDistrictId(selectedDistrict._id);
                      setValue("billing.thana", ""); // reset thana when district changes
                    }
                  }}
                />

                <InputField
                  required
                  name="billing.thana"
                  label="Thana"
                  type="select"
                  options={
                    districtId
                      ? getThanasByDistrict(districtId).map((thana) => ({
                          value: thana.name,
                          label: thana.name,
                        }))
                      : []
                  }
                />
              </div>
              <div className="space-y-1 md:space-y-3">
                <Label>Address</Label>
                <Textarea {...register("billing.address")} placeholder="Enter address" className="w-full border p-2 md:h-11" />
                {(errors.billing as any)?.address && (
                  <p className="text-sm text-red-500">{(errors.billing as any)?.address.message as string}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-1 max-md:pt-2 md:space-y-3">
        <Label htmlFor="note" className="p-text-18 block">
          Order Note <span className="p-text-12 text-[#777]">(optional)</span>
        </Label>
        <Textarea id="note" {...register("orderNote")} placeholder="Special note for delivery." className="border-gray-300 md:min-h-32" />
      </div>
    </>
  );
}
