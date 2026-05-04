"use client";

import { createVendor, updateVendor } from "@/actions/user-management/vendor-actions";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { identityTypeOptions, PaymentMethodType, storeCategories } from "@/config/constant";
import routes from "@/config/routes";
import { onError } from "@/lib/client-utils";
import { Vendor } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { baseSchema, createSchema, editSchema } from "./schema";

type FormValues = z.infer<typeof baseSchema> & {
  password?: string;
  confirmPassword?: string;
};

interface VendorManagementFormClientProps {
  vendor?: Vendor;
}

export default function VendorManagementForm({ vendor }: VendorManagementFormClientProps) {
  const { push } = useRouter();
  const isEditMode = !!vendor?._id;
  const [isLoading, setIsLoading] = useState(false);
  const [isNIDOrPassportImageUploading, setIsNIDOrPassportImageUploading] = useState(false);
  const [isTINImageUploading, setIsTINImageUploading] = useState(false);
  const [isBINImageUploading, setIsBINImageUploading] = useState(false);
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [isTradeLicenseImageUploading, setIsTradeLicenseImageUploading] = useState(false);
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);
  const [isLogoImageUploading, setIsLogoImageUploading] = useState(false);
  const [uploadImageCredentials, setUploadImageCredentials] = useState<{
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }>({
    fileKey: "",
    publicUrl: "",
    uploaded: false,
  });

  const form = useForm({
    resolver: zodResolver(isEditMode ? editSchema : createSchema),
    defaultValues: {
      name: vendor?.name || "",
      email: vendor?.email || "",
      phone: vendor?.phone || "",
      password: "",
      confirmPassword: "",
      image: vendor?.image || "",
      manager: {
        name: vendor?.manager?.name || "",
        identityType: vendor?.manager?.identityType || undefined,
        identityNumber: vendor?.manager?.identityNumber || "",
        identityImage: vendor?.manager?.identityImage || "",
      },
      store: {
        storeName: vendor?.store?.storeName || "",
        contactNumber: vendor?.store?.contactNumber || "",
        address: vendor?.store?.address || "",
        description: vendor?.store?.description || "",
        logoImage: vendor?.store?.logoImage || "",
        coverImage: vendor?.store?.coverImage || "",
        storeCategory: vendor?.store?.storeCategory || "",
        tradeLicenseNumber: vendor?.store?.tradeLicenseNumber || "",
        tradeLicenseImage: vendor?.store?.tradeLicenseImage || "",
        nidOrPassportNumber: vendor?.store?.nidOrPassportNumber || "",
        nidOrPassportImage: vendor?.store?.nidOrPassportImage || "",
        tinNumber: vendor?.store?.tinNumber || "",
        tinImage: vendor?.store?.tinImage || "",
      },
      paymentMethods: vendor?.paymentMethods
        ?.filter((p) => p.methodType === PaymentMethodType.BANK)
        .map((bank) => ({
          methodType: "bank" as const,
          bankName: bank.bankName || "",
          branchName: bank.branchName || "",
          accountHolderName: bank.accountHolderName || "",
          accountNumber: bank.accountNumber || "",
          isDefault: bank.isDefault ?? true,
        })) || [
        {
          methodType: "bank" as const,
          bankName: "",
          branchName: "",
          accountHolderName: "",
          accountNumber: "",
          isDefault: true,
        },
      ],
    },
  });
  const ProfileImageinitials =
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
  const nidImageinitials =
    useWatch({
      control: form.control,
      name: "store.nidOrPassportNumber",
      defaultValue: "",
    })
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Logo";
  const managerNidImageinitials =
    useWatch({
      control: form.control,
      name: "manager.identityNumber",
      defaultValue: "",
    })
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Logo";
  const tradeLicenseImageinitials =
    useWatch({
      control: form.control,
      name: "store.tradeLicenseNumber",
      defaultValue: "",
    })
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Logo";
  const shopLogoinitials =
    useWatch({
      control: form.control,
      name: "store.storeName",
      defaultValue: "",
    })
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Logo";
  const shopCoverImageinitials =
    useWatch({
      control: form.control,
      name: "store.storeName",
      defaultValue: "",
    })
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Logo";
  const tinCertificateinitials =
    useWatch({
      control: form.control,
      name: "store.tinNumber",
      defaultValue: "",
    })
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Logo";
  const binImageinitials =
    useWatch({
      control: form.control,
      name: "store.binNumber",
      defaultValue: "",
    })
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Logo";
  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: isEditMode ? "Updating the vendor..." : "Creating the vendor...",
    });

    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: data.image,

        store: {
          storeName: data.store.storeName,
          contactNumber: data.store.contactNumber,
          address: data.store.address,
          description: data.store.description,
          logoImage: data.store.logoImage,
          coverImage: data.store.coverImage,
          storeCategory: data.store.storeCategory,
          tradeLicenseNumber: data.store.tradeLicenseNumber,
          tradeLicenseImage: data.store.tradeLicenseImage,
          nidOrPassportNumber: data.store.nidOrPassportNumber,
          nidOrPassportImage: data.store.nidOrPassportImage,
          tinNumber: data.store.tinNumber,
          tinImage: data.store.tinImage,
        },
        manager: {
          name: data.manager.name,
          identityType: data.manager.identityType,
          identityNumber: data.manager.identityNumber,
          identityImage: data.manager.identityImage,
        },
        paymentMethods: data.paymentMethods.map((bank) => ({
          methodType: "bank",
          bankName: bank.bankName,
          branchName: bank.branchName,
          accountHolderName: bank.accountHolderName,
          accountNumber: bank.accountNumber,
          isDefault: bank.isDefault,
        })),
      };
      if (data.store.binNumber) {
        payload.store.binNumber = data.store.binNumber;
      }
      if (data.store.binImage) {
        payload.store.binImage = data.store.binImage;
      }
      if (!isEditMode || data.password) {
        payload.password = data.password;
      }
      if (isEditMode && vendor?._id) {
        await updateVendor(vendor._id, payload);

        setIsLoading(false);
        Toast.remove(t);
        Toast.success({
          title: "Success",
          description: "Vendor updated successfully!",
        });

        push(routes.privateRoutes.admin.userManagement.vendor.home);
      } else {
        await createVendor(payload);

        setIsLoading(false);
        Toast.remove(t);
        Toast.success({
          title: "Success",
          description: "Vendor created successfully!",
        });

        push(routes.privateRoutes.admin.userManagement.vendor.home);
      }
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || "Failed to vendor operation!",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
            <CardDescription>Provide all mandatory details to create a new vendor profile</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-6 md:grid-cols-2">
              <InputField type="text" name="name" label="Full Name" required className="md:col-span-2" placeholder="Enter Full Name" />
              <InputField
                type="phone"
                name="phone"
                label="Phone Number"
                required
                className="md:col-span-2"
                placeholder="Enter Phone Number"
                maxLength={10}
              />
              <div className="md:col-span-2">
                <InputField
                  required
                  selectTriggerClassName="w-full"
                  type="select"
                  name="store.storeCategory"
                  label="Business Type"
                  placeholder="Enter Business Type"
                  options={storeCategories}
                />
              </div>
              <InputField
                type="text"
                name="store.nidOrPassportNumber"
                label="NID / Passport No."
                required
                placeholder="Enter NID / Passport No."
              />
              <SingleImageUpload
                setIsUploading={setIsNIDOrPassportImageUploading}
                variant="placeholder"
                placeholder="Upload NID / Passport Image"
                fallbackText={nidImageinitials}
                existingImage={vendor?.store?.nidOrPassportImage}
                setUploadImageCredentials={setUploadImageCredentials}
                uploadImageCredentials={uploadImageCredentials}
                name="store.nidOrPassportImage"
                label="NID Image"
                folderName="vendors/nid"
                accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
              />
            </div>

            <SingleImageUpload
              setIsUploading={setIsProfileUploading}
              fallbackText={ProfileImageinitials}
              existingImage={vendor?.image}
              name="image"
              label="Vendor Profile Image"
              avatarSize="h-42 w-42"
              folderName="vendors"
              setUploadImageCredentials={setUploadImageCredentials}
              description="Hint: Circular Shape Image |"
              uploadImageCredentials={uploadImageCredentials}
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Provide the details required for vendor account</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-3">
            <InputField name="email" label="Email Address" type="email" required placeholder="Enter Email Address" />
            {isEditMode ? null : (
              <>
                <InputField name="password" label="Password" type="password" required placeholder="Enter Password" />
                <InputField name="confirmPassword" label="Confirm Password" type="password" required placeholder="Confirm Password" />
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
            <CardDescription>Provide basic shop details below</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-3">
            <InputField name="store.storeName" label="Shop Name" type="text" required placeholder="Enter Shop Name" />
            <InputField
              name="store.contactNumber"
              label="Contact Number"
              type="phone"
              required
              placeholder="Enter Contact Number"
              maxLength={10}
            />
            <InputField name="store.address" label="Address" type="text" required placeholder="Enter Address" />
            <InputField
              required
              name="store.description"
              label="Description"
              type="textarea"
              className="md:col-span-3"
              placeholder="Enter Description"
            />
            <div className="grid gap-6 md:col-span-3 md:grid-cols-2">
              <SingleImageUpload
                setIsUploading={setIsLogoImageUploading}
                variant="dropzone"
                fallbackText={shopLogoinitials}
                existingImage={vendor?.store?.logoImage}
                setUploadImageCredentials={setUploadImageCredentials}
                uploadImageCredentials={uploadImageCredentials}
                name="store.logoImage"
                label="Shop Logo"
                folderName="vendors/shop-logo"
                accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
              />
              <SingleImageUpload
                setIsUploading={setIsCoverImageUploading}
                variant="dropzone"
                fallbackText={shopCoverImageinitials}
                existingImage={vendor?.store?.coverImage}
                setUploadImageCredentials={setUploadImageCredentials}
                uploadImageCredentials={uploadImageCredentials}
                name="store.coverImage"
                label="Shop Cover Image"
                folderName="vendors/shop-cover"
                accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
              />
            </div>
          </CardContent>
        </Card>

        {/* ---------------- Bank Information ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Account Information</CardTitle>
            <CardDescription>Provide bank account details below</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <InputField name="paymentMethods.0.bankName" label="Bank Name" type="text" required placeholder="Enter Bank Name" />
            <InputField name="paymentMethods.0.branchName" label="Branch" type="text" required placeholder="Enter Branch" />
            <InputField
              name="paymentMethods.0.accountHolderName"
              label="Account Holder Name"
              type="text"
              required
              placeholder="Enter Account Holder Name"
            />
            <InputField
              name="paymentMethods.0.accountNumber"
              label="Account Number"
              type="text"
              required
              placeholder="Enter Account Number"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manager Information</CardTitle>
            <CardDescription>Add the contact and identity details of the person managing this vendor account.</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <InputField name="manager.name" label="Manager Name" type="text" placeholder="Enter Manager Name" />
            <InputField
              name="manager.identityType"
              label="Identity Type"
              type="select"
              selectTriggerClassName="w-full"
              placeholder="Enter Identity Type"
              options={identityTypeOptions}
            />
            <InputField name="manager.identityNumber" label="Identity Number" type="text" placeholder="Enter Identity Number" />
            <SingleImageUpload
              setIsUploading={setIsNIDOrPassportImageUploading}
              variant="placeholder"
              placeholder="Upload Identification Image"
              fallbackText={managerNidImageinitials}
              existingImage={vendor?.manager?.identityImage}
              setUploadImageCredentials={setUploadImageCredentials}
              uploadImageCredentials={uploadImageCredentials}
              name="manager.identityImage"
              label="Identification Image"
              folderName="vendors/manager"
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Legal Documents</CardTitle>
            <CardDescription>Upload all mandatory documents</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <InputField
              type="text"
              name="store.tradeLicenseNumber"
              label="Trade License No."
              required
              placeholder="Enter Trade License No."
            />

            <SingleImageUpload
              setIsUploading={setIsTradeLicenseImageUploading}
              variant="placeholder"
              placeholder="Upload Trade License Image"
              fallbackText={tradeLicenseImageinitials}
              existingImage={vendor?.store?.tradeLicenseImage}
              setUploadImageCredentials={setUploadImageCredentials}
              uploadImageCredentials={uploadImageCredentials}
              name="store.tradeLicenseImage"
              label="Trade License Image"
              folderName="vendors/trade-license"
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
            />

            <InputField type="text" name="store.tinNumber" label="TIN Number" required placeholder="Enter TIN Number" />

            <SingleImageUpload
              setIsUploading={setIsTINImageUploading}
              variant="placeholder"
              fallbackText={tinCertificateinitials}
              existingImage={vendor?.store?.tinImage}
              setUploadImageCredentials={setUploadImageCredentials}
              uploadImageCredentials={uploadImageCredentials}
              name="store.tinImage"
              label="TIN Certificate"
              folderName="vendors/tin"
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
            />
            <InputField type="text" name="store.binNumber" label="BIN Number" placeholder="Enter BIN Number" />

            <SingleImageUpload
              setIsUploading={setIsBINImageUploading}
              variant="placeholder"
              fallbackText={binImageinitials}
              existingImage={vendor?.store?.binImage}
              setUploadImageCredentials={setUploadImageCredentials}
              uploadImageCredentials={uploadImageCredentials}
              name="store.binImage"
              label="BIN Certificate"
              folderName="vendors/bin"
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
            />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          <Link href={routes.privateRoutes.admin.userManagement.vendor.home}>
            <Button
              type="button"
              variant="outline"
              disabled={
                isLoading ||
                isProfileUploading ||
                isTradeLicenseImageUploading ||
                isTINImageUploading ||
                isBINImageUploading ||
                isCoverImageUploading ||
                isLogoImageUploading ||
                isNIDOrPassportImageUploading
              }
              className="max-md:px-2"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={
              isLoading ||
              isProfileUploading ||
              isTradeLicenseImageUploading ||
              isTINImageUploading ||
              isBINImageUploading ||
              isCoverImageUploading ||
              isLogoImageUploading ||
              isNIDOrPassportImageUploading
            }
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditMode ? "Update Vendor" : "Create Vendor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
