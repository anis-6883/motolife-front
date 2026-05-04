"use client";

import { sendPhoneChangeOtp } from "@/actions/customer/profile-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import useUserProfile from "@/store/useUserProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import PhoneVerificationModal from "./PhoneVerificationModal";

const phoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits!"),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

interface PhoneUpdateCardProps {
  onSuccess: () => void;
}

const PhoneUpdateCard = ({ onSuccess }: PhoneUpdateCardProps) => {
  const { userData, fetchCustomerProfileData } = useUserProfile();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [otpToken, setOtpToken] = useState("");

  const methods = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: userData?.phone || "",
    },
  });
  const {
    register,
    formState: { errors, isDirty, isSubmitting },
  } = methods;
  const onSubmit = async (data: PhoneFormValues) => {
    if (data.phone === userData?.phone) {
      onSuccess();
      return;
    }

    const res = await sendPhoneChangeOtp({ phone: data.phone });
    if (res?.status) {
      setNewPhone(data.phone);
      setOtpToken(res?.data?.otpToken);
      setShowOtpModal(true);
    } else {
      Toast.error({ title: "Failed", description: res?.error || "Send OTP failed!" });
    }
  };

  const handleSuccess = () => {
    fetchCustomerProfileData();
    onSuccess();
    methods.reset();
  };

  return (
    <div className="mx-auto mt-8 rounded-lg border bg-white p-3 md:p-6">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-top-2 duration-300">
          <h2 className="p-text-24 mb-2 font-semibold max-md:text-base md:mb-4 xl:mb-8">Phone Number</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <InputField
              name="phone"
              placeholder="Write your phone number"
              type="phone"
              required
              maxLength={10}
              labelClassName="p-text-16 leading-6"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-4">
            <Button className="px-14 2xl:h-11" type="submit" disabled={!isDirty || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin outline-none" />}
              Send Otp
            </Button>
          </div>
        </form>
      </FormProvider>

      <PhoneVerificationModal
        open={showOtpModal}
        onOpenChange={setShowOtpModal}
        phone={newPhone}
        initialOtpToken={otpToken}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default PhoneUpdateCard;
