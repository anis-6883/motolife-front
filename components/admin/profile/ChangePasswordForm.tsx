import { updateAdminPassword } from "@/actions/admin/profile-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFormSheet } from "@/context/FormSheetContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

export default function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { closeSheet } = useFormSheet();

  const formSchema = z
    .object({
      oldPassword: z.string().min(1, "Old password is required!"),
      newPassword: z.string().min(1, "New password is required!"),
      confirmPassword: z.string().min(1, "Confirm password is required!"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match!",
      path: ["confirmPassword"],
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
      message: "New password must be different from old password!",
      path: ["newPassword"],
    });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      oldPassword: "",
    },
  });

  // Form Resetter
  const resetForm = () => {
    closeSheet();
    form.reset({
      newPassword: "",
      confirmPassword: "",
      oldPassword: "",
    });
  };

  // Submit Handler
  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Changing password...",
    });

    try {
      const updatedData: any = {
        ...data,
      };

      const res = await updateAdminPassword(updatedData);

      if ((res as any).error || (res as any).statusCode !== 200) {
        setIsLoading(false);
        Toast.remove(t);
        Toast.error({ title: "Failed", description: (res as any)?.error || (res as any)?.message || "Failed to change password!" });
        return;
      }

      setIsLoading(false);
      Toast.remove(t);
      Toast.success({ title: "Success", description: "Password changed successfully!" });
      resetForm();
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to change password!" });
    }
  };

  return (
    <FormProvider {...form}>
      <div className="mt-4">
        <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
          <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
            <CardContent className="space-y-4">
              <InputField name="oldPassword" label="Old Password" placeholder="Enter old password" type="password" required />
              <InputField
                name="newPassword"
                label="New Password"
                placeholder="Enter new password"
                type="password"
                required
                autoComplete="new-password"
              />
              <InputField
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Enter confirm password"
                type="password"
                required
                autoComplete="new-password"
              />
            </CardContent>
          </Card>

          <div className="mt-5 flex justify-between gap-4 md:justify-end">
            <Button onClick={closeSheet} type="button" variant="outline" disabled={isLoading} className="max-md:px-2">
              Cancel
            </Button>

            <Button className="cool" type="submit" disabled={isLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
