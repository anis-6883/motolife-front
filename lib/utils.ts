import { ColumnDef } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { InputObject } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dateFormat = (date: moment.MomentInput, format: string = "MMM DD, YYYY hh:mm A"): string => {
  return moment(date).format(format);
};

export const isRouteActive = (pathname: string, url: string) => {
  const current = pathname.split("/").filter(Boolean);
  const target = url.split("/").filter(Boolean);

  // Dashboard must match EXACTLY
  if (url === "/admin/dashboard") {
    return pathname === url;
  }

  // Exact match
  if (target.length === current.length) {
    return target.every((seg, i) => seg === current[i]);
  }

  // Section match (products -> products/edit/123)
  return target.length < current.length && target.every((seg, i) => seg === current[i]);
};

export type NestedRoutes = string | { [key: string]: NestedRoutes | ((...args: any[]) => string) };

export function extractRoutes(obj: NestedRoutes): string[] {
  const links: string[] = [];

  for (const value of Object.values(obj as Record<string, NestedRoutes>)) {
    if (typeof value === "string") {
      links.push(value);
    } else if (typeof value === "function") {
      // skip functions because we cannot statically extract dynamic route
      continue;
    } else if (typeof value === "object" && value !== null) {
      links.push(...extractRoutes(value));
    }
  }

  return links;
}

export function removeColumnsByKeys<T>(columns: ColumnDef<T>[], keysToRemove: string[]): ColumnDef<T>[] {
  return columns.filter((column) => {
    if ("accessorKey" in column && column.accessorKey) {
      return !keysToRemove.includes(column.accessorKey as string);
    }

    if ("id" in column && column.id) {
      return !keysToRemove.includes(column.id);
    }

    return true;
  });
}

export const generateSlug = (text: string): string => {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  const suffix = Array.from({ length: 15 }, () => Math.random().toString(36)[2])
    .join("")
    .toUpperCase();

  return `${slug}-${suffix}`;
};

export function generateUniqueSKU(productName: string, variant?: string, maxLength = 30): string {
  const normalize = (value: string) =>
    value
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.slice(0, 3));

  const baseParts = normalize(productName);
  const variantParts = variant ? normalize(variant) : [];

  // Always reserve space for suffix (-XXXXXXXXXXXX)
  const suffix = Array.from({ length: 12 }, () => Math.random().toString(36)[2])
    .join("")
    .toUpperCase();

  const reservedLength = suffix.length + 1; // +1 for dash
  const maxBodyLength = maxLength - reservedLength;

  const skuParts: string[] = [];

  const pushParts = (parts: string[]) => {
    for (const part of parts) {
      const nextLength = skuParts.join("-").length + (skuParts.length ? 1 : 0) + part.length;

      if (nextLength > maxBodyLength) break;
      skuParts.push(part);
    }
  };

  pushParts(baseParts);
  pushParts(variantParts);

  return `${skuParts.join("-")}-${suffix}`;
}

export function getYouTubeThumbnail(url: string): string | null {
  if (!url) return null;

  try {
    // Normalize URL (handles missing protocol like "youtube.com/...")
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    const parsedUrl = new URL(url);

    let videoId: string | null = null;

    // 1. youtu.be/<id>
    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.split("/")[1];
    }

    // 2. youtube.com/watch?v=<id>
    else if (parsedUrl.searchParams.get("v")) {
      videoId = parsedUrl.searchParams.get("v");
    }

    // 3. /embed/<id>
    // 4. /shorts/<id>
    // 5. /live/<id>
    else {
      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

      const possibleIndex = pathSegments.findIndex((segment) => ["embed", "shorts", "live"].includes(segment));

      if (possibleIndex !== -1 && pathSegments[possibleIndex + 1]) {
        videoId = pathSegments[possibleIndex + 1];
      }
    }

    // Final validation (must be 11 chars)
    if (!videoId || videoId.length !== 11) return null;

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  } catch {
    return null;
  }
}

export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  try {
    // Normalize URL (handles missing protocol like "youtube.com/...")
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    const parsedUrl = new URL(url);

    let videoId: string | null = null;

    // 1. youtu.be/<id>
    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.split("/")[1];
    }

    // 2. youtube.com/watch?v=<id>
    else if (parsedUrl.searchParams.get("v")) {
      videoId = parsedUrl.searchParams.get("v");
    }

    // 3. /embed/<id>
    // 4. /shorts/<id>
    // 5. /live/<id>
    else {
      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

      const possibleIndex = pathSegments.findIndex((segment) => ["embed", "shorts", "live"].includes(segment));

      if (possibleIndex !== -1 && pathSegments[possibleIndex + 1]) {
        videoId = pathSegments[possibleIndex + 1];
      }
    }

    // Final validation (must be 11 chars)
    if (!videoId || videoId.length !== 11) return null;

    return videoId;
  } catch {
    return null;
  }
}

export function apiResponse<T = undefined>(status: boolean, statusCode: number = 200, message: string, data?: T, pagination?: T) {
  return NextResponse.json(
    {
      status,
      message,
      data,
      pagination,
    },
    { status: statusCode }
  );
}

