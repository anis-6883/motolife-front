"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import InputField from "@/components/form/InputField";
import { X } from "lucide-react";
import { PaymentFormData, paymentSchema } from "./schema";

type AddPaymentModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: PaymentFormData) => void;
};

export function AddPaymentModal({ open, setOpen, onSubmit }: AddPaymentModalProps) {
  const methods = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      type: "bankAcc",
      cardNumber: "",
      cardHolderName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const handleSubmit = (data: PaymentFormData) => {
    onSubmit(data);
    setOpen(false);
    methods.reset({
      type: "bankAcc",
      cardNumber: "",
      cardHolderName: "",
      expiryDate: "",
      cvv: "",
    });
  };
  const handleTypeChange = (value: "bankAcc" | "bkash") => {
    if (value === "bankAcc") {
      methods.reset({
        type: "bankAcc",
        cardNumber: "",
        cardHolderName: "",
        expiryDate: "",
        cvv: "",
      });
    } else {
      methods.reset({
        type: "bkash",
        mobileNumber: "",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md xl:max-w-2xl [&>button:first-of-type]:hidden">
        <div className="relative">
          {" "}
          <button onClick={() => setOpen(!open)} className="absolute top-0 right-0 z-10 flex-shrink-0">
            <X className="size-6" />
          </button>
          <DialogHeader className="relative z-0">
            <DialogTitle>
              <p className="p-text-24 font-semibold -tracking-[0.24px]">My Payment Method</p>
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Payment Type */}
              <Controller
                name="type"
                control={methods.control}
                render={({ field }) => (
                  <div className="space-y-1">
                    <Label>Choose an option</Label>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleTypeChange(val as any);
                      }}
                    >
                      <SelectTrigger className="w-full 2xl:h-12!">
                        <SelectValue placeholder="Select payment type " />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="2xl:h-12!" value="bankAcc">
                          Bank Card
                        </SelectItem>
                        <SelectItem className="2xl:h-12!" value="bkash">
                          Bkash
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              {/* Render fields based on type */}
              <Controller
                name="type"
                control={methods.control}
                render={({ field }) => {
                  const paymentType = field.value as "bankAcc" | "bkash";
                  return (
                    <>
                      {paymentType === "bankAcc" && (
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            inputClassName=" 2xl:h-12!"
                            name="cardNumber"
                            label="Card Number"
                            type="number"
                            placeholder="XXXX XXXX XXXX XXXX"
                            required
                            maxLength={16}
                          />
                          <InputField
                            inputClassName=" 2xl:h-12!"
                            name="cardHolderName"
                            label="Card Holder Name"
                            type="text"
                            required
                            placeholder="Nima"
                            maxLength={30}
                          />
                          <InputField
                            inputClassName=" 2xl:h-12!"
                            name="expiryDate"
                            label="Expiry Date"
                            type="date"
                            required
                            placeholder="01/01/2020"
                          />
                          <InputField inputClassName=" 2xl:h-12!" name="cvv" label="CVV" type="password" required maxLength={4} />
                        </div>
                      )}

                      {paymentType === "bkash" && (
                        <InputField name="mobileNumber" label="Bkash Mobile Number" type="phone" maxLength={10} />
                      )}
                    </>
                  );
                }}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline-black" onClick={() => setOpen(false)} className="px-8">
                  Cancel
                </Button>

                <Button type="submit" className="bg-black px-10 text-white hover:bg-black/90">
                  SAVE
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
