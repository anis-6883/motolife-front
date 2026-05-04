"use client";

import Toast from "@/components/shared/Toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type DeleteModalProps = {
  isOpen: boolean;
  title: string;
  description?: string | React.ReactNode;
  warningNote?: string;
  onClose: () => void;
  onDelete: () => Promise<{ success: boolean; message?: string }>;
  deleteButtonText?: string;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
};

export default function DeleteModal({
  isOpen,
  title,
  description,
  warningNote,
  onClose,
  onDelete,
  deleteButtonText = "Delete",
  loadingMessage = "Deleting...",
  successMessage = "Deleted successfully!",
  errorMessage = "Failed to delete!",
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const t = Toast.loading({
      title: "Status",
      description: loadingMessage,
    });

    try {
      setIsDeleting(true);

      const response = await onDelete();

      Toast.remove(t);

      if (!response?.success) {
        Toast.error({
          title: "Failed",
          description: response?.message || errorMessage,
        });
        setIsDeleting(false);
        return;
      }

      Toast.success({
        title: "Success",
        description: response?.message || successMessage,
      });

      setIsDeleting(false);
      onClose();
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || errorMessage,
      });
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
          {warningNote && <span className="text-primary text-sm">{warningNote}</span>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button className="cool max-md:px-2" type="button" disabled={isDeleting} onClick={handleDelete}>
            {deleteButtonText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
