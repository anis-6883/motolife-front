"use client";

import { sendPhoneChangeOtp, verifyPhoneChangeOtp } from "@/actions/customer/profile-actions";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeInfo, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits!"),
});

type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;

interface PhoneVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phone: string;
  initialOtpToken?: string;
  onSuccess: () => void;
}

export default function PhoneVerificationModal({ open, onOpenChange, phone, initialOtpToken, onSuccess }: PhoneVerificationModalProps) {
  const [sentOtp, setSentOtp] = useState(initialOtpToken || "");
  const [resendTime, setResendTime] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpSentRef = useRef(false);

  const otpForm = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  const sendOtp = useCallback(async () => {
    const res = await sendPhoneChangeOtp({ phone });
    if (res?.status) {
      //   Toast.success({ title: "Success", description: res.message || "OTP sent successfully!" });
      setSentOtp(res?.data?.otpToken);
      const ttl = res?.data?.ttl;
      if (ttl) {
        const now = Date.now();
        const remainingSeconds = Math.max(0, Math.floor((ttl - now) / 1000));
        setResendTime(remainingSeconds);
      } else {
        setResendTime(60);
      }
    } else {
      Toast.error({ title: "Failed", description: res?.error || "Send OTP failed!" });
    }
  }, [phone]);

  useEffect(() => {
    if (initialOtpToken) {
      setSentOtp(initialOtpToken);
    }
  }, [initialOtpToken]);

  useEffect(() => {
    if (open && phone && !initialOtpToken && !otpSentRef.current) {
      sendOtp();
      otpSentRef.current = true;
    }
  }, [open, phone, sendOtp, initialOtpToken]);

  useEffect(() => {
    if (!open) {
      otpSentRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (resendTime > 0) {
      const timer = setInterval(() => {
        setResendTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTime]);

  const onOtpSubmit = async (data: VerifyOtpValues) => {
    setIsSubmitting(true);
    try {
      const t = Toast.loading({
        title: "Status",
        description: "Verifying OTP...",
      });

      const res = await verifyPhoneChangeOtp({
        phone,
        otp: data.otp,
        sentOtp,
      });

      Toast.remove(t);

      if (res?.error) {
        Toast.error({ title: "Failed", description: res?.error || "Verify OTP failed!" });
        return;
      }

      Toast.success({ title: "Success", description: "Phone number updated successfully!" });
      onOpenChange(false);
      otpForm.reset();
      onSuccess();
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong. Please try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-dm-sans mx-auto max-w-[90vw] overflow-hidden p-0 md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Phone Verification</DialogTitle>
        </DialogHeader>
        <div className="p-1 text-black md:p-4 lg:p-8">
          <div className="animate-in fade-in slide-in-from-top-2 rounded-md p-2 duration-300 lg:p-5">
            <div className="space-y-4 pb-6 md:space-y-6 md:pb-10">
              <h3 className="p-text-30 text-center font-medium">Enter OTP Code</h3>
              <p className="p-text-18 text-dark-gray text-center md:leading-5.5">
                We’ve sent a 6-digit one time verification code to your new phone number <span className="text-black">{phone}</span>
              </p>
            </div>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Controller
                  name="otp"
                  control={otpForm.control}
                  render={({ field }) => (
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="flex w-full justify-center gap-0.5 md:gap-3">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot key={i} index={i} className="font-semibold md:text-2xl" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />

                {otpForm.formState.errors.otp && (
                  <p className="text-destructive flex items-center justify-center gap-2 text-center text-sm">
                    <BadgeInfo className="size-4!" /> {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>
              <p className="text-dark-gray flex items-center justify-center gap-2 text-center text-sm">
                Didn’t get an OTP?{" "}
                {resendTime === 0 ? (
                  <button
                    type="button"
                    className="font-medium text-black hover:underline"
                    onClick={() => {
                      sendOtp();
                    }}
                  >
                    Resend
                  </button>
                ) : (
                  <p className="text-red-600">{resendTime}s</p>
                )}
              </p>
              <div className="flex gap-4">
                <Button
                  variant={"outline"}
                  type="button"
                  className="h-11! flex-1 rounded-full border border-black bg-white text-black hover:bg-black/80 hover:text-white"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="h-11! flex-1 rounded-full bg-black text-white hover:bg-black/80 hover:text-white"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  VERIFY
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
