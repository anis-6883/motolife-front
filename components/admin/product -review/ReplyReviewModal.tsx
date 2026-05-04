"use client";

import { ErrorStr } from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// ─── Schema ───────────────────────────────────────────────────────────────────

const replySchema = z.object({
  reply: z.string().min(1, "Reply is required!").max(500, "Reply must be under 500 characters."),
});

type ReplyFormValues = z.infer<typeof replySchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReplyReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingReply?: string;
  onSubmit: (reply: string) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReplyReviewModal({ open, onOpenChange, existingReply, onSubmit }: ReplyReviewDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: { reply: existingReply ?? "" },
  });

  // Sync existing reply when dialog opens for a different review
  useEffect(() => {
    if (open) {
      reset({ reply: existingReply ?? "" });
    }
  }, [open, existingReply, reset]);

  const replyValue = watch("reply");

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      reset({ reply: existingReply ?? "" });
    }
  };

  const handleFormSubmit = async (data: ReplyFormValues) => {
    try {
      await onSubmit(data.reply);
      onOpenChange(false); // Close directly without calling handleClose
      reset({ reply: existingReply ?? "" });
    } catch {
      // keep dialog open on error so user can retry
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        // Only handle manual closing attempts (when val is false) and not during submission
        if (!val && !isSubmitting) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-xl"
        onInteractOutside={(e) => isSubmitting && e.preventDefault()}
        onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
      >
        <DialogHeader className="pb-2 text-center">
          <DialogTitle className="text-2xl font-bold text-gray-900">Reply to Customer Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Reply field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900">Reply</label>
            <Textarea
              {...register("reply")}
              placeholder="Type from here..."
              rows={7}
              disabled={isSubmitting}
              maxLength={500}
              className="resize-y text-sm placeholder:text-gray-400"
            />
            <div className="flex items-start justify-between">
              {errors.reply ? <ErrorStr message={errors.reply.message} /> : <span />}
              <span className="text-muted-foreground ml-auto text-xs">{replyValue.length}/500</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="rounded-full px-8">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-full bg-gray-900 px-8 hover:bg-gray-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
