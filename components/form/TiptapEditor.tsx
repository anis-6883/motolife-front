"use client";

import { Label } from "@/components/ui/label";
import { CoreEditorProps, TiptapProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BadgeInfo, InfoIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  BsTypeBold,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsTypeH4,
  BsTypeH5,
  BsTypeH6,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline,
} from "react-icons/bs";
import { FaListOl, FaListUl } from "react-icons/fa6";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TiptapEditor({
  name,
  value: controlledValue = "",
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  height = 42,
  className,
  labelClassName,
  tooltipContent,
}: TiptapProps) {
  const formContext = useFormContext();
  const hasFormContext = !!formContext && !!name;

  // ── With Form Context ──
  if (hasFormContext) {
    const {
      formState: { errors },
    } = formContext;
    const error = errors[name];

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={name} className="capitalize">
            <span className={cn(labelClassName)}>{label}</span>
            {!required && <span className={cn("text-dark-gray opacity-50", labelClassName)}>(optional)</span>}
            {tooltipContent && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipContent}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </Label>
        )}
        <Controller
          name={name}
          control={formContext.control}
          render={({ field }) => (
            <CoreEditor
              value={field.value || ""}
              onChange={(val) => {
                field.onChange(val);
                onChange?.(val);
              }}
              placeholder={placeholder}
              disabled={disabled}
              height={height}
              className={className}
              isError={error === undefined ? false : !!error?.message}
            />
          )}
        />
        {error && (
          <p className="text-destructive flex items-center gap-1 text-sm">
            <BadgeInfo className="size-4" /> <span>{error.message as string}</span>
          </p>
        )}
      </div>
    );
  }

  // ── Without Form Context ──
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm leading-none font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <CoreEditor
        value={controlledValue}
        onChange={(val) => onChange?.(val)}
        placeholder={placeholder}
        disabled={disabled}
        height={height}
        className={className}
      />
    </div>
  );
}

function CoreEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  disabled = false,
  height = 42,
  className = "",
  isError,
}: CoreEditorProps) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: [
          `h-${height} ${isError && "border-destructive"} w-full rounded-md`,
          "border bg-transparent px-3 py-2",
          "text-sm ring-offset-background focus-visible:outline-none overflow-auto",
          "placeholder:text-muted-foreground",
          disabled ? "cursor-not-allowed opacity-50" : "",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      },
    },
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-4" },
        },
        bulletList: {
          HTMLAttributes: { class: "list-disc pl-4" },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (!editor) return;
    const currentContent = editor.getHTML();
    if (currentContent !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  // Sync disabled state
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  return (
    <div>
      <EditorContent editor={editor} />
      <div className="mt-2">
        {editor && (
          <div className={`flex flex-row flex-wrap items-center gap-2 ${disabled ? "pointer-events-none opacity-50" : ""}`}>
            <div className="flex flex-row items-center gap-1 rounded-md border p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    title="Heading 1"
                    variant={editor.isActive("h1") ? "default" : "outline"}
                    size={"sm"}
                    disabled={!editor?.can().chain().focus().toggleHeading({ level: 1 }).run()}
                    className="border-none shadow-none"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  >
                    <BsTypeH1 className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Heading 1</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={editor.isActive("h2") ? "default" : "outline"}
                    size={"sm"}
                    disabled={!editor?.can().chain().focus().toggleHeading({ level: 2 }).run()}
                    className="border-none shadow-none"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  >
                    <BsTypeH2 className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Heading 2</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={editor.isActive("h3") ? "default" : "outline"}
                    size={"sm"}
                    disabled={!editor?.can().chain().focus().toggleHeading({ level: 3 }).run()}
                    className="border-none shadow-none"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  >
                    <BsTypeH3 className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Heading 3</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={editor.isActive("h4") ? "default" : "outline"}
                    size={"sm"}
                    disabled={!editor?.can().chain().focus().toggleHeading({ level: 4 }).run()}
                    className="border-none shadow-none"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                  >
                    <BsTypeH4 className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Heading 4</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={editor.isActive("h5") ? "default" : "outline"}
                    size={"sm"}
                    disabled={!editor?.can().chain().focus().toggleHeading({ level: 5 }).run()}
                    className="border-none shadow-none"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                  >
                    <BsTypeH5 className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Heading 5</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={editor.isActive("h6") ? "default" : "outline"}
                    size={"sm"}
                    disabled={!editor?.can().chain().focus().toggleHeading({ level: 6 }).run()}
                    className="border-none shadow-none"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                  >
                    <BsTypeH6 className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Heading 6</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex flex-row items-center gap-1 rounded-md border p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={editor.isActive("bold") ? "default" : "outline"}
                    size={"sm"}
                    disabled={!editor?.can().chain().focus().toggleBold().run()}
                    className="border-none shadow-none"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                  >
                    <BsTypeBold className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Bold</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={editor.isActive("italic") ? "default" : "outline"}
                    size={"sm"}
                    disabled={!editor?.can().chain().focus().toggleItalic().run()}
                    className="border-none shadow-none"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                  >
                    <BsTypeItalic className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Italic</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={editor.isActive("underline") ? "default" : "outline"}
                    size={"sm"}
                    disabled={!editor?.can().chain().focus().toggleUnderline().run()}
                    className="border-none shadow-none"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                  >
                    <BsTypeUnderline className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Underline</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={editor.isActive("strike") ? "default" : "outline"}
                    size={"sm"}
                    disabled={!editor?.can().chain().focus().toggleStrike().run()}
                    className="border-none shadow-none"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                  >
                    <BsTypeStrikethrough className="text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Strikethrough</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex flex-row items-center gap-1 rounded-md border p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive("bulletList") ? "default" : "outline"}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={!editor?.can().chain().focus().toggleBulletList().run()}
                    className="border-none shadow-none"
                  >
                    <FaListUl className="text-xl" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Bullet List</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant={editor.isActive("orderedList") ? "default" : "outline"}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
                    className="border-none shadow-none"
                  >
                    <FaListOl className="text-xl" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Ordered List</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
