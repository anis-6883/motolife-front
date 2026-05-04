"use client";

import * as TagsInput from "@diceui/tags-input";
import { BadgeInfo, X } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

export default function TagInput({ name, label, placeholder }: { name: string; label: string; placeholder: string }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TagsInput.TagsInputRoot value={value} onValueChange={onChange} className="flex w-full flex-col gap-2" editable>
          <TagsInput.TagsInputLabel className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label} <span className="text-muted-foreground text-xs">(Enter a tag and hit Enter)</span>
          </TagsInput.TagsInputLabel>
          <div className="border-input bg-background dark:focus-within:ring-primary focus-within:ring-primary flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border px-3 py-1 text-sm focus-within:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
            {value?.map((value: string) => (
              <TagsInput.TagsInputItem
                key={value}
                value={value}
                className="cool inline-flex h-7 max-w-[calc(100%-8px)] items-center gap-1.5 rounded-md border px-2.5 text-sm text-white! focus:outline-hidden data-disabled:cursor-not-allowed data-disabled:opacity-50 data-editable:select-none data-editing:bg-transparent data-editing:ring-1 data-editing:ring-zinc-500 dark:data-editing:ring-zinc-400 [&:not([data-editing])]:pr-1.5 [&[data-highlighted]:not([data-editing])]:bg-zinc-200 [&[data-highlighted]:not([data-editing])]:text-black dark:[&[data-highlighted]:not([data-editing])]:bg-zinc-800 dark:[&[data-highlighted]:not([data-editing])]:text-white"
              >
                <TagsInput.TagsInputItemText className="truncate" />
                <TagsInput.TagsInputItemDelete className="h-4 w-4 shrink-0 rounded-sm opacity-70 ring-offset-zinc-950 transition-opacity hover:opacity-100">
                  <X className="h-3.5 w-3.5 text-white" />
                </TagsInput.TagsInputItemDelete>
              </TagsInput.TagsInputItem>
            ))}
            <TagsInput.TagsInputInput
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-hidden placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-zinc-400"
            />
          </div>

          {errors[name] && (
            <p className="text-destructive flex items-center gap-1 text-sm">
              <BadgeInfo className="size-4" />
              {errors[name]?.message as string}
            </p>
          )}
        </TagsInput.TagsInputRoot>
      )}
    />
  );
}
