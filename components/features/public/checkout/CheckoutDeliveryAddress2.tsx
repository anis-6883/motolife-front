"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomerAddress, ShippingSettings } from "@/lib/types";
import { MapPin, PlusCircle } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { AddressModal } from "./AddressModal";
import { AddressFormValues } from "./schema";

import { addCustomerAddress, updateCustomerAddress } from "@/actions/customer/profile-actions";
import Toast from "@/components/shared/Toast";
import { getAllDistricts } from "@/lib/address-helpers";
import { deleteCookie, getCookie, setCookie } from "cookies-next/client";
import { useEffect, useState } from "react";
import { insideDhaka, nearDhaka } from "../products/constants";

import { ErrorStr } from "@/components/form/InputField";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CheckoutDeliveryAddress2({
  addresses,
  shippingSettings,
}: {
  addresses: CustomerAddress[];
  shippingSettings: ShippingSettings;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const deliveryType = watch("deliveryType");
  const addressType = watch("addressType");

  const [addressesList, setAddressesList] = useState<CustomerAddress[]>(addresses);
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [changeModalOpen, setChangeModalOpen] = useState(false);

  useEffect(() => {
    setAddressesList(addresses);
  }, [addresses]);

  const districts = getAllDistricts();

  const getZoneFromDistrict = (district: string) => {
    if (insideDhaka.includes(district)) return "inside_dhaka";
    if (nearDhaka.includes(district)) return "near_dhaka";
    return "outside_dhaka";
  };

  const getCostFromZone = (zone: string) => {
    return shippingSettings?.shipping?.shippingCosts?.find((item) => item.zone === zone)?.cost;
  };

  const handleSelectAddress = (address: CustomerAddress) => {
    setValue("address", address.address);
    setValue("district", address.district);
    setValue("thana", address.thana);
    // setValue("area", address.area);
    setValue("addressType", address._id);

    setSelectedAddress(address);

    setCookie("selected_address_id", address._id, {
      maxAge: 60 * 60 * 24 * 7,
    });

    const selectedDistrict = districts.find((d) => d.name === address.district);

    const zone = getZoneFromDistrict(address.district);
    const cost = getCostFromZone(zone);
    if (cost) {
      setValue("deliveryType", cost.toString());
    }
  };

  useEffect(() => {
    if (!addresses?.length) return;

    const savedId = getCookie("selected_address_id") as string | undefined;
    let initialAddress = addresses[0];

    if (savedId) {
      const found = addresses.find((a) => a._id === savedId);
      if (found) {
        initialAddress = found;
      } else {
        deleteCookie("selected_address_id");
      }
    }

    handleSelectAddress(initialAddress);
  }, [addresses]);

  const handleAddAddress = async (data: AddressFormValues) => {
    const res = await addCustomerAddress(data);
    if ((res as any).error && (res as any).statusCode !== 200) {
      Toast.error((res as any).error);
      return;
    }
    const newAddress = (res as any).data || { ...data, _id: Date.now().toString() };
    const updatedList: CustomerAddress[] = newAddress.data;
    setAddressesList(updatedList);

    // Auto-select the newly added address (last in list)
    // This is needed because the useEffect that auto-selects watches the `addresses` prop,
    // not the `addressesList` state, so it won't fire after a state-only update.
    if (updatedList?.length > 0) {
      handleSelectAddress(updatedList[updatedList.length - 1]);
    }
  };

  const handleEditAddress = async (id: string, data: AddressFormValues) => {
    const res = await updateCustomerAddress(id, data);
    if ((res as any).error && (res as any).statusCode !== 200) {
      Toast.error((res as any).error);
      return;
    }
    const updatedAddresses = (res as any).data || [];
    setAddressesList(updatedAddresses.data);
    if (selectedAddress?._id === id) {
      const updated = updatedAddresses.data.find((a: CustomerAddress) => a._id === id);
      if (updated) handleSelectAddress(updated);
    }
  };
  return (
    <div className="space-y-1 rounded-lg p-2 md:space-y-6 md:border md:p-5">
      <h3 className="p-text-28 font-medium">Delivery Address</h3>

      {addressesList?.length > 0 ? (
        <>
          {/* Selected address display */}
          {selectedAddress && (
            <div className="border-primary flex items-center justify-between rounded-lg border p-1 md:items-start md:p-4">
              <div className="flex gap-3">
                <MapPin className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="p-text-18 font-semibold">{selectedAddress.title}</p>
                  <p className="p-text-14 text-[#777]">
                    {selectedAddress.address}, {selectedAddress.thana}, {selectedAddress.district}
                    {selectedAddress.zipCode && ` - ${selectedAddress.zipCode}`}
                  </p>
                </div>
              </div>

              {/* Change address modal */}
              <Dialog open={changeModalOpen} onOpenChange={setChangeModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-blue-dark shrink-0 hover:no-underline">
                    Change
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] p-0 md:max-w-lg">
                  <div className="flex max-h-[80vh] flex-col">
                    {/* ✅ Header (fixed) */}
                    <DialogHeader className="border-b px-5 py-4">
                      <DialogTitle className="p-text-20">Select Delivery Address</DialogTitle>
                    </DialogHeader>

                    {/* ✅ Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                      <Controller
                        name="addressType"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value ?? ""}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const picked = addressesList.find((a) => a._id === value);
                              if (picked) {
                                handleSelectAddress(picked);
                                setChangeModalOpen(false);
                              }
                            }}
                            className="space-y-2"
                          >
                            {addressesList.map((addr) => (
                              <div
                                key={addr._id}
                                className={`flex items-start gap-3 rounded-lg border p-3 ${
                                  addressType === addr._id ? "border-primary" : ""
                                }`}
                              >
                                <RadioGroupItem value={addr._id} id={`modal-${addr._id}`} />

                                <Label htmlFor={`modal-${addr._id}`} className="flex flex-1 cursor-pointer justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="p-text-16 truncate font-semibold">{addr.title}</p>
                                    <p className="p-text-13 break-words text-[#777]">
                                      {addr.address}, {addr.thana}, {addr.district}
                                      {addr.zipCode && ` - ${addr.zipCode}`}
                                    </p>
                                  </div>

                                  <AddressModal
                                    mode="edit"
                                    defaultValues={{
                                      title: addr.title,
                                      thana: addr.thana,
                                      district: addr.district,
                                      address: addr.address,
                                    }}
                                    onSubmitAddress={(data) => handleEditAddress(addr._id, data)}
                                    trigger={
                                      <Button
                                        variant="link"
                                        className="text-blue-dark shrink-0 hover:no-underline"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        Edit
                                      </Button>
                                    }
                                  />
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      />
                    </div>

                    {/* ✅ Footer (fixed) */}
                    {addressesList.length < 5 ? (
                      <div className="border-t px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-px flex-1 border-t-2 border-dashed border-black/30" />

                          <AddressModal
                            mode="add"
                            onSubmitAddress={handleAddAddress}
                            trigger={
                              <Button variant="link" className="p-1! text-black hover:no-underline">
                                <PlusCircle className="size-4" />
                                <span className="p-text-16 capitalize">Add New Address</span>
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </>
      ) : (
        <NoDataPlaceholder
          addressError={errors.address?.message as string}
          title="No address found"
          description="You haven't added any delivery address yet."
          onAdd={
            <AddressModal
              mode="add"
              onSubmitAddress={handleAddAddress}
              trigger={
                <Button variant="link" className="!px-0 !py-0 text-black hover:no-underline">
                  <PlusCircle />
                  <span className="p-text-18">Add Address</span>
                </Button>
              }
            />
          }
        />
      )}

      {/* Delivery charge — hidden as before */}
      <div className="mt-4 hidden space-y-3">
        <Label>
          <p className="p-text-18 font-semibold">Delivery Charge</p>
        </Label>
        <Controller
          name="deliveryType"
          control={control}
          render={({ field }) => (
            <>
              <RadioGroup value={field.value ?? ""} onValueChange={field.onChange}>
                {shippingSettings?.shipping?.shippingCosts?.map((type) => (
                  <div
                    key={type.cost}
                    className={`flex items-center space-x-3 rounded-lg border px-4 py-3 ${
                      deliveryType === type.cost ? "border-primary" : ""
                    }`}
                  >
                    <RadioGroupItem value={type.cost.toString()} id={type.cost.toString()} />
                    <Label htmlFor={type.cost.toString()} className="flex flex-1 cursor-pointer justify-between">
                      <span className="p-text-18 capitalize">{type.zone.replace("_", " ")}</span>
                      <span className="p-text-20 font-medium">{type.cost} BDT</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.deliveryType && <p className="text-sm text-red-500">{errors.deliveryType.message as string}</p>}
            </>
          )}
        />
      </div>
    </div>
  );
}

export function NoDataPlaceholder({
  title,
  description,
  onAdd,
  addressError,
}: {
  title: string;
  description: string;
  onAdd: React.ReactNode;
  addressError?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed p-1 text-center md:space-y-4 md:p-8">
      <p className="p-text-18 font-medium text-black">{title}</p>
      <p className="p-text-14 text-[#777]">{description}</p>
      <div className="flex justify-center">{onAdd}</div>
      {addressError && <ErrorStr message={addressError} className="w-full justify-center" />}
    </div>
  );
}
