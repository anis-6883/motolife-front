"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import InputField, { ErrorStr } from "@/components/form/InputField";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { createReview } from "@/actions/landing/product-action";
import Toast from "@/components/shared/Toast";
import { onError } from "@/lib/client-utils";
import useUserProfile from "@/store/useUserProfile";
import { ReviewFormSchema, ReviewSchema } from "./schemas";

interface ReviewModalProps {
  open: boolean;
  review?: {
    rating: number;
    text: string;
    user?: string;
    phone?: string;
    images?: string[];
  };
  onClose: () => void;
  productId: string;
  refetch: boolean;
  setRefetch: (refetch: boolean) => void;
  isComboOffer?: boolean;
}

export function ReviewModal({ open, review, onClose, productId, refetch, setRefetch, isComboOffer }: ReviewModalProps) {
  const { userData } = useUserProfile();

  const isEdit = !!review;
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadMultipleImageCredentials, setUploadMultipleImageCredentials] = useState<
    {
      fileKey: string;
      publicUrl: string;
      uploaded?: boolean;
    }[]
  >([]);

  const methods = useForm<ReviewFormSchema>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      review: "",
      customerName: userData?.fullName ?? "",
      // productId: isComboOffer ? undefined : productId,
      // comboProductId: isComboOffer ? productId : undefined,
      ...(isComboOffer ? { comboProductId: productId } : { productId }),
      customerPhone: userData?.phone ?? "",
      images: [],
      // saveInfo: false,
    },
  });

  const { handleSubmit, reset, setValue, watch } = methods;
  const rating = watch("rating");

  useEffect(() => {
    if (review) {
      reset({
        rating: review.rating,
        review: review.text,
        customerName: review.user ?? "",
        customerPhone: review.phone ?? "",
        images: [],
        // saveInfo: false,
        ...(isComboOffer ? { comboProductId: productId } : { productId }),
      });
      if (review.images?.length) {
        setUploadMultipleImageCredentials(review.images.map((url) => ({ fileKey: "", publicUrl: url, uploaded: false })));
      } else {
        setUploadMultipleImageCredentials([]);
      }
    } else {
      reset({
        rating: 0,
        review: "",
        customerName: userData?.fullName ?? "",
        customerPhone: userData?.phone ?? "",
        images: [],
        saveInfo: false,
        ...(isComboOffer ? { comboProductId: productId } : { productId }),
      });
      setUploadMultipleImageCredentials([]);
    }
  }, [review, reset, userData]);
  useEffect(() => {
    if (isComboOffer) {
      methods.register("comboProductId");
      methods.setValue("comboProductId", productId);
    } else {
      methods.register("productId");
      methods.setValue("productId", productId);
    }
  }, [isComboOffer, productId]);
  useEffect(() => {
    if (userData?.fullName) {
      setValue("customerName", userData.fullName);
    }
    if (userData?.phone) {
      setValue("customerPhone", userData.phone);
    }
  }, [userData?.fullName, userData?.phone]);
  const onSubmit = async (data: ReviewFormSchema) => {
    setLoading(true);
    const uploadedImages = uploadMultipleImageCredentials.filter((img) => img.uploaded).map((img) => img.publicUrl);
    const userId = userData?._id;
    const payload = {
      ...data,
      images: uploadedImages,
      ...(userId && { customerId: userId }),
      ...(!userId && { isAnonymous: true }),
    };
    const res = await createReview(payload);
    if ((res as any).error && (res as any).statusCode !== 200) {
      Toast.error((res as any).error);
      setLoading(false);
      return;
    }
    Toast.success("Review submitted successfully");
    onClose();
    setUploadMultipleImageCredentials([]);
    reset({
      rating: 0,
      review: "",
      customerName: userData?.fullName ?? "",
      customerPhone: userData?.phone ?? "",
      images: [],
      saveInfo: false,
      ...(isComboOffer ? { comboProductId: productId } : { productId }),
    });
    setRefetch(!refetch);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-hidden max-md:p-2 sm:max-w-xl md:max-w-3xl [&>button:first-of-type]:hidden">
        <div className="relative">
          <button onClick={onClose} className="absolute top-0 right-0 z-10 flex-shrink-0">
            <X className="size-6" />
          </button>

          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">{isEdit ? "Edit review" : "Add review"}</DialogTitle>
            <p className="text-center text-gray-500">Share your experience with this product.</p>
          </DialogHeader>
          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                handleSubmit(onSubmit, onError)(e);
              }}
              className="mt-4 space-y-6 md:px-5"
            >
              {/* Rating */}
              <div className="space-y-3">
                <label className="block text-center font-semibold">How would you rate this product?</label>

                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue("rating", star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Icons.StarIcon
                        className={cn(
                          "size-10 transition-colors",
                          star <= (hoveredStar || rating) ? "fill-secondary text-secondary" : "text-black"
                        )}
                      />
                    </button>
                  ))}
                </div>
                {methods.formState.errors.rating && (
                  <div className="flex justify-center">
                    <ErrorStr message={methods.formState.errors.rating.message} />
                  </div>
                )}
              </div>

              {/* Review */}
              <InputField
                className="h-30 max-h-30"
                name="review"
                label="Your Review"
                type="textarea"
                placeholder="Write your review here..."
                required
              />

              {/* Images */}
              <InputField
                tooltipContent="Only 10 images are allowed!"
                type="image-multiple"
                label="Upload Image"
                maxNum={10}
                name="images"
                folderName="product-review"
                uploadMultipleImageCredentials={uploadMultipleImageCredentials}
                setUploadMultipleImageCredentials={setUploadMultipleImageCredentials}
              />

              {/* Name */}
              {!userData?.fullName ? <InputField name="customerName" label="Name" placeholder="Simran" type="text" required /> : null}

              {/* Phone */}
              {!userData?.phone ? <InputField name="customerPhone" label="Phone Number" placeholder="+880XXXXXXXXX" type="text" /> : null}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline-black" onClick={onClose} className="px-8">
                  Cancel
                </Button>

                <Button type="submit" className="bg-black px-10 text-white hover:bg-black/90" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : null} {isEdit ? "UPDATE" : "SUBMIT"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
