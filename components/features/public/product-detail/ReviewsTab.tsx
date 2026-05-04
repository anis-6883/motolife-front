"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import formatDateToDateString from "@/lib/client-utils";
import { IReviewP } from "@/lib/types";
import useUserProfile from "@/store/useUserProfile";
import { DeleteConfirmModal } from "../shared/DeleteConfirmationModal";
import { PaginationSection } from "../shared/PaginationSection";
import StarsComp from "../shared/Stars";
import { ReviewModal } from "./EditReviewModal";

export type ReviewMedia = { type: "image"; src: string } | { type: "video"; youtubeId: string; title?: string; description?: string };

// Unified media modal
interface MediaPreviewModalProps {
  open: boolean;
  media: ReviewMedia | null;
  onClose: () => void;
}

export function MediaPreviewModal({ open, media, onClose }: MediaPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="aspect-650/449 overflow-hidden p-0 sm:max-w-xl [&>button]:hidden">
        <DialogHeader className="sr-only border-b pb-4">
          <DialogTitle>Media Preview</DialogTitle>
        </DialogHeader>

        {media?.type === "image" && (
          <ImageWithFallback
            fallbackSrc="/images/auth/logo.png"
            src={media.src}
            alt="Review media"
            fill
            className="size-full object-contain"
          />
        )}

        {media?.type === "video" && (
          <div className="relative aspect-video w-full bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${media.youtubeId}?autoplay=1`}
              title={media.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ReviewsTab({
  reviews,
  setPage,
  totalPages,
  reviewCount,
  productId,
  currentPage,
  refetch,
  setRefetch,
  isComboOffer,
}: {
  reviews: IReviewP[];
  setPage: (page: number) => void;
  totalPages: number;
  reviewCount: number;
  productId: string;
  currentPage: number;
  refetch: boolean;
  setRefetch: (refetch: boolean) => void;
  isComboOffer?: boolean;
}) {
  const { userData } = useUserProfile();
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [selectedMedia, setSelectedMedia] = useState<ReviewMedia | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-y-2 pb-1 max-md:flex-col md:pb-4">
        <div className="flex gap-2">
          <StarsComp rating={5} outlineColor="text-secondary" />
          <p className="p-text-14 leading-5 font-medium text-black">{reviewCount > 0 ? `(${reviewCount} reviews)` : "No reviews yet"}</p>
        </div>
        {!!userData ? (
          <Button
            onClick={() => {
              setSelectedReview(null);
              setEditOpen(true);
            }}
            variant="outline"
            className="border-black uppercase max-md:w-full"
          >
            Write a review
          </Button>
        ) : null}
      </div>
      {/* Reviews */}
      <div>
        {reviews?.map((review) => (
          <div key={review._id} className="py-3">
            <div className="flex items-start gap-3">
              <Avatar className="size-10">
                <AvatarImage src={review.customerImage ?? "/images/placeholders/userPlaceholder.jpg"} />
                <AvatarFallback>{review.customerName}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                {/* Header + Dropdown */}
                <div className="flex w-full justify-between">
                  <h4 className="p-text-16 leading-5 font-semibold text-black">
                    {review.customerName.length > 0 ? review.customerName : "Anonymous"}
                  </h4>
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedReview(review);
                          setEditOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-3 w-3" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setSelectedReview(review);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-3 w-3" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </div>

                {/* Rating + Date */}
                <div className="flex justify-between max-md:flex-col max-md:justify-center md:pb-3">
                  <div className="flex gap-0.5">
                    <StarsComp rating={review?.rating} outlineColor="text-secondary" />
                    {/* {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`!size-4 ${i < review.rating ? "fill-secondary text-secondary" : "text-gray-200"}`} />
                    ))} */}
                  </div>
                  <span className="p-text-14 text-dark-gray leading-5 font-medium">{formatDateToDateString(review.createdAt)}</span>
                </div>

                {/* Text */}
                <p className="p-text-16 pb-2">{review.review}</p>

                {/* Media */}
                {review.images && (
                  <div className="flex flex-wrap gap-2">
                    {review.images.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedMedia({ src: item, type: "image" });
                          setModalOpen(true);
                        }}
                        className="group relative size-16 cursor-pointer overflow-hidden rounded-lg border md:size-12.5"
                      >
                        {/* {item.type === "image" ? ( */}
                        <ImageWithFallback src={item} fallbackSrc="/images/auth/logo.png" alt="" fill className="object-cover" />
                        {/* // ) : (
                        //   <>
                        //     <img
                        //       src={getYoutubeThumbnail(item.youtubeId || "")}
                        //       alt={item.title || "Video"}
                        //       className="h-full w-full object-cover"
                        //     />
                        //     <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                        //       <div className="flex size-8 items-center justify-center rounded-full bg-white text-black">▶</div>
                        //     </div>
                        //   </>
                        // )} */}
                      </div>
                    ))}
                  </div>
                )}

                {/* Review Reply */}
                {review.reply && review.replyBy ? (
                  <div className="mt-4 w-full gap-3 border-l-2 bg-gray-50 p-3 pl-4">
                    <div className="flex items-center gap-2">
                      {/* <Avatar className="size-8">
                        <AvatarImage src={review.replyBy.storeLogo} />
                        <AvatarFallback>{review.replyBy.storeName}</AvatarFallback>
                      </Avatar> */}
                      <div className="relative size-8 overflow-hidden rounded-full">
                        <ImageWithFallback
                          src={review.replyBy.storeLogo}
                          fallbackSrc="/images/placeholders/userPlaceholder.jpg"
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex max-md:flex-col max-md:justify-center md:items-center md:justify-between md:gap-2">
                          <p className="p-text-16 flex items-center gap-1 leading-5 font-semibold text-black">
                            {review.replyBy.storeName}{" "}
                            {/* {review.replyBy.isSellerVerified && <BadgeCheck className="fill-blue-dark size-5! text-white" />} */}
                          </p>
                          <span className="p-text-14 text-dark-gray leading-5 font-medium">{formatDateToDateString(review.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="p-text-14 mt-1">{review.reply}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {Number(totalPages) > 1 && (
        <div className="pt-10 md:pt-16 lg:pt-20">
          <PaginationSection
            currentPage={currentPage}
            totalItems={reviewCount}
            totalPages={Number(totalPages)}
            startIndex={(currentPage - 1) * reviews.length + 1}
            endIndex={(currentPage - 1) * reviews.length + reviews.length}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      )}
      {/* Modals */}
      <MediaPreviewModal open={modalOpen} media={selectedMedia} onClose={() => setModalOpen(false)} />
      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => setDeleteOpen(false)}
        title="Delete Review"
        description="Are you sure you want to delete the review?"
        confirmText="Delete Review"
      />
      <ReviewModal
        isComboOffer={isComboOffer}
        open={editOpen}
        review={selectedReview}
        onClose={() => setEditOpen(false)}
        productId={productId}
        refetch={refetch}
        setRefetch={setRefetch}
      />
    </div>
  );
}
