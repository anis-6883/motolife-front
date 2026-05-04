"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// type PasswordFormValues = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function PasswordChangeModal({ open, setOpen }: PasswordChangeModalProps) {
  // const [loading, setLoading] = useState<boolean>(false);

  // const form = useForm<PasswordFormValues>({
  //   resolver: zodResolver(passwordChangeSchema),
  //   defaultValues: {
  //     oldPassword: "",
  //     newPassword: "",
  //     confirmPassword: "",
  //   },
  // });

  // const onSubmit = async (data: PasswordFormValues) => {
  //   setLoading(true);

  //   const payload = {
  //     oldPassword: data.oldPassword,
  //     newPassword: data.newPassword,
  //     confirmPassword: data.confirmPassword,
  //   };

  //   try {
  //     const response = await updateAdminPassword(payload);

  //     const result = await response.json();

  //     if (!response.status) {
  //       throw new Error(result?.message || "Failed to change password");
  //     }

  //     toast.success(result?.message || "Password changed successfully!");
  //     form.reset();
  //     setOpen(false);
  //   } catch (error: unknown) {
  //     toast.error(
  //       error instanceof Error
  //         ? error.message
  //         : "An error occurred when change password. Please try again."
  //     );
  //   }
  // };

  // const handleCancel = () => {
  //   form.reset();
  //   setOpen(false);
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
          <DialogDescription>Enter your current password and choose a new password</DialogDescription>
        </DialogHeader>

        {/* <Form {...form}>
          <div className="grid gap-4 py-4">
            <PasswordField
              name="oldPassword"
              label="Old Password"
              prefix={<Lock size={16} />}
            />
            <PasswordField
              name="newPassword"
              label="New Password"
              prefix={<Lock size={16} />}
            />
            <PasswordField
              name="confirmPassword"
              label="Confirm Password"
              prefix={<Lock size={16} />}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <CustomButton
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="border-red-500 text-red-500 rounded-[4px] hover:bg-transparent hover:border-red-500 hover:text-red-500"
              >
                Cancel
              </CustomButton>
            </DialogClose>
            <CustomButton
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading}
              className="rounded-[4px]"
              loadingIcon={true}
            >
              {loading ? (
                <span className="flex items-center">
                  Updating
                  <ImSpinner9 className="ml-2 transition-all animate-spin duration-300" />
                </span>
              ) : (
                "Update"
              )}
            </CustomButton>
          </DialogFooter>
        </Form> */}
      </DialogContent>
    </Dialog>
  );
}
