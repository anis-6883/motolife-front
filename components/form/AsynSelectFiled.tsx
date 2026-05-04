"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BadgeInfoIcon, Check, ChevronDown, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, get, useFormContext } from "react-hook-form";

// ─── Types ────────────────────────────────────────────────
export interface SelectOption {
  value: string;
  label: string;
  image?: string;
  [key: string]: any;
}

export interface LoadOptionsResult {
  options: SelectOption[];
  hasMore: boolean;
}

interface IProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  // loadOptions manages everything internally — search + pagination
  loadOptions: (search: string, page: number) => Promise<LoadOptionsResult>;
  defaultOption?: SelectOption;
  cb?: (val?: any) => any;
  searchPlaceholder?: string;
  hideAllOptionsLoaded?: boolean;
}

// ─── Component ────────────────────────────────────────────
export default function AsyncSelectField({
  name,
  label,
  placeholder = "Select an option",
  required,
  disabled,
  className,
  loadOptions,
  defaultOption,
  cb,
  searchPlaceholder = "Search...",
  hideAllOptionsLoaded = false,
}: IProps) {
  const form = useFormContext();

  // ── Internal State ────────────────────────────────────
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(defaultOption ?? null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef(search); // track latest search for scroll handler

  // Keep searchRef in sync
  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  // ── Initial load when dropdown opens ─────────────────
  useEffect(() => {
    if (open) {
      fetchInitial();
    } else {
      // Reset everything on close
      setSearch("");
      //   setOptions([]);
      setPage(1);
      setHasMore(false);
    }
  }, [open]);

  // ── Fetch first page (fresh load or search) ───────────
  const fetchInitial = async (searchQuery = "") => {
    setIsLoading(true);
    try {
      const result = await loadOptions(searchQuery, 1);
      setOptions(result.options); // replace — intended for fresh load
      setHasMore(result.hasMore);
      setPage(2); // next page will be 2
    } finally {
      setIsLoading(false);
    }
  };

  // ── Fetch next page (append, never replace) ───────────
  const fetchMore = async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const result = await loadOptions(searchRef.current, page);
      setOptions((prev) => [...prev, ...result.options]); // APPEND only
      setHasMore(result.hasMore);
      setPage((p) => p + 1);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // ── Debounced search ──────────────────────────────────
  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchInitial(val); // fresh load with new search — replaces options
    }, 300);
  };

  // ── Native scroll listener via ref ───────────────────
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      if (!hasMore || isLoadingMore) return;
      const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 20;
      if (isAtBottom) fetchMore();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMore, isLoadingMore, page]); // re-attach when these change

  // Cleanup debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  //   useEffect(() => {
  //     if (defaultOption && !selectedOption) setSelectedOption(defaultOption);
  //   }, [defaultOption, selectedOption]);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, formState: { errors } }) => {
        const handleSelect = (option: SelectOption) => {
          field.onChange(field.value === option.value ? "" : option.value);
          setSelectedOption(field.value === option.value ? null : option);
          form.clearErrors(name);
          setOpen(false);
          if (cb) {
            cb(option);
          }
        };

        const handleClear = (e: React.MouseEvent) => {
          e.stopPropagation();
          field.onChange("");
          setSelectedOption(null);
          form.clearErrors(name);
          if (cb) {
            cb();
          }
        };

        return (
          <Field className={cn("gap-1", className)}>
            {label && (
              <FieldLabel>
                <div>
                  {label}
                  {/* {required && <span className="text-destructive ml-0.5">*</span>} */}
                </div>
              </FieldLabel>
            )}

            <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
              {/* ── Trigger ── */}
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  aria-expanded={open}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-all focus:outline-none",
                    "bg-background dark:border-[#2a2a2e] dark:bg-[#18181C]",
                    open && "ring-primary/40 ring-2",
                    !field.value && "text-muted-foreground",
                    disabled && "cursor-not-allowed opacity-50",
                    get(errors, name) && "border-destructive"
                  )}
                >
                  <span className="flex items-center gap-1 truncate">
                    {/* Shows label if found in options, falls back to value itself for edit mode */}
                    {selectedOption?.image && <img src={selectedOption.image} alt="" className="h-6 w-6 rounded bg-slate-300" />}
                    {selectedOption?.label ?? (field.value ? field.value : placeholder)}
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    {field.value && !disabled && (
                      <span
                        role="button"
                        onClick={handleClear}
                        className="text-muted-foreground hover:text-foreground rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <ChevronDown className={cn("text-muted-foreground h-4 w-4 transition-transform duration-200", open && "rotate-180")} />
                  </div>
                </button>
              </PopoverTrigger>

              {/* ── Dropdown ── */}
              <PopoverContent
                className="`w-(--radix-popover-trigger-width) p-0 dark:border-[#2a2a2e] dark:bg-[#18181C]"
                align="start"
                sideOffset={4}
              >
                {/* Search */}
                <div className="border-b px-3 py-2 dark:border-[#2a2a2e]">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder={searchPlaceholder}
                      autoFocus
                      className="bg-background w-full text-sm focus:outline-none dark:bg-[#18181C]"
                    />
                    {isLoading && <Loader2 className="text-muted-foreground h-3.5 w-3.5 shrink-0 animate-spin" />}
                  </div>
                </div>

                {/* List */}
                <div
                  ref={listRef}
                  className="max-h-56 overflow-y-auto overscroll-contain"
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {isLoading && options.length === 0 ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                    </div>
                  ) : options.length === 0 ? (
                    <div className="text-muted-foreground py-6 text-center text-sm">No options found.</div>
                  ) : (
                    options.map((option) => {
                      const isSelected = field.value === option.value;
                      return (
                        <div
                          key={option.value}
                          onClick={() => !option.isDisabled && handleSelect(option)}
                          className={cn(
                            "flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors select-none",
                            "hover:bg-muted/50 dark:hover:bg-[#2a2a2e]",
                            isSelected && "bg-muted/40 font-medium dark:bg-[#2a2a2e]",
                            option.isDisabled && "pointer-events-none opacity-50"
                          )}
                        >
                          <div className="flex items-center gap-1">
                            {option.image && <img src={option.image} alt="" className="h-6 w-6 rounded bg-slate-300" />}
                            <span>{option.label}</span>
                          </div>
                          {isSelected && <Check className="text-primary h-4 w-4 shrink-0" />}
                        </div>
                      );
                    })
                  )}

                  {/* Load more spinner */}
                  {isLoadingMore && (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                    </div>
                  )}

                  {/* All loaded */}
                  {!hasMore && options.length > 0 && !hideAllOptionsLoaded && (
                    <div className="text-muted-foreground border-t py-2 text-center text-xs dark:border-[#2a2a2e]">All options loaded</div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Error */}
            {required && get(errors, name) && (
              <div className="text-destructive flex items-center gap-1">
                <BadgeInfoIcon className="size-4" />
                <FieldError
                  errors={[
                    {
                      message: `${get(errors, name)?.message || "This field is required!"}`,
                    },
                  ]}
                />
              </div>
            )}
          </Field>
        );
      }}
    />
  );
}
