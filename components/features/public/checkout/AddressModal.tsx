"use client";

import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAllDistricts, getThanasByDistrict } from "@/lib/address-helpers";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Home, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { AddressFormValues, addressSchema } from "./schema";

interface AddressModalProps {
  trigger: React.ReactNode;
  onSubmitAddress: (data: AddressFormValues) => void;
  mode?: "add" | "edit";
  defaultValues?: Partial<AddressFormValues>;
}

const EMPTY_VALUES: AddressFormValues = {
  title: "Home",
  address: "",
  district: "",
  thana: "",
};

const ADDRESS_TYPES = [
  { value: "Home", label: "Home", icon: Home },
  { value: "Office", label: "Office", icon: Briefcase },
];

export function AddressModal({ trigger, onSubmitAddress, mode = "add", defaultValues }: AddressModalProps) {
  const [open, setOpen] = useState(false);
  const [districtId, setDistrictId] = useState<number | null>(null);

  const methods = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: EMPTY_VALUES,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset({ ...EMPTY_VALUES, ...defaultValues });
      const district = getAllDistricts().find((d) => d.name === defaultValues.district);
      if (district) setDistrictId(district._id);
    } else {
      reset(EMPTY_VALUES);
      setDistrictId(null);
    }
  }, [mode, defaultValues, reset]);

  const districts = getAllDistricts();

  const onSubmit = (data: AddressFormValues) => {
    onSubmitAddress(data);
    setOpen(false);
    reset(EMPTY_VALUES);
    setDistrictId(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="gap-0 rounded-2xl p-0 sm:max-w-lg [&>button:first-of-type]:hidden">
        {/* Header */}
        <div className="border-border flex items-start justify-between border-b p-3 md:p-6">
          <div>
            <DialogTitle className="text-foreground text-base font-semibold">
              {mode === "edit" ? "Edit address" : "Add new address"}
            </DialogTitle>
            <p className="text-muted-foreground mt-0.5 text-sm">Fill in the details below</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              handleSubmit(onSubmit)(e);
            }}
            className="p-3 md:p-6"
          >
            <div className="space-y-2 md:space-y-5">
              {/* Address Type */}
              <div className="space-y-2">
                <label className="text-muted-foreground text-sm font-medium">Address type</label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-3">
                      {ADDRESS_TYPES.map(({ value, label, icon: Icon }) => {
                        const isActive = field.value === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => field.onChange(value)}
                            className={cn(
                              "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-150",
                              isActive
                                ? "border-primary bg-primary text-white"
                                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
              </div>

              <div className="border-border border-t" />

              {/* Full Address */}
              <InputField name="address" label="Full address" placeholder="House no., road, area..." type="text" required />

              {/* District + Thana */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  name="district"
                  label="District"
                  type="input-with-search"
                  options={districts.map((d) => ({ value: d.name, label: d.name }))}
                  cb={(value) => {
                    const selected = districts.find((d) => d.name === value);
                    if (selected) {
                      setDistrictId(selected._id);
                      setValue("thana", "");
                    }
                  }}
                  required
                />
                <InputField
                  name="thana"
                  label="Thana"
                  type="input-with-search"
                  options={districtId ? getThanasByDistrict(districtId).map((t) => ({ value: t.name, label: t.name })) : []}
                  required
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-border mt-6 flex justify-end gap-3 border-t pt-5">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button type="submit" className="bg-black px-8 text-white hover:bg-black/90">
                Save address
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
