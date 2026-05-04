"use client";

import { replyContact } from "@/actions/admin/help-support/getSupportMail";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { ContactReplyFormValues, contactReplySchema } from "./schema";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContactReply = {
  subject: string;
  message: string;
  createdAt?: string;
};

export type ContactDetail = {
  _id: string;
  fullName: string;
  subject: string;
  message: string;
  email: string;
  phone: string;
  hasReplied: boolean;
  replies: ContactReply[];
  createdAt: string;
  updatedAt: string;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-muted-foreground w-20 shrink-0">{label}</span>
      <span className="text-foreground font-medium">:</span>
      <span className="text-foreground max-w-[calc(100%-10rem)] font-medium text-wrap break-words">{value || "—"}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContactMailView({ contact }: { contact: ContactDetail }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactReplyFormValues>({
    resolver: zodResolver(contactReplySchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (data: ContactReplyFormValues) => {
    setIsSubmitting(true);
    const t = Toast.loading({
      title: "Status",
      description: "Sending reply...",
    });

    try {
      const res = await replyContact(contact._id, data);

      if (res?.data) {
        Toast.remove(t);
        Toast.success({
          title: "Success",
          description: "Reply sent successfully!",
        });
        form.reset();
        router.refresh();
      } else {
        Toast.remove(t);
        Toast.error({
          title: "Failed",
          description: (res as any)?.error || "Failed to send reply.",
        });
      }
    } catch {
      Toast.remove(t);
      Toast.error({
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[870fr_686fr]">
      {/* ── Left Column ── */}
      <div className="flex w-full flex-col gap-4">
        {/* User Details Card */}
        <Card>
          <CardContent>
            <h3 className="text-foreground mb-4 border-b border-gray-100 pb-3 text-base font-semibold dark:border-gray-700">
              User Details
            </h3>
            <div className="flex flex-col gap-3">
              <InfoRow label="Name" value={contact.fullName} />
              <InfoRow label="Phone" value={contact.phone || "—"} />
              <InfoRow label="Email" value={contact.email || "—"} />
            </div>
          </CardContent>
        </Card>

        {/* Message Log Card */}
        <Card>
          <CardContent>
            <h3 className="text-foreground mb-4 border-b border-gray-100 pb-3 text-base font-semibold dark:border-gray-700">Message Log</h3>

            {/* User Message Block */}
            <div className="mb-4">
              <div className="mb-2 rounded-sm bg-sky-50 px-3 py-1.5 dark:bg-sky-900/30">
                <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">{contact.fullName}</span>
              </div>
              <div className="flex flex-col gap-2 px-1">
                <InfoRow label="Subject" value={contact.subject} />
                <InfoRow label="Message" value={contact.message} />
              </div>
            </div>

            {/* Admin Replies Block */}
            <div>
              {contact.replies && contact.replies.length > 0 ? (
                <div className="flex flex-col gap-2 px-1">
                  {contact.replies.map((reply, idx) => (
                    <Fragment key={idx}>
                      <div className="rounded-sm bg-amber-50 px-3 py-1.5 dark:bg-amber-900/20">
                        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Admin</span>
                      </div>
                      <div className="flex flex-col gap-2 px-1">
                        <InfoRow label="Subject" value={reply.subject} />
                        <InfoRow label="Message" value={reply.message} />
                      </div>
                    </Fragment>
                  ))}
                </div>
              ) : (
                <div className="px-1">
                  <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-200 ring-inset dark:bg-red-900/20 dark:text-red-400 dark:ring-red-800">
                    No Reply
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Right Column: Reply Mail Form ── */}
      <div className="flex-1">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-foreground mb-5 text-center text-lg font-semibold">Reply Mail</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
              <InputField
                name="subject"
                label="Subject"
                placeholder="Enter subject"
                type="text"
                required
                disabled={isSubmitting}
                // inputClassName="focus-visible:ring-primary/30 border-gray-200 bg-white text-sm dark:bg-gray-800"
              />

              <InputField
                name="message"
                label="Mail Body"
                placeholder="Please type here"
                type="textarea"
                required
                disabled={isSubmitting}
                inputClassName="h-40"
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="min-w-24 rounded-full"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                >
                  Clear All
                </Button>
                <Button type="submit" variant="black" className="min-w-24 rounded-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
