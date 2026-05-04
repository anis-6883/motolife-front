"use client";

import { addCustomerPaymentMethod, deleteCustomerPaymentMethod } from "@/actions/customer/profile-actions";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { PaymentMethodType } from "@/config/constant";
import { CustomerPaymentMethod } from "@/lib/types";
import { CreditCard, PlusCircle, Smartphone, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmModal } from "../../public/shared/DeleteConfirmationModal";
import { AddPaymentModal } from "./AddPaymentModal";
import { PaymentFormData } from "./schema";

const PaymentMethodsPage = ({ paymentMethods }: { paymentMethods: CustomerPaymentMethod[] }) => {
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedIndex(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedIndex !== null) {
      const res = await deleteCustomerPaymentMethod(selectedIndex);
      if ((res as any).error && (res as any).statusCode !== 200) {
        Toast.error((res as any).error);
      }
      setSelectedIndex(null);
      setDeleteModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
  };

  const handleAddPayment = async (data: PaymentFormData) => {
    const res = await addCustomerPaymentMethod(data);
    if ((res as any).error && (res as any).statusCode !== 200) {
      Toast.error((res as any).error);
    }
  };

  return (
    <div>
      <h2 className="p-text-24 mb-2 font-semibold max-md:text-base md:mb-4 xl:mb-8">My Payment Method</h2>

      <div className="space-y-5 pb-3 md:space-y-8 md:pb-6 xl:space-y-13">
        {paymentMethods?.map((method, index) => (
          <div key={index} className="relative rounded-lg border p-2 md:p-3.5">
            {/* Delete button */}
            <Button
              variant="link"
              size="sm"
              className="text-primary absolute right-2 bottom-2 rounded-full p-1 hover:no-underline"
              onClick={() => handleDeleteClick(method._id)}
            >
              <Trash2 size={16} />
            </Button>
            <div className="text-dark-gray flex items-center gap-2 border-b pb-3">
              {method.methodType === PaymentMethodType.BANK ? <CreditCard /> : <Smartphone />}
              <p className="p-text-18 font-semibold -tracking-[0.18px]">
                {method.methodType === PaymentMethodType.BANK ? "Credit/Debit Card" : "Mobile Banking"}
              </p>
            </div>
            {method.methodType === PaymentMethodType.BANK ? (
              <div className="text-light-gray p-text-18 flex flex-col pt-2 font-semibold -tracking-[0.18px] md:flex-row xl:pt-10">
                {/* Column 1 */}
                <div className="flex flex-1 flex-col">
                  <p className="border-b pb-1 lg:pb-3">Card Number</p>
                  <p className="pt-2 text-black md:pt-3 lg:pt-6">
                    {method.cardNumber ? method.cardNumber.slice(0, 5) + "******" + method.cardNumber.slice(-4) : ""}
                  </p>
                </div>
                <div className="mt-2 flex flex-1 flex-col md:mt-0">
                  <p className="border-b pb-1 lg:pb-3">{method.methodType === PaymentMethodType.BANK ? "Expiry Date" : "Mobile Number"}</p>
                  <p className="pt-2 text-black md:pt-3 lg:pt-6">
                    {method.methodType === PaymentMethodType.BANK ? `Expires ${method.expiry}` : method.phone}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-light-gray p-text-18 grid pt-2 font-semibold -tracking-[0.18px] md:grid-cols-1 xl:pt-10">
                <p className="border-b pb-1 lg:pb-3">Mobile Number</p>
                <p className="pt-2 text-black md:pt-3 lg:pt-6">{method.phone}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2">
        <div className="h-px flex-1 overflow-hidden border-t-2 border-dashed border-black/50" />

        <Button variant={"link"} className="p-1! text-black hover:no-underline" onClick={() => setOpen(true)}>
          <PlusCircle className="size-5" />
          <span className="p-text-18 leading-7 capitalize md:leading-9">Add New Method</span>
        </Button>
      </div>
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        description="Delete Payment Method?"
        confirmText="Delete"
        cancelText="Cancel"
      />
      <AddPaymentModal open={open} setOpen={setOpen} onSubmit={(data) => handleAddPayment(data)} />
    </div>
  );
};

export default PaymentMethodsPage;
