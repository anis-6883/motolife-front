"use client";

import { createManager, getManagerById, updateManager } from "@/actions/admin/manager/manager-action";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Role {
  _id: string;
  name: string;
}

interface ManagerFormProps {
  roles: Role[];
  managerId?: string; // ← present on Edit page, absent on Add page
}

interface ImageCredentials {
  fileKey: string;
  publicUrl: string;
  uploaded?: boolean;
}

const emptyCredentials = (): ImageCredentials => ({ fileKey: "", publicUrl: "" });

// ─── Schema ───────────────────────────────────────────────────────────────────

/** Password fields are required on create, optional on edit */
const buildSchema = (isEdit: boolean) =>
  z
    .object({
      name: z.string().min(2, "Full name is required"),
      generalEmail: z.string().email("Invalid email").optional().or(z.literal("")),
      phone: z.string().min(6, "Phone number is required"),
      identityType: z.string().min(1, "Identity type is required"),
      identityNumber: z.string().min(1, "Identity number is required"),
      identityImage: z.string().optional().or(z.literal("")),
      roleId: z.string().min(1, "Manager role is required"),
      image: z.string().optional().or(z.literal("")),
      email: z.string().email("Valid email is required"),
      password: isEdit
        ? z
            .string()
            .optional()
            .or(z.literal(""))
            .refine(
              (val) => {
                if (!val) return true; // allow empty in edit mode
                return val.length >= 6 && /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val);
              },
              {
                message: "Password must be at least 6 characters and include uppercase, lowercase, number, and special character!",
              }
            )
        : z
            .string()
            .min(6, "Password must be at least 6 characters!")
            .max(50, "Password cannot exceed 50 characters!")
            .refine((val) => /[A-Z]/.test(val), {
              message: "Must include at least one uppercase letter!",
            })
            .refine((val) => /[a-z]/.test(val), {
              message: "Must include at least one lowercase letter!",
            })
            .refine((val) => /[0-9]/.test(val), {
              message: "Must include at least one number!",
            })
            .refine((val) => /[^A-Za-z0-9]/.test(val), {
              message: "Must include at least one special character!",
            }),
      confirmPassword: isEdit ? z.string().optional().or(z.literal("")) : z.string().min(1, "Please confirm your password"),
    })
    .refine(
      (d) => {
        // Only validate match when at least one password field is filled (or on create)
        if (!isEdit) return d.password === d.confirmPassword;
        if (d.password || d.confirmPassword) return d.password === d.confirmPassword;
        return true;
      },
      { message: "Passwords do not match", path: ["confirmPassword"] }
    );

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManagerForm({ roles, managerId }: ManagerFormProps) {
  const isEdit = Boolean(managerId);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit); // loading state while fetching existing data

  const [profileCredentials, setProfileCredentials] = useState<ImageCredentials>(emptyCredentials());
  const [identityCredentials, setIdentityCredentials] = useState<ImageCredentials>(emptyCredentials());
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [isIdentityUploading, setIsIdentityUploading] = useState(false);

  const isBusy = isLoading || isProfileUploading || isIdentityUploading || isFetching;

  const schema = buildSchema(isEdit);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      generalEmail: "",
      phone: "",
      identityType: "",
      identityNumber: "",
      identityImage: "",
      roleId: "",
      image: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  // ── Fetch existing manager data on Edit mode ──────────────────────────────
  useEffect(() => {
    if (!isEdit || !managerId) return;

    const fetchManager = async () => {
      try {
        const res = await getManagerById(managerId);

        // Response shape: { data: { status, message, data: {...} } }
        const m = res?.data?.data ?? res?.data;

        if (!m) {
          throw new Error(res?.data?.message ?? "Failed to load manager data");
        }

        // Pre-populate form fields
        reset({
          name: m.name ?? "",
          generalEmail: m.generalEmail ?? "",
          phone: m.phone ?? "",
          identityType: m.identifyType ?? "",
          identityNumber: m.identifyNumber ?? "",
          identityImage: m.identifyImage ?? "",
          roleId: m.role?._id ?? m.role ?? "", // role may be a plain string ID
          image: m.image ?? "",
          email: m.email ?? "",
          password: "",
          confirmPassword: "",
        });

        // Pre-populate image credentials — uploaded:true tells the component to show a preview
        if (m.image) {
          setProfileCredentials({ fileKey: "", publicUrl: m.image, uploaded: true });
        }
        if (m.identifyImage) {
          setIdentityCredentials({ fileKey: "", publicUrl: m.identifyImage, uploaded: true });
        }
      } catch (error: unknown) {
        Toast.error({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load manager.",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchManager();
  }, [managerId, isEdit, reset]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const handleClearAll = () => {
    reset();
    setProfileCredentials(emptyCredentials());
    setIdentityCredentials(emptyCredentials());
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    const description = isEdit ? "Updating manager..." : "Creating manager...";
    const t = Toast.loading({ title: "Status", description });

    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        image: profileCredentials.publicUrl || values.image || "",
        role: values.roleId,
        identifyType: values.identityType,
        identifyNumber: values.identityNumber,
        identifyImage: identityCredentials.publicUrl || values.identityImage || "",
        // Only include password fields when provided
        ...(values.password ? { password: values.password } : {}),
      };

      let res;
      if (isEdit && managerId) {
        res = await updateManager(managerId, payload);
        console.log(res);
      } else {
        res = await createManager({ ...payload, password: values.password! });
      }

      if (!res?.data) {
        const message = "message" in res ? res.message : res.error || `Failed to ${isEdit ? "update" : "create"} manager`;
        throw new Error(message);
      }

      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: `Manager ${isEdit ? "updated" : "created"} successfully!`,
      });

      if (!isEdit) {
        router.push(routes.privateRoutes.admin.userManagement.manager.home ?? "/admin/managers");
      }
    } catch (error: unknown) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error instanceof Error ? error.message : `Failed to ${isEdit ? "update" : "create"} manager.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  // Full-page skeleton while fetching existing manager data
  if (isFetching) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Loading manager data…</p>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          {/* ── Left column ── */}
          <div className="space-y-6">
            {/* General information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-5 text-base font-semibold text-gray-900">General information</h2>

              {/* Row 1: Name, Email, Phone */}
              <div className="grid grid-cols-3 gap-4">
                <SingleImageUpload
                  name="identityImage"
                  label="Identify Image"
                  placeholder="Upload Identify Image"
                  folderName="manager-identity"
                  existingImage={identityCredentials.publicUrl} // ← fixed: was hardcoded ""
                  uploadImageCredentials={identityCredentials}
                  setUploadImageCredentials={setIdentityCredentials}
                  setIsUploading={setIsIdentityUploading}
                  disabled={isBusy}
                  accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
                />
                <div className="flex flex-col gap-4">
                  <InputField required type="text" name="name" label="Full Name" placeholder="Wade Warren" disabled={isBusy} />

                  <InputField
                    required
                    type="select"
                    options={[
                      { label: "NID", value: "nid" },
                      { label: "Passport", value: "passport" },
                    ]}
                    name="identityType"
                    label="Identify Type"
                    placeholder="NID/Passport"
                    disabled={isBusy}
                  />
                  <InputField
                    required
                    className="max-md:hidden"
                    type="select"
                    options={roles.map((role) => ({ label: role.name, value: role._id }))}
                    name="roleId"
                    label="Manager Role"
                    placeholder="Select manager role"
                    disabled={isBusy}
                  />
                </div>
                {/* <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className={`flex overflow-hidden rounded-lg border ${errors.phone ? "border-red-400" : "border-gray-200"} bg-white`}>
                    <div className="flex items-center gap-1.5 border-r border-gray-200 bg-gray-50 px-3 py-2.5">
                      <span className="text-base">🇧🇩</span>
                      <span className="text-sm text-gray-600">+880</span>
                    </div>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="xxxxxxxxx"
                      disabled={isBusy}
                      className="flex-1 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-60"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-[11.5px] text-red-500">{errors.phone.message}</p>}
                </div> */}

                {/* Identity Type */}
                <div className="flex flex-col gap-4">
                  {/* Phone with BD flag */}
                  <InputField
                    required
                    type="phone"
                    name="phone"
                    label="Phone Number"
                    placeholder="xxxxxxxxx"
                    disabled={isBusy}
                    maxLength={10}
                  />
                  {/* <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Identify Type</label>
                  <div className={`relative rounded-lg border ${errors.identityType ? "border-red-400" : "border-gray-200"}`}>
                    <select
                      {...register("identityType")}
                      disabled={isBusy}
                      className="w-full appearance-none rounded-lg bg-white px-3 py-2.5 pr-8 text-sm text-gray-800 outline-none disabled:opacity-60"
                    >
                      <option value="">NID/Passport</option>
                      <option value="nid">NID</option>
                      <option value="passport">Passport</option>
                    </select>
                    <ChevronLeft className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 -rotate-90 text-gray-400" />
                  </div>
                  {errors.identityType && <p className="mt-1 text-[11.5px] text-red-500">{errors.identityType.message}</p>}
                </div> */}

                  <InputField
                    required
                    type="text"
                    name="identityNumber"
                    label="Identify Number"
                    placeholder="Placeholder"
                    disabled={isBusy}
                  />
                  <InputField
                    required
                    className="md:hidden"
                    type="select"
                    options={roles.map((role) => ({ label: role.name, value: role._id }))}
                    name="roleId"
                    label="Manager Role"
                    placeholder="Select manager role"
                    disabled={isBusy}
                  />
                </div>

                {/* <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Manager Role</label>
                  <div className={`relative rounded-lg border ${errors.roleId ? "border-red-400" : "border-gray-200"}`}>
                    <select
                      {...register("roleId")}
                      disabled={isBusy}
                      className="w-full appearance-none rounded-lg bg-white px-3 py-2.5 pr-8 text-sm text-gray-800 outline-none disabled:opacity-60"
                    >
                      <option value="">Select manager role</option>
                      {roles?.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <ChevronLeft className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 -rotate-90 text-gray-400" />
                  </div>
                  {errors.roleId && <p className="mt-1 text-[11.5px] text-red-500">{errors.roleId.message}</p>}
                </div> */}
              </div>
            </div>

            {/* Account Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-5 text-base font-semibold text-gray-900">Account Information</h2>

              <div className="grid grid-cols-3 gap-4">
                <InputField required name="email" label="Email" type="email" placeholder="deanna.curtis@example.com" disabled={isBusy} />

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Password{isEdit && <span className="ml-1 text-xs font-normal text-gray-400">(leave blank to keep current)</span>}
                  </label>
                  <div
                    className={`flex items-center overflow-hidden rounded-lg border ${
                      errors.password ? "border-red-400" : "border-gray-200"
                    } bg-white`}
                  >
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder={isEdit ? "••••••••" : "Placeholder"}
                      disabled={isBusy}
                      className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-60"
                    />
                    <button type="button" onClick={() => setShowPassword((p) => !p)} className="px-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-[11.5px] text-red-500">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div
                    className={`flex items-center overflow-hidden rounded-lg border ${
                      errors.confirmPassword ? "border-red-400" : "border-gray-200"
                    } bg-white`}
                  >
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={isEdit ? "••••••••" : "Placeholder"}
                      disabled={isBusy}
                      className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="px-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-[11.5px] text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column — Profile Image ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 text-base font-semibold text-gray-900">Profile Image</h2>
            <SingleImageUpload
              name="image"
              variant="dropzone"
              label=""
              description="Drag your file or Browse"
              folderName="manager-profile"
              existingImage={profileCredentials.publicUrl} // ← fixed: was missing entirely
              uploadImageCredentials={profileCredentials}
              setUploadImageCredentials={setProfileCredentials}
              setIsUploading={setIsProfileUploading}
              disabled={isBusy}
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
              // allowedRatios={["1:1"]}
              aspect="square"
            />
            {/* <p className="mt-3 text-xs text-gray-400">File size : Max 5 MB Ratio 1:1 (500 x 500 px)</p> */}
            {/* <p className="mt-1 text-xs text-gray-400">Only .jpg, .jpeg, .png, and .webp files allowed.</p> */}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" className="rounded-full px-6" onClick={handleClearAll} disabled={isBusy}>
            Clear All
          </Button>
          <Button type="submit" variant="black" className="rounded-full px-8" disabled={isBusy}>
            {isLoading ? (isEdit ? "Updating..." : "Saving...") : isEdit ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
