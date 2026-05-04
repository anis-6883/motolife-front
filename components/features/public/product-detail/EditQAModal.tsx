"use client";

import { createQA } from "@/actions/landing/product-action";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { onError } from "@/lib/client-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

const qaSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  // customerEmail: z.string().min(1, "Email is required").email("Invalid email").optional(),
  question: z.string().min(1, "Question is required").max(500, "Question cannot exceed 500 characters"),
});

export type QAFormValues = z.infer<typeof qaSchema>;

interface EditAddQAModalProps {
  open: boolean;
  qa?: QAFormValues;
  onClose: () => void;
  userInfo?: any;
  productId?: string; // optional if needed for API
  refetchFaqs?: boolean;
  setRefetchFaqs?: (val: boolean) => void;
  isComboProduct?: boolean;
}

export function EditAddQAModal({
  open,
  qa,
  onClose,
  userInfo,
  productId,
  refetchFaqs,
  setRefetchFaqs,
  isComboProduct,
}: EditAddQAModalProps) {
  const isEdit = !!qa;
  const [loading, setLoading] = useState(false);

  const methods = useForm<QAFormValues>({
    resolver: zodResolver(qaSchema),
    defaultValues: {
      customerName: userInfo?.fullName || "",
      // email: userInfo?.email || "",
      question: qa?.question || "",
    },
  });

  const { handleSubmit, reset } = methods;

  // reset like ReviewModal
  useEffect(() => {
    if (qa) {
      reset({
        customerName: userInfo?.fullName || "",
        // customerEmail: userInfo?.email || "",
        question: qa.question || "",
      });
    } else {
      reset({
        customerName: userInfo?.fullName || "",
        // customerEmail: userInfo?.email || "",
        question: "",
      });
    }
  }, [qa, userInfo, reset]);

  const onSubmit = async (data: QAFormValues) => {
    setLoading(true);

    try {
      const payload = {
        ...data,
        ...(productId && isComboProduct ? { comboProduct: productId } : { product: productId }),
      };

      const res = await createQA(payload);
      if ((res as any)?.error === null || (res as any)?.statusCode === 201) {
        Toast.success("Your question is submitted successfully and will be answered soon.");
        onClose();

        reset({
          customerName: userInfo?.fullName || "",
          // customerEmail: userInfo?.email || "",
          question: "",
        });

        if (setRefetchFaqs) setRefetchFaqs(!refetchFaqs);
      } else {
        console.log(res);
        Toast.error((res as any)?.message || "Failed to submit question");
      }
    } catch (err: any) {
      Toast.error(err?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-hidden max-md:p-2 sm:max-w-xl md:max-w-2xl [&>button:first-of-type]:hidden">
        <div className="relative">
          {/* Close */}
          <button onClick={onClose} className="absolute top-0 right-0 z-10">
            <X className="size-6" />
          </button>

          {/* Header */}
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">{isEdit ? "Update Question" : "Have a Question?"}</DialogTitle>
            <p className="text-center text-gray-500">We’re here to help. Ask anything!</p>
          </DialogHeader>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="mt-4 space-y-6 md:px-5">
              {/* Name */}
              {!userInfo?.fullName && <InputField name="customerName" label="Name" placeholder="Simran" type="text" required />}

              {/* Email */}
              {/* {!userInfo?.email && <InputField name="customerEmail" label="Email" placeholder="simran@gmail.com" type="email" required />} */}

              {/* Question */}
              <InputField
                name="question"
                label="Your Question"
                placeholder="Ask your question here..."
                type="textarea"
                required
                rowCount={3}
              />

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline-black" onClick={onClose}>
                  Cancel
                </Button>

                <Button type="submit" className="bg-black px-8 text-white hover:bg-black/90" disabled={loading}>
                  {loading && <Loader2 className="mr-2 animate-spin" />}
                  {isEdit ? "UPDATE" : "SUBMIT"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
