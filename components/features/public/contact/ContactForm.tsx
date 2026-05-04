"use client";

import { sendContactMessage } from "@/actions/customer/contact-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { contactFormSchema, ContactFormValues } from "./schema";

const DEFAULT_VALUES: ContactFormValues = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const ContactForm = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = async (data: ContactFormValues) => {
    const t = Toast.loading({
      title: "Status",
      description: "Sending message...",
    });

    try {
      const res = await sendContactMessage(data);

      if (res.error) {
        throw new Error(res.error);
      }

      Toast.remove(t);
      Toast.success({
        title: "Success",
        description: "Your message has been sent successfully!",
      });

      form.reset(DEFAULT_VALUES);
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({
        title: "Failed",
        description: error?.message || "Something went wrong!",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <InputField
          name="fullName"
          label="Full Name"
          placeholder="Write your name here"
          type="text"
          required
          inputClassName="focus-visible:border-primary!"
        />

        <div className="flex gap-2 max-md:flex-col">
          {/* Phone */}
          <InputField
            name="phone"
            label="Phone Number"
            type="text"
            placeholder="Write your Phone Number here"
            className="flex-1"
            required
            inputClassName="focus-visible:border-primary!"
          />
          {/* Email */}
          <InputField
            name="email"
            label="Email"
            type="email"
            placeholder="Write your email address here"
            className="flex-1"
            required
            inputClassName="focus-visible:border-primary!"
          />
        </div>

        {/* Subject */}
        <InputField
          name="subject"
          label="Subject"
          placeholder="Write your subject here"
          type="text"
          required
          inputClassName="focus-visible:border-primary!"
        />

        {/* Message */}
        <InputField
          name="message"
          label="Message"
          placeholder="Write if you have any message for us"
          type="textarea"
          rowCount={6}
          required
          inputClassName="focus-visible:border-primary!"
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="border border-black bg-transparent px-8 py-5 text-sm text-black transition-colors hover:bg-black hover:text-white"
        >
          {form.formState.isSubmitting ? "SENDING..." : "SEND MESSAGE"}
          <ArrowUpRight />
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
