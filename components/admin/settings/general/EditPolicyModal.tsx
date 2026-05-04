"use client";

import { addPolicy, updatePolicy } from "@/actions/admin/settings-action";
import SanitizedContent from "@/components/features/public/shared/sanitizeContent";
import InputField from "@/components/form/InputField";
import RichTextPageHeader from "@/components/shared/RichTextPageHeader";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

const policySchema = z.object({
  name: z.string().min(2, "Policy name is required"),
  description: z.string().min(5, "Description is required"),
});

type PolicyFormValues = z.infer<typeof policySchema>;
type Props = {
  viewOnly?: boolean;
  open: boolean;
  onClose: () => void;
  defaultValues?: {
    _id: string;
    name: string;
    description: string;
  };
};

const EditPolicyModal = ({ open, onClose, defaultValues, viewOnly }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!defaultValues;
  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
    },
  });

  const handleSubmit = async (data: PolicyFormValues) => {
    setIsLoading(true);

    const t = Toast.loading({
      title: "Status",
      description: defaultValues ? "Updating policy..." : "Creating policy...",
    });

    try {
      const payload = {
        policies: [
          {
            name: data.name,
            description: data.description,
          },
        ],
      };
      if (isEdit) {
        await updatePolicy(defaultValues?._id, payload);
      } else {
        await addPolicy(data);
      }

      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: "Policy saved successfully!",
      });

      form.reset(data);
      onClose();
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || "Failed to save policy",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="scrollbar-none max-h-[80vh] overflow-y-auto [&>button:first-of-type]:hidden">
        <DialogHeader className={viewOnly ? "hidden" : ""}>
          <DialogTitle className="p-text-24 font-semibold -tracking-[0.24px]">
            {defaultValues ? defaultValues?.name : "Add New Policy"}
          </DialogTitle>
          <DialogDescription className="sr-only">Edit the policy content.</DialogDescription>
        </DialogHeader>
        {viewOnly ? (
          <div className="bg-white">
            <RichTextPageHeader header={defaultValues?.name as string} />

            <SanitizedContent htmlString={defaultValues?.description || ""} />
          </div>
        ) : (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
              <InputField name="name" label="Policy Name" placeholder="Enter policy name" required type="text" />

              <InputField name="description" label="Policy Description" placeholder="Enter policy description" required type="rich-text" />

              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline-black" onClick={() => form.reset()} disabled={isLoading}>
                  Reset
                </Button>

                <Button type="submit" variant="black" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Change"}
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditPolicyModal;
