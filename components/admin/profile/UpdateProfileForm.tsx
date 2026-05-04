import { updateAdminProfile } from "@/actions/admin/profile-actions";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFormSheet } from "@/context/FormSheetContext";
import useUserProfile from "@/store/useUserProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

export default function UpdateProfileForm() {
  const { userData, fetchAdminProfileData } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadImageCredentials, setUploadImageCredentials] = useState<{
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }>({
    fileKey: "",
    publicUrl: "",
    uploaded: false,
  });
  const { closeSheet } = useFormSheet();

  const formSchema = z.object({
    name: z.string().min(1, "Profile name is required!"),
    phone: z.string().regex(/^\+?[0-9]+$/, "Phone number can only contain digits"),
    email: z.email("Invalid email address!"),
    image: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      image: "",
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData?.name,
        phone: userData?.phone,
        email: userData?.email,
        image: userData?.image,
      });
    }
  }, [userData, form]);

  // Form Resetter
  const resetForm = () => {
    closeSheet();
    form.reset({
      name: "",
      phone: "",
      email: "",
      image: "",
    });
    setUploadImageCredentials({
      fileKey: "",
      publicUrl: "",
      uploaded: false,
    });
  };

  // Submit Handler
  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: "Updating the profile...",
    });

    try {
      const _updatedProfile: FormValues & { _uploaded?: boolean } = {
        ...data,
      };

      if (uploadImageCredentials?.uploaded) {
        _updatedProfile.image = uploadImageCredentials.publicUrl;
        _updatedProfile._uploaded = true;
      }

      await updateAdminProfile(_updatedProfile);
      await fetchAdminProfileData();
      setIsLoading(false);
      Toast.remove(t);
      Toast.success({ title: "Success", description: "Profile updated successfully!" });
      resetForm();
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to update profile!" });
    }
  };

  const initials =
    useWatch({
      control: form.control,
      name: "name",
      defaultValue: "",
    })
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Logo";

  return (
    <FormProvider {...form}>
      <div className="mt-4">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
            <CardContent className="space-y-4">
              <SingleImageUpload
                setIsUploading={setIsUploading}
                fallbackText={initials}
                existingImage={userData?.image}
                name="admin-image"
                label="Profile Image"
                avatarSize="h-42 w-42"
                folderName="admin"
                uploadImageCredentials={uploadImageCredentials}
                setUploadImageCredentials={setUploadImageCredentials}
                description="Hint: Circular Shape Profile Image |"
                accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
              />
              <InputField name="name" label="Name" placeholder="Enter Profile name" type="text" required />
              <InputField name="email" label="Email" placeholder="Enter Email" type="email" required />
              <InputField name="phone" label="Phone number" placeholder="xxxxxxxxxx" type="phone" required maxLength={10} />
            </CardContent>
          </Card>

          <div className="mt-5 flex justify-between gap-4 md:justify-end">
            <Button onClick={closeSheet} type="button" variant="outline" disabled={isLoading || isUploading} className="max-md:px-2">
              Cancel
            </Button>

            <Button className="cool" type="submit" disabled={isLoading || isUploading}>
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
