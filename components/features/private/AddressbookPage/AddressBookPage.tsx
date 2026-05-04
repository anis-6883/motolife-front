"use client";

import { addCustomerAddress, updateCustomerAddress } from "@/actions/customer/profile-actions";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { CustomerAddress } from "@/lib/types";
import useUserProfile from "@/store/useUserProfile";
import { Edit3, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { AddressModal } from "../../public/checkout/AddressModal";
import { NoDataPlaceholder } from "../../public/checkout/CheckoutDeliveryAddress2";
import { AddressFormValues } from "../../public/checkout/schema";

const AddressBookPage = () => {
  const { userData } = useUserProfile();
  const addresses = userData?.addresses;
  const [addressesList, setAddressesList] = useState<CustomerAddress[]>(addresses);

  useEffect(() => {
    setAddressesList(addresses);
  }, [addresses]);

  // ✅ ADD
  const handleAddAddress = async (data: AddressFormValues) => {
    console.log({ add: data });
    const res = await addCustomerAddress(data);

    if ((res as any).error && (res as any).statusCode !== 200) {
      Toast.error((res as any).error);
      return;
    }

    const newAddress = (res as any).data || { ...data, _id: Date.now().toString() };

    setAddressesList(newAddress.data);
  };
  const handleEditAddress = async (id: string, data: AddressFormValues) => {
    console.log({ edit: data });
    const res = await updateCustomerAddress(id, data);

    if ((res as any).error && (res as any).statusCode !== 200) {
      Toast.error((res as any).error);
      return;
    }

    const updatedAddresses = (res as any).data || [];
    setAddressesList(updatedAddresses.data);
  };

  return (
    <>
      <h2 className="p-text-24 mb-2 font-semibold max-md:text-base md:mb-4 xl:mb-8">Address Book</h2>

      {addressesList?.length > 0 ? (
        <>
          <div className="grid gap-4 pb-3 md:pb-6 lg:grid-cols-2 xl:pb-7">
            {addressesList.map((type) => (
              <div key={type._id} className="flex items-center space-x-3 rounded-lg border p-4">
                <div className="flex flex-1">
                  <div className="flex-1 space-y-3 md:space-y-5 xl:space-y-10">
                    <h4 className="p-text-18 leading-7 font-semibold md:leading-9">{type.title}</h4>

                    <p className="p-text-14 line-clamp-1 text-[#777]">
                      {type.address}, {type.thana}, {type.district}
                      {type.zipCode && ` - ${type.zipCode}`}
                    </p>
                  </div>

                  <AddressModal
                    mode="edit"
                    defaultValues={{
                      title: type.title,
                      thana: type.thana,
                      district: type.district,
                      address: type.address,
                    }}
                    onSubmitAddress={(data) => handleEditAddress(type._id, data)}
                    trigger={
                      <Button className="text-blue-dark hover:text-blue-dark/80 hover:no-underline" variant="link">
                        <Edit3 />
                        Edit
                      </Button>
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ADD */}
          {addressesList.length < 5 ? (
            <div className="flex items-center justify-end gap-2">
              <div className="h-px flex-1 overflow-hidden border-t-2 border-dashed border-black/50" />

              <AddressModal
                mode="add"
                onSubmitAddress={handleAddAddress}
                trigger={
                  <Button variant="link" className="p-1! text-black hover:no-underline">
                    <PlusCircle className="size-5" />
                    <span className="p-text-18 leading-7 capitalize md:leading-9">Add Another Address</span>
                  </Button>
                }
              />
            </div>
          ) : null}
        </>
      ) : (
        <NoDataPlaceholder
          title="No address found"
          description="You haven’t added any delivery address yet."
          onAdd={
            <AddressModal
              mode="add"
              onSubmitAddress={handleAddAddress}
              trigger={
                <Button variant="link" className="!px-0 !py-0 text-black hover:no-underline">
                  <PlusCircle />
                  <span className="p-text-18 leading-7 md:leading-9">Add Another Address</span>
                </Button>
              }
            />
          }
        />
      )}

      <div className="w-full md:h-20 lg:h-40 xl:h-60"></div>
    </>
  );
};

export default AddressBookPage;