export function debounce<TFunction extends (...args: never[]) => unknown>(
  func: TFunction,
  wait: number
): (...args: Parameters<TFunction>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: unknown, ...args: Parameters<TFunction>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
export const getPrice = (variant: any, product: any) => {
  if (variant) {
    const hasDiscount = (variant.hasDiscount || variant.discountValue > 0) && variant.discountPrice > 0;

    return {
      price: hasDiscount ? variant.discountPrice : variant.variantPrice,
      originalPrice: hasDiscount ? variant.variantPrice : undefined,
    };
  }

  const hasDiscount = (product?.hasDiscount || product?.discountValue > 0) && product?.discountPrice > 0;

  return {
    price: hasDiscount ? product.discountPrice : product.sellingPrice,
    originalPrice: hasDiscount ? product.sellingPrice : undefined,
  };
};

export function removeEmptyValues(obj: InputObject, removeKeys: string[] = []) {
  const newObj: any = {};

  // Copy non-empty values to newObj
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
        newObj[key] = obj[key];
      }
    }
  }

  // Remove specified keys
  if (removeKeys.length > 0) {
    for (const key of removeKeys) {
      delete newObj[key];
    }
  }

  return newObj;
}

export function formatCompact(num: number | undefined, decimals: number = 2): string {
  if (!num) return "0";

  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  const tiers = [
    { threshold: 1_000_000_000_000, suffix: "T" },
    { threshold: 1_000_000_000, suffix: "B" },
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 1_000, suffix: "K" },
  ];

  for (const { threshold, suffix } of tiers) {
    if (abs >= threshold) {
      const raw = abs / threshold;
      const rounded = parseFloat(raw.toFixed(decimals));
      // const fraction = parseFloat((rounded % 1).toFixed(decimals));
      // return {
      //   formatted: `${sign}${rounded}${suffix}`,
      //   value: num,
      //   suffix,
      //   fraction,
      // };
      return `${sign}${rounded}${suffix}`;
    }
  }

  // return {
  //   formatted: `${num}`,
  //   value: num,
  //   suffix: "",
  //   fraction: parseFloat((Math.abs(num) % 1).toFixed(decimals)),
  // };
  return `${num}`;
}

export function formatIndian(num: number | undefined) {
  if (!num) return "N/A";

  if (isNaN(num)) return "Invalid number";
  return new Intl.NumberFormat("en-IN").format(num);
}

export function stripHtml(html: string): string {
  if (!html) return "";

  return (
    html
      // ── 1. Remove script / style blocks (tags + inner content) ──────────
      .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, "")

      // ── 2. SunEditor: drop non-visible structural wrappers ───────────────
      // Empty paragraphs used as spacers  e.g. <p><br></p>
      .replace(/<p[^>]*>\s*<br\s*\/?>\s*<\/p>/gi, "\n")

      // ── 3. Block-level tags → newline so words never merge ───────────────
      .replace(
        /<\/?(p|div|h[1-6]|li|ul|ol|blockquote|pre|tr|td|th|caption|figcaption|figure|section|article|header|footer|aside|nav|main)[^>]*>/gi,
        "\n"
      )

      // ── 4. <br> → newline ────────────────────────────────────────────────
      .replace(/<br\s*\/?>/gi, "\n")

      // ── 5. SunEditor inline formatting tags ─────────────────────────────
      // b, strong, i, em, u, s, strike, del, ins, sub, sup, mark, span, font
      // These are INLINE — no newline, just remove the tag itself.
      .replace(/<\/?(b|strong|i|em|u|s|strike|del|ins|sub|sup|mark|span|font|a|label|abbr|cite|code|kbd|samp|var|small|big|tt)[^>]*>/gi, "")

      // ── 6. Remove all remaining tags (images, hr, table wrappers, etc.) ──
      .replace(/<[^>]*>/gm, "")

      // ── 7. Decode HTML entities ──────────────────────────────────────────
      .replace(/&nbsp;/gi, " ") // SunEditor uses this heavily for spaces
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&hellip;/gi, "…")
      .replace(/&mdash;/gi, "—")
      .replace(/&ndash;/gi, "–")
      .replace(/&laquo;/gi, "«")
      .replace(/&raquo;/gi, "»")
      // Numeric hex entities e.g. &#x00A0;
      .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      // Numeric decimal entities e.g. &#160;
      .replace(/&#([0-9]+);/gi, (_, dec) => String.fromCharCode(Number(dec)))

      // ── 8. Normalise whitespace ──────────────────────────────────────────
      .replace(/[ \t]+/g, " ") // collapse horizontal whitespace
      .replace(/\n[ \t]+/g, "\n") // strip leading spaces on each line
      .replace(/[ \t]+\n/g, "\n") // strip trailing spaces on each line
      .replace(/\n{3,}/g, "\n\n") // max 2 consecutive newlines
      .trim()
  );
}

/** Counts only visible characters (what the user typed), for use with SunEditor */
export function countChars(html: string): number {
  return [...stripHtml(html)].length; // spread handles multi-byte / emoji correctly
}
