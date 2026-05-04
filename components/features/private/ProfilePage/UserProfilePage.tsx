"use client";

import { updateCustomerProfile } from "@/actions/customer/profile-actions";
import { ErrorStr } from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUserProfile from "@/store/useUserProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { DeleteConfirmModal } from "../../public/shared/DeleteConfirmationModal";
import PhoneUpdateCard from "./PhoneUpdateCard";
import { ProfileFormValues, profileSchema } from "./schema";

const UserProfilePage = () => {
  const { userData, fetchCustomerProfileData, clearUserData } = useUserProfile();
  const [uploadImageCredentials, setUploadImageCredentials] = useState<{
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }>({
    fileKey: "",
    publicUrl: "",
    uploaded: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userData?.fullName || "",
      // email: userData?.email || null,
      image: userData?.image || "/images/sample-data-images/userProfile.png",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentState = (searchParams.get("mode") as "edit" | "view") || "view";

  const handleModeChange = (newMode: "edit" | "view") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", newMode);
    router.replace(`?${params.toString()}`, { scroll: true });
  };
  const fields: { label: string; key: keyof typeof userData }[] = [
    { label: "Full Name", key: "fullName" },
    { label: "Email Address", key: "email" },
    { label: "Phone Number", key: "phone" },
  ];
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = methods;

  useEffect(() => {
    methods.reset({
      fullName: userData?.fullName || "",
      // email: userData?.email || null,
      image: userData?.image || "/images/sample-data-images/userProfile.png",
    });
  }, [userData]);

  const handleLogout = async () => {
    await signOut({ redirect: true });
    Toast.success({ title: "Success", description: "Logout Successfully!" });
    clearUserData();
  };
  const onSubmit = async (data: ProfileFormValues) => {
    const updatedProfile: ProfileFormValues & { _uploaded?: boolean } = { ...data };
    if (uploadImageCredentials?.uploaded) {
      updatedProfile.image = uploadImageCredentials.publicUrl;
      updatedProfile._uploaded = true;
    }

    const res = await updateCustomerProfile(updatedProfile);
    if ((res as any).statusCode === 200 || (res as any).statusCode === 201 || (res as any).error === null) {
      fetchCustomerProfileData();
      handleModeChange("view");
      if (uploadImageCredentials?.uploaded) {
        useUserProfile.getState().setUserData({
          ...userData,
          image: uploadImageCredentials.publicUrl,
        });
      }
    } else {
      return;
    }
  };

  const initials =
    useWatch({
      control: methods.control,
      name: "fullName",
      defaultValue: "",
    })
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Logo";

  return (
    <>
      {currentState === "view" ? (
        <div className="mx-auto rounded-lg border bg-white p-3 md:p-6">
          <div className="flex justify-between">
            <h2 className="p-text-24 mb-2 font-semibold max-md:text-base md:mb-4 xl:mb-8">Personal Information</h2>
            {currentState === "view" ? (
              <Button
                onClick={() => handleModeChange("edit")}
                className="border-blue-dark hover:bg-blue-dark text-blue-dark border bg-white hover:text-white"
              >
                <Edit3 />
                Edit
              </Button>
            ) : null}
          </div>
          <div className="animate-in fade-in slide-in-from-top-2 flex gap-6 duration-300">
            <div className="relative size-20 overflow-hidden rounded-full md:size-30 lg:size-41">
              <ImageWithFallback
                fallbackSrc="/images/auth/logo.png"
                src={userData?.image}
                alt="User avatar"
                fill
                className="object-cover"
              />
            </div>
            <div className="grid flex-1 lg:grid-cols-2">
              {fields.map(
                (field, index) =>
                  userData?.[field.key] &&
                  field.key !== "email" && (
                    <div key={index}>
                      <p className="p-text-16 text-light-gray leading-6">{field.label}</p>
                      <p className="p-text-20 font-semibold">{userData[field.key]}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto rounded-lg border bg-white p-3 md:p-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="gap-8 max-lg:space-y-4">
                <h2 className="p-text-24 mb-2 font-semibold max-md:text-base md:mb-4 xl:mb-8">Personal Information</h2>
                <SingleImageUpload
                  setIsUploading={setIsUploading}
                  fallbackText={initials}
                  existingImage={userData?.image}
                  name="image"
                  label="Profile Image"
                  avatarSize="h-42 w-42"
                  folderName="customers"
                  uploadImageCredentials={uploadImageCredentials}
                  setUploadImageCredentials={setUploadImageCredentials}
                  description="Hint: Circular Shape Profile Image |"
                  accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
                />
                <div className="space-y-2 pt-5 md:space-y-4 md:pt-8 lg:pt-10 xl:space-y-5">
                  <div className="grid gap-2 md:gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        <span className="p-text-16 leading-6">Full Name</span>
                      </Label>
                      <Input className="2xl:h-11" id="fullName" {...register("fullName")} placeholder="Write your Full Name" />
                      {errors.fullName && <ErrorStr message={errors.fullName.message} />}
                    </div>

                    {/* <div className="space-y-2">
                    <Label htmlFor="lastName">
                      <span className="p-text-16 leading-6">
                        Last Name <span className="text-gray-400">(optional)</span>
                      </span>
                    </Label>
                    <Input className="2xl:h-11" id="lastName" {...register("lastName")} placeholder="Write your last name" />
                  </div> */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="email">
                        <span className="p-text-16 leading-6">Email</span>
                      </Label>
                      <Input className="2xl:h-11" id="email" {...register("email")} placeholder="Write your email" />
                      {errors.email && <ErrorStr message={errors.email.message} />}
                    </div> */}
                  </div>

                  <div className="flex items-center justify-end">
                    <Button className="px-14 2xl:h-11" disabled={!isDirty || isSubmitting || isUploading}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save changes
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      )}
      {currentState === "edit" && <PhoneUpdateCard onSuccess={() => handleModeChange("view")} />}

      {!!userData ? (
        <div className="flex justify-end pt-4 md:hidden">
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="group border-destructive/40 text-destructive hover:border-destructive hover:bg-destructive/8 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.97]"
          >
            <LogOut className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
            Log out
          </button>
        </div>
      ) : null}
      <DeleteConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => handleLogout()}
        title="Logout"
        description="Are you sure you want to Logout?"
        confirmText="Logout"
      />
    </>
  );
};

export default UserProfilePage;
