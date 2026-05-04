"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";
import { IReview } from "./ReviewsDataTable";

interface ViewReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: IReview | null;
}

export default function ViewReviewModal({ open, onOpenChange, review }: ViewReviewModalProps) {
  if (!review) return null;

  const { product, comboProduct, rating, review: reviewText, reply, customerName, images } = review;
  const productName = product?.name || comboProduct?.name || "N/A";
  const productThumbnail = product?.thumbnail || comboProduct?.thumbnail;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-none max-w-xl overflow-auto p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-xl font-bold">Review Details</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="space-y-6">
            {/* Header style from MarkStockAsDamagedModal */}
            <div className="bg-primary flex flex-col gap-2 rounded-lg border p-4 text-white">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                {productThumbnail ? (
                  <img src={productThumbnail} alt={productName} className="h-12 w-12 rounded-md border border-white/20 object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-md border border-white/20 bg-white/10" />
                )}
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wider text-white/70 uppercase">Product Name</p>
                  <p className="text-base font-semibold text-white">{productName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium tracking-wider text-white/70 uppercase">Customer</p>
                  <p className="text-sm font-semibold">{customerName || "Anonymous"}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium tracking-wider text-white/70 uppercase">Rating</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold">{rating.toFixed(1)}</span>
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="max-h-[450px] pr-4">
              <div className="space-y-6">
                {/* Review section */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-gray-900">Customer Review</h4>
                  <div className="rounded-xl border bg-gray-50/50 p-4 shadow-sm">
                    <p className="text-sm leading-relaxed text-gray-600">
                      {reviewText || <span className="text-gray-400 italic">No review text provided.</span>}
                    </p>
                  </div>
                </div>

                {/* Review Images */}
                {images && images.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-sm font-bold text-gray-900">Review Images</h4>
                    <div className="flex flex-wrap gap-3">
                      {images.map((img, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-lg border bg-white p-1">
                          <img
                            src={img}
                            alt={`Review image ${i + 1}`}
                            className="h-20 w-20 rounded-md object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply section */}
                <div className="space-y-2.5 pb-2">
                  <h4 className="text-sm font-bold text-gray-900">Admin Response</h4>
                  <div
                    className={`rounded-xl border p-4 shadow-sm ${
                      reply ? "border-blue-100 bg-blue-50/30 text-gray-700" : "bg-gray-50/50 text-gray-400 italic"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{reply || "No response has been sent yet."}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
