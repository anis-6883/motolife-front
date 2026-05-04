"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, X } from "lucide-react";

type DeleteConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmModal({
  open,
  title = "Delete this item?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle className="sr-only">Delete Confirmation Modal</DialogTitle>
      <DialogContent className="gap-0 p-0 sm:max-w-md [&>button:first-of-type]:hidden">
        <div className="space-y-6 p-6">
          {/* Header with Icon */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <button onClick={onClose} className="flex-shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" className="px-6" onClick={onClose}>
              {cancelText}
            </Button>
            <Button className="bg-red-600 px-6 hover:bg-red-700" onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
