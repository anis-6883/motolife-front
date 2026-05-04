"use client";

import { deleteReview, updateReview } from "@/actions/admin/product-review/review-action";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { Switch } from "@/components/ui/switch";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Reply, Star } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReplyReviewModal from "./ReplyReviewModal";
import ViewReviewModal from "./ViewReviewModal";
// ─── Types ────────────────────────────────────────────────────────────────────

export interface IReview {
  _id: string;
  product: {
    _id: string;
    name: string;
    thumbnail?: string;
  };
  comboProduct: {
    _id: string;
    name: string;
    thumbnail?: string;
  };
  customerName: string;
  customerImage?: string;
  customerPhone?: string;
  rating: number;
  review: string;
  reply?: string;
  replyBy?: string;
  images?: string[];
  willPublish: boolean;
  softDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface ReviewsDataTableProps {
  data: {
    docs: IReview[];
    pagination: {
      totalDocs: number;
    };
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const truncate = (text: string, max = 55) => (text?.length > max ? text.slice(0, max) + "..." : (text ?? "–"));

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex w-fit items-center gap-1.5 rounded-md border border-amber-100 bg-amber-50 px-2 py-0.5">
      <span className="text-sm font-semibold text-amber-500">{rating.toFixed(1)}</span>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewsDataTable({ data }: ReviewsDataTableProps) {
  const [total, setTotal] = useState(0);
  const [reviewToDelete, setReviewToDelete] = useState<IReview | null>(null);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [publishMap, setPublishMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (data) {
      setTotal(data.pagination?.totalDocs || 0);
      // Seed local publish map from data
      const map: Record<string, boolean> = {};
      data.docs.forEach((r) => {
        map[r._id] = r.willPublish;
      });
      setPublishMap(map);
    }
  }, [data]);

  const onReply = (review: any) => {
    setSelectedReview(review);
    setReplyDialogOpen(true);
  };

  const onViewReview = (review: any) => {
    setSelectedReview(review);
    setViewDialogOpen(true);
  };

  const handleTogglePublish = async (id: string) => {
    const next = !publishMap[id];
    setPublishMap((prev) => ({ ...prev, [id]: next }));
    try {
      await updateReview?.(id, { willPublish: next });
      toast.success("Successfully updated!");
    } catch {
      setPublishMap((prev) => ({ ...prev, [id]: !next }));
    }
  };

  const columns: ColumnDef<IReview>[] = [
    {
      id: "sl",
      header: "SL",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.index + 1}</span>,
    },
    {
      id: "reviewId",
      header: "Review ID",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original._id.slice(-4)}</span>,
    },
    {
      id: "productName",
      header: "Product Name",
      cell: ({ row }) => {
        const { name, thumbnail } = row.original?.product || {};
        const { name: comboName, thumbnail: comboThumb } = row?.original?.comboProduct || {};
        return (
          <div className="flex items-center gap-2">
            {thumbnail || comboThumb ? (
              <img src={thumbnail || comboThumb} alt={name} className="h-8 w-8 rounded-lg border object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-lg border bg-gray-100" />
            )}
            <span className="max-w-[140px] truncate text-sm font-medium">{name || comboName}</span>
          </div>
        );
      },
    },
    {
      id: "productType",
      header: "Product Type",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="max-w-[140px] truncate text-sm font-medium">
              {row?.original?.product?.name ? "General Product" : "Combo Product"}
            </span>
          </div>
        );
      },
    },
    {
      id: "customerName",
      header: "Customer Name",
      cell: ({ row }) => {
        const { customerName, customerImage } = row.original;
        return (
          <div className="flex items-center gap-2">
            {customerImage ? (
              <img src={customerImage} alt={customerName} className="h-8 w-8 rounded-full border object-cover" />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-500">
                {customerName?.charAt(0) ? customerName?.charAt(0) : "A"}
              </div>
            )}
            <span className="max-w-[120px] truncate text-sm font-medium">{customerName ? customerName : "Anonymous"}</span>
          </div>
        );
      },
    },
    {
      id: "rating",
      header: "Rating",
      cell: ({ row }) => <StarRating rating={row.original.rating} />,
    },
    {
      id: "review",
      header: "Review",
      cell: ({ row }) => <span className="text-muted-foreground max-w-[200px] text-sm">{truncate(row.original.review, 40)}</span>,
    },
    {
      id: "reply",
      header: "Reply",
      cell: ({ row }) =>
        row.original.reply ? (
          <span className="text-muted-foreground max-w-[200px] text-sm">{truncate(row.original.reply, 40)}</span>
        ) : (
          <span className="text-muted-foreground text-sm">–</span>
        ),
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm whitespace-nowrap">{format(new Date(row.original.createdAt), "MMM dd, yyyy")}</span>
      ),
    },
    {
      id: "publish",
      header: () => <p className="text-center">Publish</p>,
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <div className="flex justify-center">
            <Switch
              checked={publishMap[id] ?? row.original.willPublish}
              onCheckedChange={() => handleTogglePublish(id)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <p className="text-center">Action</p>,
      cell: ({ row }) => {
        const review = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <ActionButton type="view" tooltip="View Review" onClick={() => onViewReview(review)} />
            {/* Reply — reusing "view" slot with a reply icon override */}
            <ActionButton type="view" tooltip="Reply" icon={<Reply className="h-4 w-4" />} onClick={() => onReply?.(review)} />
            <ActionButton type="delete" tooltip="Delete" onClick={() => setReviewToDelete(review)} />
          </div>
        );
      },
    },
  ];
  return (
    <>
      <PaginationDataTable
        data={data.docs || []}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search by product name.."
        isLoading={false}
        pagination={true}
        total={total}
        filters={[
          {
            key: "sortOrder",
            label: "Sort By",
            options: [
              { label: "New to Old", value: "__all__" },
              { label: "Old to New", value: "asc" },
            ],
          },
          {
            key: "willPublish",
            label: "Publish",
            options: [
              { label: "All", value: "__all__" },
              { label: "Published", value: "true" },
              { label: "Unpublished", value: "false" },
            ],
          },
          {
            key: "rating",
            label: "Rating",
            options: [
              { label: "All", value: "__all__" },
              { label: "5 Star", value: "5" },
              { label: "4 Star", value: "4" },
              { label: "3 Star", value: "3" },
              { label: "2 Star", value: "2" },
              { label: "1 Star", value: "1" },
            ],
          },
        ]}
      />

      <ReplyReviewModal
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
        existingReply={selectedReview?.reply}
        onSubmit={async (reply) => {
          const res = await updateReview(selectedReview?._id || "", { reply });
        }}
      />

      <ViewReviewModal open={viewDialogOpen} onOpenChange={setViewDialogOpen} review={selectedReview} />

      <DeleteModal
        isOpen={!!reviewToDelete}
        title="Delete Review Confirmation!"
        description={
          <span>
            Are you sure you want to delete this review by{" "}
            <span className="text-primary font-semibold">"{reviewToDelete?.customerName}"</span>?
          </span>
        }
        onClose={() => setReviewToDelete(null)}
        onDelete={async () => {
          const response: any = await deleteReview(reviewToDelete?._id || "");
          return { success: !!response?.data, message: response.data.message ?? response.error };
        }}
        deleteButtonText="Delete"
        loadingMessage="Deleting review..."
        successMessage="Review deleted successfully!"
        errorMessage="Failed to delete review!"
      />
    </>
  );
}
