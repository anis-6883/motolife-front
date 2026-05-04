"use client";

import InputField from "@/components/form/InputField";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { allRoutes } from "@/config/constant";
import { useSettings } from "@/provider/SettingsProvider";
import {
  SignupFormValues,
  storeSetupSchema,
  StoreSetupValues,
  vendorLoginSchema,
  VendorLoginValues,
  vendorRegisterSchema,
  VendorRegisterValues,
} from "@/validations/customer/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

type AuthStep = "login-phone" | "signup-form" | "store-setup";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: AuthStep;
}

export default function VendorAuthModal({ open, onOpenChange, initialStep = "signup-form" }: LoginModalProps) {
  const [step, setStep] = useState<AuthStep>(initialStep);
  const settings = useSettings();
  const logoSrc = settings?.logo || "/images/auth/logo.png";

  const loginForm = useForm<VendorLoginValues>({
    resolver: zodResolver(vendorLoginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const signupForm = useForm<VendorRegisterValues>({
    resolver: zodResolver(vendorRegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const storeForm = useForm<StoreSetupValues>({
    resolver: zodResolver(storeSetupSchema),
    defaultValues: {
      storeName: "",
      storeCategory: "",
      tradeLicenseNo: "",
      tradeLicenseFile: undefined,
      nidPassportNo: "",
      nidPassportFile: undefined,
      businessType: "",
      agreeTerms: false,
    },
  });

  const rememberMe = useWatch({
    control: loginForm.control,
    name: "rememberMe",
  });

  const agreeTerms = useWatch({
    control: storeForm.control,
    name: "agreeTerms",
  });
  const onLoginSubmit = async (data: VendorLoginValues) => {
    console.log("Send login OTP to:", { ...data });
    onOpenChange(false);
  };
  const onSignupSubmit = async (data: SignupFormValues) => {
    const fullPhone = "+880" + data.phone;
    console.log("Signup data:", { ...data, phone: fullPhone });
    setStep("store-setup");
  };

  useEffect(() => {
    if (open) {
      setStep(initialStep);
    }
  }, [open, initialStep]);
  const onStoreSubmit = async (data: StoreSetupValues) => {
    console.log("Store setup:", data);
    onOpenChange(false);
  };

  const onBack = () => {
    setStep("signup-form");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-dm-sans scrollbar-none mx-auto max-h-[80vh] max-w-[90vw] overflow-y-auto p-0 py-5 md:max-w-2xl [&>button:first-of-type]:hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">Auth</DialogTitle>
        </DialogHeader>
        <div className="p-2 text-black 2xl:px-7.5 2xl:py-0">
          {step === "login-phone" && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-md duration-300">
              <div className="flex justify-center pb-3 md:pb-5 lg:pb-7">
                <div className="relative aspect-150/80 w-full max-w-40">
                  <ImageWithFallback fallbackSrc="/images/auth/logo.png" src={logoSrc} alt="Logo Image" fill className="object-contain" />
                </div>
              </div>

              <div className="space-y-2 pb-4 md:space-y-3 md:pb-6 lg:space-y-5">
                <h3 className="p-text-30 font-bold">Welcome Back</h3>
                <p className="p-text-16 text-dark-gray">Log in to manage your products orders and earnings.</p>
              </div>

              <FormProvider {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <InputField
                    labelClassName="p-text-16 font-semibold"
                    name="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    type="email"
                  />
                  <InputField
                    labelClassName="p-text-16 font-semibold"
                    name="password"
                    label="Password"
                    placeholder="******"
                    type="password"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => loginForm.setValue("rememberMe", !!v)} />
                      <Label htmlFor="remember" className="cursor-pointer text-sm">
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      // onClick={onForgot}
                      className="text-primary text-sm hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button className="mt-2 h-11! w-full rounded-full" type="submit">
                    SIGN IN
                  </Button>
                </form>
              </FormProvider>
              <div className="pb-17"></div>

              <p className="p-text-16 text-dark-gray md:leading-5">
                New here?{" "}
                <button type="button" className="text-primary font-medium hover:underline" onClick={() => setStep("signup-form")}>
                  Create an account
                </button>{" "}
              </p>
            </div>
          )}
          {step === "signup-form" && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-md duration-300">
              <div className="flex justify-center pb-3 md:pb-4">
                <div className="relative aspect-150/80 w-full max-w-40">
                  <ImageWithFallback fallbackSrc="/images/auth/logo.png" src={logoSrc} alt="Logo Image" fill className="object-contain" />
                </div>
              </div>

              <div className="space-y-2 pb-4 md:space-y-3 md:pb-6 lg:space-y-5">
                <h3 className="p-text-30 font-bold">Create Your Vendor Account</h3>
                <p className="p-text-16 text-dark-gray">
                  Start selling bike accessories, safety gear, engine oil, helmets & more to thousands of customers.
                </p>
              </div>

              <FormProvider {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-2">
                  {/* Full Name */}
                  <InputField
                    labelClassName="p-text-16 font-semibold"
                    name="fullName"
                    label="Full name"
                    placeholder="John Doe"
                    type="text"
                    required
                  />
                  {/* Email */}
                  <InputField
                    labelClassName="p-text-16 font-semibold"
                    name="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    type="email"
                  />
                  <InputField
                    labelClassName="p-text-16 font-semibold"
                    name="phone"
                    label="Phone number"
                    placeholder="xxxxxxxxx"
                    type="phone"
                    required
                  />

                  <InputField
                    labelClassName="p-text-16 font-semibold"
                    name="password"
                    label="Password"
                    placeholder="******"
                    type="password"
                  />
                  <InputField
                    labelClassName="p-text-16 font-semibold"
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="******"
                    type="password"
                  />

                  <Button className="mt-3.5 h-11! w-full rounded-full capitalize" type="submit">
                    Next: Store Details <ArrowRight />
                  </Button>
                </form>
              </FormProvider>
              <div className="p-text-16 flex gap-x-2 pt-4 text-black md:pt-4 md:leading-5">
                Already have an account?
                <button type="button" className="text-primary font-medium hover:underline" onClick={() => setStep("login-phone")}>
                  Log in
                </button>
              </div>
            </div>
          )}
          {step === "store-setup" && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-md duration-300">
              <div className="flex justify-center pb-5">
                <div className="relative aspect-150/80 w-full max-w-40">
                  <ImageWithFallback fallbackSrc="/images/auth/logo.png" src={logoSrc} alt="Logo Image" fill className="object-contain" />
                </div>
              </div>
              <Button type="button" variant="link" className="h-11 flex-1 rounded-full p-0! text-black hover:no-underline" onClick={onBack}>
                <ArrowLeft /> Back
              </Button>
              <div className="space-y-2 pt-3.5 pb-6">
                <h3 className="p-text-30 font-bold">Set Up Your Store</h3>
                <p className="p-text-16 text-dark-gray">Provide your business details to complete vendor registration.</p>
              </div>

              <FormProvider {...storeForm}>
                <form onSubmit={storeForm.handleSubmit(onStoreSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputField name="storeName" label="Store Name" type="text" required />

                    <InputField
                      selectTriggerClassName={"w-full 2xl:h-11!"}
                      name="storeCategory"
                      label="Store Category"
                      type="select"
                      required
                      options={[
                        { label: "Helmets", value: "helmets" },
                        { label: "Engine Oil", value: "engine_oil" },
                        { label: "Accessories", value: "accessories" },
                      ]}
                    />

                    <InputField name="tradeLicenseNo" label="Trade License No." type="text" required />

                    <InputField
                      name="tradeLicenseFile"
                      label="Upload Trade License"
                      type="custom-file"
                      placeholder="Choose file (PDF/JPG/PNG)"
                    />

                    <InputField name="nidPassportNo" label="NID / Passport No." type="text" required />

                    <InputField
                      name="nidPassportFile"
                      label="Upload NID / Passport"
                      type="custom-file"
                      placeholder="Choose file (PDF/JPG/PNG)"
                    />

                    <div className="md:col-span-2">
                      <InputField
                        selectTriggerClassName={"w-full 2xl:h-11!"}
                        name="businessType"
                        label="Business Type"
                        type="select"
                        required
                        placeholder="Individual / Company"
                        options={[
                          { label: "Sole Proprietor", value: "sole" },
                          { label: "Partnership", value: "partnership" },
                          { label: "Private Limited", value: "pvt_ltd" },
                        ]}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="agreeTerms" checked={agreeTerms} onCheckedChange={(v) => storeForm.setValue("agreeTerms", !!v)} />
                      <Label htmlFor="agreeTerms" className="cursor-pointer text-sm">
                        <p className="text-dark-gray text-wrap">
                          I agree to the{" "}
                          <Link href={allRoutes.termsConditions} className="text-black underline">
                            terms & policy
                          </Link>
                        </p>
                      </Label>
                    </div>
                    <div className="flex gap-3 md:col-span-2">
                      <Button type="submit" className="h-11 flex-1 rounded-full">
                        COMPLETE SETUP
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
