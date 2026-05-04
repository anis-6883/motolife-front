"use client";

import { updateInHouseShop } from "@/actions/admin/inhouse-shop/inhouse-shop-actions";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import closeImage from "@/public/images/inhouse/close.png";
import openImage from "@/public/images/inhouse/open.png";
import Image from "next/image";
import { useState, useTransition } from "react";
interface StoreAvailabilityProps {
  initialAvailable: boolean;
}

export default function StoreAvailability({ initialAvailable }: StoreAvailabilityProps) {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [nextValue, setNextValue] = useState(initialAvailable);

  const handleConfirm = () => {
    setShowModal(false);
    const prev = isAvailable;

    startTransition(async () => {
      const t = Toast.loading({ title: "Status", description: "Updating store availability..." });
      try {
        await updateInHouseShop({
          businessSettings: { isAvailable: nextValue },
        });
        setIsAvailable(nextValue);
        Toast.remove(t);
        Toast.success({
          title: "Success",
          description: nextValue ? "Store is now available." : "Store is now unavailable.",
        });
      } catch (error: unknown) {
        setIsAvailable(prev);
        Toast.remove(t);
        Toast.error({
          title: "Failed",
          description: error instanceof Error ? error.message : "Failed to update availability.",
        });
      }
    });
  };

  const handleSwitchClick = (value: boolean) => {
    setNextValue(value);
    setShowModal(true);
  };

  return (
    <>
      {/* Switch */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Store Availability</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Disabling this option will temporarily close the in-house shop on the customer app and website
          </p>
        </div>
        <Switch checked={isAvailable} onCheckedChange={handleSwitchClick} disabled={isPending} />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className={`text-xl font-bold ${nextValue ? "text-green-600" : "text-red-600"}`}>
                {nextValue ? (
                  <Image alt="open image" src={openImage} height={70} width={70} />
                ) : (
                  <Image alt="close image" src={closeImage} height={70} width={70} />
                )}
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Are you sure you want to {nextValue ? "turn on" : "turn off"} the Store Availability status?
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              {nextValue
                ? "If you turn on this option, your store will be available on the customer website."
                : "If you turn off this option, your store will be temporarily closed from the customer website."}
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Yes, {nextValue ? "Turn on" : "Turn off"}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
