"use client";

// import { updateAdminProfile } from "@/actions/profile/profileActions";
// import { CustomButton } from "@/components/custom/custom-button";
// import InputField from "@/components/form/InputField";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { adminFrontendProfileSchema } from "@/lib/validation-schema";

// type AdminProfilesFormValues = z.infer<typeof adminFrontendProfileSchema>;

interface ProfileChangeModalProps {
  editModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
}

export default function EditProfileModal({ editModalOpen }: ProfileChangeModalProps) {
  // const [loading, setLoading] = useState<boolean>(false);
  // const { data: session } = useSession();
  // const { userData, fetchUserData } = useUserProfile();

  // const token = session?.token;

  // const form = useForm<AdminProfilesFormValues>({
  //   resolver: zodResolver(adminFrontendProfileSchema),
  //   defaultValues: {
  //     name: "",
  //     email: "",
  //   },
  // });

  // profile form when userData is available
  // useEffect(() => {
  //   if (editModalOpen && userData) {
  //     form.reset({
  //       name: userData?.name || "",
  //       email: userData?.email || "",
  //     });
  //     setLoading(false);
  //   }
  // }, [editModalOpen, userData, form]);

  // const onSubmit = async (data: AdminProfilesFormValues) => {
  //   setLoading(true);

  //   const payload = {
  //     name: data.name,
  //   };

  //   try {
  //     const response = await updateAdminProfile(payload);

  //     if (!response.status) {
  //       throw new Error(response?.message || "Failed to update profile");
  //     }

  //     toast.success(response?.message || "Profile Update successfully!");
  //     form.reset();

  //     await fetchUserData(token as string);

  //     setEditModalOpen(false);
  //     setLoading(false);
  //     form.reset();
  //   } catch (error: unknown) {
  //     toast.error(
  //       error instanceof Error
  //         ? error.message
  //         : "An error occurred. Please try again."
  //     );
  //   }
  // };

  // const handleCancel = () => {
  //   form.reset();
  //   setLoading(false);
  //   setEditModalOpen(false);
  // };

  // const handleOpenChange = (open: boolean) => {
  //   if (!open) {
  //     setLoading(false);
  //     form.reset();
  //   }
  //   setEditModalOpen(open);
  // };
  return (
    <Dialog open={editModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>Update Your Profile</DialogDescription>
        </DialogHeader>

        {/* <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <InputField
                name="name"
                label="Name"
                prefix={<User size={16} />}
                rules={{ required: "Required!" }}
              />
              <InputField
                name="email"
                label="Email"
                prefix={<Mail size={16} />}
                className="cursor-not-allowed"
                rules={{ disabled: true }}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="border-red-500 text-red-500 rounded-lg hover:bg-transparent hover:border-red-500 hover:text-red-500"
                >
                  Cancel
                </CustomButton>
              </DialogClose>
              <CustomButton
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading}
                className="rounded-lg"
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
          </form>
        </FormProvider> */}
      </DialogContent>
    </Dialog>
  );
}
