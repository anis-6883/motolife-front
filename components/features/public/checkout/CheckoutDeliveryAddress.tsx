"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import InputField from "@/components/form/InputField";
import { getAllDistricts, getThanasByDistrict } from "@/lib/address-helpers";
import { ShippingSettings } from "@/lib/types";
import { insideDhaka, nearDhaka } from "../products/constants";

export function CheckoutDeliveryAddress({ shippingSettings }: { shippingSettings: ShippingSettings }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [districtId, setDistrictId] = useState<number | null>(null);
  const districts = getAllDistricts();

  const getZoneFromDistrict = (district: string) => {
    if (insideDhaka.includes(district)) return "inside_dhaka";
    if (nearDhaka.includes(district)) return "near_dhaka";
    return "outside_dhaka";
  };

  const getCostFromZone = (zone: string) => {
    return shippingSettings?.shipping?.shippingCosts?.find((item) => item.zone === zone)?.cost;
  };

  const handleDistrictChange = (value: string) => {
    const selectedDistrict = districts.find((d) => d.name === value);
    if (selectedDistrict) {
      setDistrictId(selectedDistrict._id);
      setValue("thana", "");
    }

    const zone = getZoneFromDistrict(value);
    const cost = getCostFromZone(zone);
    if (cost) {
      setValue("deliveryType", cost.toString());
    }
  };

  return (
    <div className="space-y-2 rounded-lg p-2 md:space-y-6 md:border md:p-5">
      <h3 className="p-text-28 font-medium max-md:hidden">Delivery Address</h3>

      {/* Address */}
      <div className="space-y-2">
        <Label>Address</Label>
        <Textarea {...register("address")} placeholder="Detail full address (house, road, block etc)" className="border-gray-300" />
        {errors?.address && <p className="text-sm text-red-500">{errors.address.message as string}</p>}
      </div>

      {/* District + Thana */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
        <InputField
          required
          name="district"
          label="District"
          type="input-with-search"
          options={districts.map((d) => ({ value: d.name, label: d.name }))}
          cb={handleDistrictChange}
        />

        <InputField
          required
          name="thana"
          label="Thana"
          type="input-with-search"
          options={districtId ? getThanasByDistrict(districtId).map((t) => ({ value: t.name, label: t.name })) : []}
        />
      </div>

      {/* Delivery charge — hidden, auto-set from district */}
      <div className="hidden">
        <input type="hidden" {...register("deliveryType")} />
      </div>
    </div>
  );
}
