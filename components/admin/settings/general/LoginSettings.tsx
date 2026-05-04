"use client";

import { updateGeneralSettings } from "@/actions/admin/settings-action";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AuthSettingsFormValues, authSettingsSchema } from "./schemas";

// ---------------------- Component ----------------------

interface AuthSettingsFormProps {
  defaultValues?: Partial<AuthSettingsFormValues>;
}

export default function LoginSettingsForm({ defaultValues = {} }: AuthSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AuthSettingsFormValues>({
    resolver: zodResolver(authSettingsSchema),
    defaultValues: {
      enableCustomerOtpLogin: defaultValues.enableCustomerOtpLogin ?? true,
      enableCustomerPasswordLogin: defaultValues.enableCustomerPasswordLogin ?? true,

      enableSellerOtpLogin: defaultValues.enableSellerOtpLogin ?? true,
      enableSellerPasswordLogin: defaultValues.enableSellerPasswordLogin ?? false,
      sellerApprovalRequired: defaultValues.sellerApprovalRequired ?? true,

      maxOtpHits: defaultValues.maxOtpHits ?? 5,
      otpResendTime: defaultValues.otpResendTime ?? 60,
      otpBlockTime: defaultValues.otpBlockTime ?? 3600,

      maxLoginHits: defaultValues.maxLoginHits ?? 10,
      loginBlockTime: defaultValues.loginBlockTime ?? 1800,
    },
  });

  const handleSubmit = async (data: AuthSettingsFormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Saving authentication settings...",
    });

    try {
      await updateGeneralSettings(data);

      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: "Authentication settings updated successfully!",
      });
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || "Failed to update settings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Login Options</CardTitle>
            <CardDescription>Configure how customers can login.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 md:grid md:grid-cols-2 md:gap-6">
            <FormSwitch
              className="md:h-full"
              name="enableCustomerPasswordLogin"
              label="Email and Password Login"
              description="By enabling this, customers will get the option to create an account and log in using the necessary credentials & password in the website"
            />
            <FormSwitch
              className="md:h-full"
              name="enableCustomerOtpLogin"
              label="OTP Login"
              description="By enabling otp login, customers can log in using their phone number without password in the website"
            />
          </CardContent>
        </Card>

        {/* Seller Login */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Login Options</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 md:grid md:grid-cols-3 md:gap-6">
            <FormSwitch
              className="md:h-full"
              name="enableSellerPasswordLogin"
              label="Email and Password Login"
              description="By enabling this, vendors can log in using the necessary credentials & password in the website"
            />
            <FormSwitch
              className="md:h-full"
              name="enableSellerOtpLogin"
              label="OTP Login"
              description="By enabling otp login, vendors can log in using their phone number without password in the website"
            />

            <FormSwitch
              className="md:h-full"
              name="sellerApprovalRequired"
              label="Approval Required After Signup"
              description="By enabling this, vendors will need admin’s approval to create a vendor account in the website"
            />
          </CardContent>
        </Card>

        {/* OTP Security */}
        <Card>
          <CardHeader>
            <CardTitle>OTP and Login Attempts Setup</CardTitle>
            <CardDescription>Manage the settings for how many times a user can try to enter OTP</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-3">
            <InputField name="maxOtpHits" label="Maximum OTP Hits" type="number" placeholder="5" />

            <InputField name="otpResendTime" label="OTP Resend Time (Sec)" type="number" placeholder="60" />

            <InputField name="otpBlockTime" label="Temporary Block Time (Sec)" type="number" placeholder="3600" />
          </CardContent>
        </Card>

        {/* Login Security */}
        <Card>
          <CardHeader>
            <CardTitle>Login Setup</CardTitle>
            <CardDescription>Manage the settings for how many times a user try to log in to the system</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <InputField name="maxLoginHits" label="Maximum Login Hits" type="number" placeholder="10" />

            <InputField name="loginBlockTime" label="Temporary Login Block Time (Sec)" type="number" placeholder="1800" />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="rounded-full" variant={"black"} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
