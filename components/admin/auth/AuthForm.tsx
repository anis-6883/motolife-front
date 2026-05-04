"use client";

import { handleAdminLogin } from "@/actions/admin/auth-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { ROLE } from "@/config/constant";
import { getFirstPermittedRoute } from "@/lib/permission-helper";
import { AdminLoginFormValues, adminLoginSchema } from "@/validations/admin/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const loginForm = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLoginSubmit = async (data: AdminLoginFormValues) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const t = Toast.loading({
        title: "Status",
        description: "Login processing...",
      });

      const result = await handleAdminLogin(formData);

      if (result?.error) {
        Toast.remove(t);
        Toast.error({ title: "Failed", description: result.error });
        return;
      }

      Toast.remove(t);
      Toast.success({ title: "Success", description: "Welcome to Admin Portal!" });

      const permissions = result?.data?.permissions ?? [];
      const firstRoute = getFirstPermittedRoute(permissions);

      const nextAuthRes: any = await signIn("credentials", {
        token: result?.data?.token,
        role: ROLE.ADMIN,
        permissions: JSON.stringify(result?.data?.permissions ?? []),
        callbackUrl: callbackUrl || firstRoute,
      });

      if (nextAuthRes?.error) {
        Toast.remove(t);
        Toast.error({ title: "Failed", description: nextAuthRes.error });
        return;
      }
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong. Please try again!");
    }
  };

  return (
    <FormProvider {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-3">
        <InputField name="email" label="Email" placeholder="example@gmail.com" type="email" required />
        <InputField name="password" label="Password" placeholder="********" type="password" required />
        <Button className="cool mt-6 h-11! w-full text-sm font-semibold text-white shadow-lg transition-all duration-200" type="submit">
          Login
        </Button>
      </form>
    </FormProvider>
  );
}
