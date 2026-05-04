"use client";
import { DateTimePicker, DateTimePickerProps } from "@/components/ui/datetime-picker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { BadgeInfo } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

interface IProps extends DateTimePickerProps {
  name: string;
  label: string;
  required?: boolean;
}

export default function FormDatetimePicker({ name, label, required, onChange, ...props }: IProps) {
  const form = useFormContext();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="gap-0.5">
          <FieldLabel htmlFor={name} className="flex gap-2 font-semibold capitalize">
            <span>{label}</span>
            {!required && <span className="text-dark-gray text-sm font-normal opacity-50">(optional)</span>}
          </FieldLabel>
          <DateTimePicker
            value={field.value ? new Date(field.value) : undefined}
            onChange={(date) => {
              const isoString = date ? date.toISOString() : null;
              field.onChange(isoString);
              if (onChange) {
                onChange(date);
              }
            }}
            granularity="minute"
            hourCycle={12}
            yearRange={10}
            displayFormat={{ hour12: "dd/MM/yyyy hh:mm a" }}
            placeholder="dd/mm/yyyy --:-- --"
            {...props}
          />
          {fieldState.invalid && (
            <div className="flex items-center gap-1">
              <BadgeInfo className="size-4" />
              <FieldError errors={[fieldState.error]} />
            </div>
          )}
        </Field>
      )}
    />
  );
}
