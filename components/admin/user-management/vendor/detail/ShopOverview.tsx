"use client";
import { getVendorById, updateVendor } from "@/actions/admin/user-management/vendor-actions";
import { ImagePreviewModal } from "@/components/features/public/product-detail/ImagePreviewModal";
import { Icons } from "@/components/icons";
import DeleteModal from "@/components/shared/DeleteModal";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { allRoutes, PaymentMethodType, SellerAccountStatus, SellerVerificationStatus, storeCategories } from "@/config/constant";
import { Vendor } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Globe, MapPin, Package, Phone, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { statusStyles } from "./StyleVariants";

export default function ShopOverview({ id }: { id: string }) {
  const [data, setData] = useState<Vendor | null>(null);
  const [vendorAction, setVendorAction] = useState<"suspend" | "activate" | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<SellerVerificationStatus | null>(null);
  useEffect(() => {
    const fetchVendor = async () => {
      const response = await getVendorById(id);
      setData(response?.data?.data);
    };
    fetchVendor();
  }, [id, vendorAction, verificationStatus]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<{ type: "image" | "youtube"; src: string } | null>(null);

  const handleChangeStatus = async (status?: SellerVerificationStatus, accountStatus?: SellerAccountStatus) => {
    setVerificationStatus(status || null);
    setIsLoading(true);
    const updatedData: { verificationStatus?: SellerVerificationStatus; accountStatus?: string } = {};
    if (status) {
      updatedData.verificationStatus = status;
    }
    if (accountStatus) {
      updatedData.accountStatus = accountStatus;
    }

    const response = await updateVendor(id, updatedData);
    setIsLoading(false);
    return { success: !!response?.data };
  };

  return (
    <>
      <div className="animate-in fade-in slide-in-from-top-2 space-y-3 duration-300 md:space-y-5">
        {/* Shop Header Card */}
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative size-32.5 shrink-0 overflow-hidden rounded-full border-2">
                <ImageWithFallback
                  fallbackSrc="/images/auth/logo.png"
                  src={data?.store?.logoImage}
                  fill
                  alt="Moto Gear BD"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-3">
                  <h2 className="p-text-36 font-bold -tracking-[0.72px] md:leading-12">{data?.store?.storeName}</h2>
                  {data?.verificationStatus === SellerVerificationStatus.REJECTED ? (
                    <span
                      className={cn(
                        "rounded-md border px-3 py-1 text-sm text-white capitalize",
                        statusStyles[SellerAccountStatus.SUSPENDED]
                      )}
                    >
                      Rejected
                    </span>
                  ) : (
                    <span
                      className={`rounded-md border px-3 py-1 text-sm capitalize ${statusStyles[data?.accountStatus as keyof typeof statusStyles]}`}
                    >
                      {data?.accountStatus?.replace(/_/g, " ")}
                    </span>
                  )}
                  {data?.accountStatus !== SellerAccountStatus.INACTIVE &&
                    data?.accountStatus !== SellerAccountStatus.SUSPENDED &&
                    data?.verificationStatus === SellerVerificationStatus.VERIFIED && (
                      <Link href={`${allRoutes.sellerProfile}?vendor=${data?._id}`}>
                        <button className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-50">
                          <Globe size={13} />
                          View on Website
                        </button>
                      </Link>
                    )}
                </div>
                <p className="p-text-18 text-dark-gray mb-3 font-semibold">
                  {storeCategories.find((item) => item.value === data?.store?.storeCategory)?.label}
                </p>
                <div className="p-text-16 flex w-max items-center gap-3 border border-black/40 font-semibold">
                  <div className="flex items-center gap-1.5 px-3 py-1.5">
                    <span className="font-medium">{data?.totalRatings} Ratings</span>
                  </div>
                  <div className="h-4 w-px bg-black/40" />
                  <div className="flex items-center gap-1.5 px-3 py-1.5">
                    <Star size={13} className="fill-transparent" />
                    <span className="font-medium">{data?.averageRating}</span>
                  </div>
                  <div className="h-4 w-px bg-black/40" />
                  <div className="flex items-center gap-1.5 px-3 py-1.5">
                    <span className="font-medium">{data?.totalReviews} Reviews</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {data?.verificationStatus === SellerVerificationStatus.NON_VERIFIED ? (
                <>
                  <Button
                    disabled={loading}
                    className="rounded-full px-10"
                    variant={"outline-primary"}
                    onClick={() => handleChangeStatus(SellerVerificationStatus.REJECTED, SellerAccountStatus.INACTIVE)}
                  >
                    Reject
                  </Button>
                  <Button
                    disabled={loading}
                    className="rounded-full px-10"
                    variant={"black"}
                    onClick={() => handleChangeStatus(SellerVerificationStatus.VERIFIED, SellerAccountStatus.LIVE)}
                  >
                    Verify
                  </Button>
                </>
              ) : data?.accountStatus === SellerAccountStatus.SUSPENDED ? (
                <Button disabled={loading} className="rounded-full px-10" variant={"success"} onClick={() => setVendorAction("activate")}>
                  Activate this vendor
                </Button>
              ) : data?.accountStatus === SellerAccountStatus.LIVE ? (
                <Button disabled={loading} className="rounded-full px-10" variant={"black"} onClick={() => setVendorAction("suspend")}>
                  Suspend this vendor
                </Button>
              ) : (
                <Button disabled={loading} className="rounded-full px-10" variant={"success"} onClick={() => setVendorAction("activate")}>
                  Activate this vendor
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-2 gap-5">
          {/* Vendor Information */}
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="p-text-18 text-dark-gray mb-5 flex items-center gap-2 font-semibold">Vendor Information</h3>
            <div className="mb-5 flex items-center gap-3">
              <div className="relative size-15 overflow-hidden rounded-full border">
                <ImageWithFallback
                  fallbackSrc={data?.image ?? "/images/auth/logo.png"}
                  fill
                  src={data?.image ?? "/images/auth/logo.png"}
                  alt={data?.name ?? "Vendor Image"}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-3.5">
              {[
                { label: "Name", value: data?.name },
                { label: "Phone Number", value: data?.phone },
                { label: "Mail", value: data?.email },
                {
                  label: "NID",
                  value: data?.store?.nidOrPassportNumber,
                  extra: (
                    <button
                      className="p-text-14 flex items-center gap-1 text-blue-500 hover:underline"
                      onClick={() => {
                        setOpenImageModal(true);
                        setMedia({
                          type: "image",
                          src: data?.store?.nidOrPassportImage ?? "/images/auth/logo.png",
                        });
                      }}
                    >
                      <Icons.media className="size-4" />
                      View image
                    </button>
                  ),
                },
              ].map(({ label, value, extra }) => (
                <div key={label} className="p-text-16 flex items-center">
                  <span className="w-28 shrink-0">{label}</span>
                  <span className="mr-3">:</span>
                  <span className="font-semibold">{value}</span>
                  {extra && <span className="ml-3">{extra}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Shop Information */}
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="p-text-18 text-dark-gray mb-5 flex items-center gap-2 font-semibold">Shop Information</h3>
            <div className="p-text-16 space-y-3.5">
              {[
                {
                  label: "Phone",
                  value: data?.store?.contactNumber,
                  icon: <Phone size={12} className="" />,
                },
                {
                  label: "Address",
                  value: data?.store?.address,
                  icon: <MapPin size={12} className="" />,
                },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center">
                  <span className="w-28 shrink-0">{label}</span>
                  <span className="mr-3">:</span>
                  <div className="flex items-center gap-1.5">
                    {icon}
                    <span className="font-medium">{value}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-start">
                <span className="mt-0.5 w-28 shrink-0">Description</span>
                <span className="mt-0.5 mr-3">:</span>
                <p className="leading-relaxed">{data?.store?.description}</p>
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="p-text-18 text-dark-gray mb-5 flex items-center gap-2 font-semibold">Bank Information</h3>
            <div className="p-text-16 space-y-3.5">
              {data?.paymentMethods?.map(({ methodType, ...paymentMethod }) => {
                if (methodType === PaymentMethodType.BANK) {
                  // For BANK methodType
                  const bankPayment = paymentMethod as {
                    bankName: string;
                    accountHolderName: string;
                    branchName: string;
                    accountNumber: string;
                  };
                  return [
                    { label: "Bank Name", value: bankPayment.bankName ?? "" },
                    { label: "Holder Name", value: bankPayment.accountHolderName ?? "" },
                    { label: "Branch", value: bankPayment.branchName ?? "" },
                    { label: "A/C No", value: bankPayment.accountNumber ?? "" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center">
                      <span className="w-28 shrink-0">{label}</span>
                      <span className="mr-3">:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ));
                } else if (
                  methodType === PaymentMethodType.BKASH ||
                  methodType === PaymentMethodType.CASH ||
                  methodType === "rocket" ||
                  methodType === "nagad"
                ) {
                  // For BKASH, CASH, rocket, or nagad methodType
                  const mobilePayment = paymentMethod as { phone: string };
                  return [{ label: "Phone Number", value: mobilePayment.phone }].map(({ label, value }) => (
                    <div key={label} className="flex items-center">
                      <span className="w-28 shrink-0">{label}</span>
                      <span className="mr-3">:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ));
                }
                return null;
              })}
            </div>
          </div>

          {/* Manager Information */}
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="p-text-18 text-dark-gray mb-5 flex items-center gap-2 font-semibold">Manager Information</h3>
            <div className="p-text-16 space-y-3.5">
              {[
                { label: "Manager Name", value: data?.manager?.name },
                { label: "Identification Type", value: data?.manager?.identityType?.toUpperCase() },
                {
                  label: "Identification Number",
                  value: data?.manager?.identityNumber,
                  extra: (
                    <button
                      className="p-text-14 ml-3 flex items-center gap-1 text-blue-500 hover:underline"
                      onClick={() => {
                        setOpenImageModal(true);
                        setMedia({
                          type: "image",
                          src: data?.manager?.identityImage ?? "/images/auth/logo.png",
                        });
                      }}
                    >
                      <Icons.media className="size-4" />
                      View image
                    </button>
                  ),
                },
              ].map(({ label, value, extra }) => (
                <div key={label} className="flex items-center">
                  <span className="w-36 shrink-0">{label}</span>
                  <span className="mr-3">:</span>
                  <span className="font-medium">{value}</span>
                  {extra}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {[
            {
              label: "Total Products",
              value: data?.totalProducts || 0,
              icon: <Package className="text-blue-dark" />,
              color: "border-l-blue-dark",
              bg: "bg-blue-dark/10",
              iconColor: "text-blue-dark/80",
              valueColor: "text-blue-dark",
              link: "Go to Product List",
            },
            {
              label: "Active Products",
              value: data?.activeProducts || 0,
              icon: <Icons.PackageView className="text-green-dark" />,
              color: "border-l-green-dark",
              bg: "bg-green-dark/10",
              iconColor: "text-green-dark/80",
              valueColor: "text-green-dark",
            },
            {
              label: "Total Order",
              value: data?.totalOrders || 0,
              icon: <Icons.TotalRevenue className="text-secondary" />,
              color: "border-l-secondary",
              bg: "bg-secondary/10",
              iconColor: "text-secondary/80",
              valueColor: "text-secondary",
            },
            {
              label: "Total Sales",
              value: data?.totalSales || 0,
              icon: <Icons.MoneyPout className="text-purple-dark" />,
              color: "border-l-purple-dark",
              bg: "bg-purple-dark/10",
              iconColor: "text-purple-dark/80",
              valueColor: "text-purple-dark",
            },
          ].map(({ label, value, icon, bg, iconColor, color, valueColor, link }) => (
            <div key={label} className={`relative overflow-hidden rounded-2xl border border-l-4 bg-white p-5 ${bg} ${color}`}>
              {link && (
                <button className="p-text-14 text-blue-dark absolute top-4 right-4 flex items-center gap-1 leading-5 font-medium hover:underline">
                  {link}
                </button>
              )}
              <div className={`size-15 p-3.5 ${bg} flex items-center justify-center rounded-full ${iconColor} mb-4`}>{icon}</div>
              <div className="flex items-center justify-between">
                <p className="p-text-18 mb-1 font-semibold">{label}</p>
                <p className={`p-text-30 font-bold ${valueColor} tracking-tight`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-dark-gray rounded-2xl border bg-white p-6">
          <h3 className="p-text-24 mb-5 flex items-center gap-2 font-semibold">Vendor Wallet</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                amount: data?.balance || 0,
                label: "Withdraw Balance",
              },
              {
                amount: data?.pendingWithdraws || 0,
                label: "Pending Withdraw",
              },
              //   {
              //     amount: "$1,827.00",
              //     label: "Total Commission Given",
              //   },
              {
                amount: data?.totalWithdrawn || 0,
                label: "Already Withdrawn",
              },
            ].map(({ amount, label }) => (
              <div key={label} className={`rounded-xl border p-5 text-center md:py-14`}>
                <p className={`p-text-36 mb-1 font-bold -tracking-[0.72px]`}>{amount}</p>
                <p className="p-text-18 font-bold md:leading-12">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ImagePreviewModal
        open={openImageModal}
        media={media}
        onClose={() => {
          setOpenImageModal(false);
          setMedia(null);
        }}
      />

      <DeleteModal
        isOpen={!!vendorAction}
        title={vendorAction === "suspend" ? "Suspend Vendor Confirmation!" : "Activate Vendor Confirmation!"}
        description={
          <span>
            Are you sure you want to <span className="text-primary font-semibold">{vendorAction}</span>{" "}
            <span className="text-primary font-semibold">"{data?.store?.storeName}"</span>?
          </span>
        }
        warningNote={
          vendorAction === "suspend"
            ? "The vendor will not be able to sell products while suspended."
            : "The vendor will be able to sell products again."
        }
        deleteButtonText={vendorAction === "suspend" ? "Yes, Suspend" : "Yes, Activate"}
        loadingMessage="Processing..."
        successMessage={vendorAction === "suspend" ? "Vendor suspended successfully!" : "Vendor activated successfully!"}
        errorMessage="Something went wrong!"
        onClose={() => setVendorAction(null)}
        onDelete={async () => {
          if (vendorAction === "suspend") {
            await handleChangeStatus(SellerVerificationStatus.VERIFIED, SellerAccountStatus.SUSPENDED);
          }

          if (vendorAction === "activate") {
            await handleChangeStatus(SellerVerificationStatus.VERIFIED, SellerAccountStatus.LIVE);
          }

          return { success: true };
        }}
      />
    </>
  );
}
