"use client";

import InputField from "@/components/form/InputField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

export function CheckoutContactSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="space-y-1 rounded-lg p-2 md:space-y-6 md:border md:p-5">
      <h2 className="p-text-28 font-medium max-md:hidden">Personal Information</h2>
      <div className="flex-1 space-y-1">
        <Label htmlFor="fullName" className="block text-sm md:text-base">
          <p className="p-text-16">Full Name</p>
        </Label>
        <Input
          id="fullName"
          {...register("fullName", { required: true })}
          placeholder="Enter your full name here"
          className="border-gray-300 [@media(min-width:1600px)]:h-11"
        />

        {errors?.fullName && <p className="text-sm text-red-500">{errors?.fullName?.message as any}</p>}
      </div>

      {/* <div className="flex-1 space-y-1">
        <Label htmlFor="phone" className="block text-sm md:text-base">
          <p className="p-text-16">Phone Number</p>
        </Label>
        <Input
          id="phone"
          {...register("phone", { required: true })}
          placeholder="+880 XXX XXXXXX"
          className="border-gray-300 [@media(min-width:1600px)]:h-11"
        />

        {errors?.phone && <p className="text-sm text-red-500">{errors?.phone?.message as any}</p>}
      </div> */}
      <InputField
        labelClassName="p-text-16 font-semibold"
        name="phone"
        label="Phone number"
        placeholder="xxxxxxxxx"
        type="phone"
        required
        maxLength={10}
      />
      {/* <div className="flex-1 space-y-1">
        <Label htmlFor="email" className="block text-sm md:text-base">
          <p className="p-text-16">Email</p>
        </Label>
        <Input
          id="email"
          {...register("email", { required: true })}
          placeholder="simran@gmail.com"
          className="border-gray-300 [@media(min-width:1600px)]:h-11"
        />

        {errors?.email && <p className="text-sm text-red-500">{errors?.email?.message as any}</p>}
      </div> */}

      {/* <Controller
        name="emailOffers"
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:border-black data-[state=checked]:bg-black"
            />
            <Label>
              <p className="p-text-18">Notify me with news and offers</p>
            </Label>
          </div>
        )}
      /> */}
    </div>
  );
}
