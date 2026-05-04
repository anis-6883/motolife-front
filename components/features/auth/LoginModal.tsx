"use client";

import { handleSendOtp, handleSendSignupOtp, verifyOtp, verifySignupOtp } from "@/actions/customer/auth-actions";
import InputField from "@/components/form/InputField";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ROLE } from "@/config/constant";
import { useSettings } from "@/provider/SettingsProvider";
import { useCartStore } from "@/store/cart/cartStore";
import {
  LoginFormValues,
  loginSchema,
  SignupFormValues,
  signupSchema,
  verifyOtpSchema,
  VerifyOtpValues,
} from "@/validations/customer/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeInfo } from "lucide-react";
import { signIn } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

type AuthStep = "login-phone" | "login-otp" | "signup-form" | "signup-otp";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callbackUrl?: string | null;
  loginModalHeader?: string;
  loginModalSubHeader?: string;
  stateUpdater?: (state: boolean) => void;
}

export default function LoginModal({
  open,
  onOpenChange,
  callbackUrl,
  loginModalHeader,
  loginModalSubHeader,
  stateUpdater,
}: LoginModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState<AuthStep>("login-phone");
  const [phone, setPhone] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [resendTime, setResendTime] = useState(0);
  const [signupData, setSignupData] = useState<SignupFormValues | null>(null);
  const settings = useSettings();
  const logoSrc = settings?.logo || "/images/auth/logo.png";

  const { syncOnLogin } = useCartStore();
  /* ---------- Forms ---------- */

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "" },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      // email: "",
    },
  });

  const otpForm = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  /* ---------- Handlers ---------- */

  const secToMin = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes > 0 ? minutes + "m " : ""}${seconds}s`;
  };
  const formattedTime = secToMin(resendTime);
  const onLoginSubmit = async (data: LoginFormValues) => {
    const res = await handleSendOtp(data);

    if (res?.status && res?.data?.otpToken) {
      Toast.success({ title: "Success", description: res.message || "Otp sent successfully!" });
      stateUpdater?.(true);
    } else {
      Toast.error({ title: "Failed", description: res?.error || "Send otp failed!" });
      return;
    }
    const ttl = res.data.ttl;
    // eslint-disable-next-line react-hooks/purity
    const getNow = () => Date.now();
    const now = getNow();
    const remainingSeconds = Math.max(0, Math.floor((ttl - now) / 1000));

    setSentOtp(res?.data?.otpToken);
    setPhone(data.phone);
    setResendTime(remainingSeconds);
    console.log(remainingSeconds, "remaining seconds");
    setStep("login-otp");
  };

  const onResendOtp = async () => {
    const res = await handleSendOtp({ phone });
    console.log(res, "resend otp response");
    if (res?.error) {
      Toast.error({ title: "Failed", description: res?.error || "Send otp failed!" });
      return;
    }
    setSentOtp(res?.data?.otpToken);
    const ttl = res?.data?.ttl;
    const getNow = () => Date.now();
    const now = getNow();

    const remainingSeconds = Math.max(0, Math.floor((ttl - now) / 1000));

    setResendTime(remainingSeconds);
    setStep("login-otp");
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    const res = await handleSendSignupOtp(data);
    if (res?.status) {
      Toast.success({ title: "Success", description: res.message || "Otp sent successfully!" });
    }
    if (res?.error) {
      Toast.error({ title: "Failed", description: res?.error || "Send otp failed!" });
      return;
    }
    setSentOtp(res?.data?.otpToken);
    setSignupData({
      fullName: data.fullName,
      phone: data.phone,
      //  email: data.email
    });
    const ttl = res?.data?.ttl;
    const getNow = () => Date.now();
    const now = getNow();

    const remainingSeconds = Math.max(0, Math.floor((ttl - now) / 1000));

    setResendTime(remainingSeconds);
    setStep("signup-otp");
  };
  const onOtpSubmit = async (data: VerifyOtpValues) => {
    try {
      if (step === "signup-otp") {
        const t = Toast.loading({
          title: "Status",
          description: "Sign up processing...",
        });

        const payload = {
          fullName: signupData?.fullName,
          phone: signupData?.phone,
          // ...(signupData?.email && { email: signupData?.email }),
          otp: data.otp,
          sentOtp,
        };

        const res = await verifySignupOtp(payload);
        if (res?.error) {
          Toast.remove(t);
          Toast.error({ title: "Failed", description: res?.error || "Verify otp failed!" });
          return;
        }

        const nextAuthRes: any = await signIn("credentials", {
          token: res?.data?.accessToken,
          role: ROLE.CUSTOMER,
          redirect: callbackUrl ? undefined : false,
          callbackUrl: callbackUrl || pathname || "/",
        });

        if (nextAuthRes?.error) {
          Toast.remove(t);
          Toast.error({ title: "Failed", description: nextAuthRes.error });
          return;
        } else {
          Toast.success({ title: "Success", description: "Signup successful!" });

          syncOnLogin(res?.data?.user?._id);
          Toast.remove(t);
        }

        setSignupData(null);
        setSentOtp("");
        signupForm.reset();
        setPhone("");
        otpForm.reset();
        onOpenChange(false);

        // Redirect to the intended route if coming from a protected page
        if (callbackUrl) {
          router.replace(callbackUrl);
        }
      } else {
        const t = Toast.loading({
          title: "Status",
          description: "Login processing...",
        });

        const payload = {
          phone,
          otp: data.otp,
          sentOtp,
        };

        const res = await verifyOtp(payload);
        if (res?.error) {
          Toast.remove(t);
          Toast.error({ title: "Failed", description: res?.error || "Verify otp failed!" });
          return;
        }

        const nextAuthRes: any = await signIn("credentials", {
          token: res?.data?.accessToken,
          role: ROLE.CUSTOMER,
          redirect: callbackUrl ? undefined : false,
          callbackUrl: callbackUrl || pathname || "/",
        });

        if (nextAuthRes?.error) {
          Toast.remove(t);
          Toast.error({ title: "Failed", description: nextAuthRes.error });
          return;
        } else {
          Toast.success({ title: "Success", description: "Login successful!" });

          syncOnLogin(res?.data?.user?._id);
          Toast.remove(t);
        }

        setSentOtp("");
        setPhone("");

        loginForm.reset();
        otpForm.reset();
        onOpenChange(false);

        // Redirect to the intended route if coming from a protected page
        if (callbackUrl) {
          router.replace(callbackUrl);
        }
      }
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong. Please try again!");
    }
  };

  useEffect(() => {
    if (!open) {
      setStep("login-phone");
      setPhone("");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-dm-sans mx-auto max-w-[90vw] overflow-hidden p-0 md:max-w-2xl [&>button:first-of-type]:hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">Auth</DialogTitle>
        </DialogHeader>
        <div className="p-1 text-black lg:p-5">
          {/* ---------- LOGIN : PHONE ---------- */}
          {step === "login-phone" && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-md border p-2 duration-300 lg:p-5">
              <div className="flex justify-center pb-3 md:pb-5 lg:pb-7">
                <div className="relative aspect-150/80 w-full max-w-40">
                  <ImageWithFallback fallbackSrc="/images/auth/logo.png" src={logoSrc} alt="Logo Image" fill className="object-contain" />
                </div>
              </div>

              <div className="space-y-2 pb-4 md:space-y-3 md:pb-6 lg:space-y-5 lg:pb-10">
                <h3 className="p-text-30 font-medium">{loginModalHeader || "Welcome Back"}</h3>
                <p className="p-text-18">
                  {loginModalSubHeader || "Join & enjoy exclusive deals on helmets, engine oils, gloves, jackets & premium accessories."}
                </p>

                <p className="p-text-18 text-dark-gray md:leading-5">
                  New here?{" "}
                  <button type="button" className="text-primary font-medium hover:underline" onClick={() => setStep("signup-form")}>
                    Create an account
                  </button>{" "}
                  and get access to exclusive deals on helmets, engine oils, gloves, jackets, and more.
                </p>
              </div>

              <FormProvider {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <InputField
                    name="phone"
                    label="Phone number"
                    placeholder="xxxxxxxxxx"
                    type="phone"
                    required
                    maxLength={10}
                    labelClassName="p-text-16 font-semibold"
                  />
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onLoginSubmit(loginForm.getValues());
                    }}
                    className="mt-5 h-11! w-full"
                    type="submit"
                  >
                    SEND OTP
                  </Button>
                </form>
              </FormProvider>
              <div className="pb-32"></div>
            </div>
          )}
          {step === "signup-form" && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-md border p-2 duration-300 lg:p-5">
              <div className="flex justify-center pb-3 md:pb-5 lg:pb-7">
                <div className="relative aspect-150/80 w-full max-w-40">
                  <ImageWithFallback fallbackSrc="/images/auth/logo.png" src={logoSrc} alt="Logo Image" fill className="object-contain" />
                </div>
              </div>

              <div className="space-y-2 pb-4 md:space-y-3 md:pb-6 lg:space-y-5 lg:pb-10">
                <h3 className="p-text-30 font-medium">Create an Account</h3>
                <p className="p-text-18">Join & enjoy exclusive deals on helmets, engine oils, gloves, jackets & premium accessories.</p>
                <div className="p-text-18 text-dark-gray flex gap-x-2 md:leading-5">
                  Already have an account?
                  <button type="button" className="text-primary font-medium hover:underline" onClick={() => setStep("login-phone")}>
                    Log in
                  </button>
                </div>
              </div>

              <FormProvider {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  {/* Full Name */}
                  <InputField
                    labelClassName="p-text-16 font-semibold"
                    name="fullName"
                    label="Full name"
                    placeholder="John Doe"
                    type="text"
                    required
                  />
                  <InputField
                    labelClassName="p-text-16 font-semibold"
                    name="phone"
                    label="Phone number"
                    placeholder="xxxxxxxxx"
                    type="phone"
                    required
                    maxLength={10}
                  />

                  {/* Email */}
                  {/* <InputField
                    labelClassName="p-text-16 font-semibold"
                    name="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    type="email"
                  /> */}

                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onSignupSubmit(signupForm.getValues());
                    }}
                    className="mt-5 h-11! w-full"
                    type="submit"
                  >
                    CONTINUE
                  </Button>
                </form>
              </FormProvider>
            </div>
          )}

          {(step === "login-otp" || step === "signup-otp") && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-md p-2 duration-300 lg:p-5">
              <div className="flex justify-center pb-3 md:pb-5 lg:pb-7">
                <div className="relative aspect-150/80 w-full max-w-40">
                  <ImageWithFallback fallbackSrc="/images/auth/logo.png" src={logoSrc} alt="Logo Image" fill className="object-contain" />
                </div>
              </div>

              <div className="space-y-2 pb-4 md:space-y-3 md:pb-6 lg:space-y-5 lg:pb-10">
                <h3 className="p-text-30 text-center font-medium">Enter OTP Code</h3>
                <p className="p-text-18 text-dark-gray text-center md:leading-5.5">
                  We’ve sent a 6-digit one time verification code to your phone number <span className="text-black">{phone}</span>
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
                            <InputOTPSlot key={i} index={i} className="text-sm font-semibold md:text-2xl" />
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
                        onResendOtp();
                      }}
                    >
                      Resend
                    </button>
                  ) : (
                    <p className="text-primary">{formattedTime}</p>
                  )}
                </p>
                <div className="flex gap-4">
                  <Button
                    variant={"outline"}
                    className="h-11! flex-1 rounded-full border border-black bg-white text-black hover:bg-black/80 hover:text-white"
                    onClick={() => setStep(step === "login-otp" ? "login-phone" : "signup-form")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onOtpSubmit(otpForm.getValues());
                    }}
                    className="h-11! flex-1 rounded-full bg-black text-white hover:bg-black/80 hover:text-white"
                    type="submit"
                  >
                    VERIFY
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
