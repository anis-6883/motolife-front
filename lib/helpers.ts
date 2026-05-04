import { ORDER_STATUS, PAYMENT_STATUS } from "@/config/constant";
import { Product } from "./product-data";
import { FiltersState } from "./types";

export function getYouTubeEmbedUrl(url?: string) {
  if (!url) return null;

  const match =
    url.match(/youtu\.be\/([^?]+)/) ||
    url.match(/youtube\.com\/watch\?v=([^&]+)/) ||
    url.match(/youtube\.com\/embed\/([^?]+)/) ||
    url.match(/youtube\.com\/shorts\/([^?]+)/);

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export const getPaginationRange = (currentPage: number, totalPages: number): (number | "dots")[] => {
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const range: (number | "dots")[] = [];

  // Near the start (pages 1-3)
  if (currentPage <= 3) {
    range.push(1, 2, 3);
    range.push("dots");
    range.push(totalPages - 2, totalPages - 1, totalPages);
  } else if (currentPage > totalPages - 3) {
    range.push(1, 2, 3);
    range.push("dots");
    range.push(totalPages - 2, totalPages - 1, totalPages);
  } else if (currentPage == totalPages - 3) {
    range.push(1, 2, 3);
    range.push("dots");
    range.push(totalPages - 3, totalPages - 2, totalPages - 1);
  } else {
    range.push(currentPage - 1, currentPage, currentPage + 1);
    range.push("dots");
    range.push(totalPages - 2, totalPages - 1, totalPages);
  }

  return range;
};

export function getFilteredProducts(filters: FiltersState, products: Product[]) {
  // ---------- CATEGORY ----------
  if (filters.category) {
    if (filters.category.type === "parent") {
      products = products.filter((p) => p.category === filters.category!.value);
    }

    if (filters.category.type === "child") {
      products = products.filter((p) => p.category === filters.category!.value);
    }
  }

  // ---------- PRICE RANGE ----------
  if (filters.price?.min !== undefined) {
    products = products.filter((p) => p.price >= Number(filters.price!.min));
  }

  if (filters.price?.max !== undefined) {
    products = products.filter((p) => p.price <= Number(filters.price!.max));
  }

  // ---------- BRANDS ----------
  if (filters.brands.length > 0) {
    products = products.filter((p) => filters.brands.includes(p.brand));
  }

  // ---------- RATINGS ----------
  if (filters.ratings.length > 0) {
    products = products.filter((p) => filters.ratings.some((r) => Math.floor(p.rating) >= r));
  }

  // ---------- AVAILABILITY ----------
  if (filters.availability.length > 0) {
    products = products.filter((p) =>
      filters.availability.some((a) => {
        if (a === "New") return p.isNew;
        if (a === "Best Seller") return p.isBestSeller;
        if (a === "Limited") return p.isLimited;
        return false;
      })
    );
  }

  // ---------- VENDORS ----------
  if (filters.vendors.length > 0) {
    products = products.filter((p) => filters.vendors.includes(p.vendor));
  }

  // ---------- VENDOR TYPES ----------
  if (filters.vendorTypes.length > 0) {
    products = products.filter((p) => filters.vendorTypes.includes(p.vendorType));
  }

  // ---------- SORT BY ----------
  switch (filters.sortBy) {
    case "newest":
      products.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
      break;

    case "rating":
      products.sort((a, b) => b.rating - a.rating);
      break;

    case "discount":
      products.sort((a, b) => b.discount - a.discount);
      break;

    case "popular":
    default:
      products.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
      break;
  }

  // ---------- PRICE SORT (SECONDARY) ----------
  if (filters.priceSort === "low") {
    products.sort((a, b) => a.price - b.price);
  }

  if (filters.priceSort === "high") {
    products.sort((a, b) => b.price - a.price);
  }

  return products;
}

export const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url?.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

type Variant = {
  attributes: { name: string; value: string }[];
};

type FormattedAttribute = {
  name: string;
  values: string[];
};

export const extractAttributes = (variants: Variant[]): FormattedAttribute[] => {
  const attributeMap: Record<string, Set<string>> = {};

  variants.forEach((variant) => {
    variant.attributes.forEach(({ name, value }) => {
      if (name.toLowerCase() === "color") return; // exclude color

      if (!attributeMap[name]) {
        attributeMap[name] = new Set();
      }

      attributeMap[name].add(value);
    });
  });

  return Object.entries(attributeMap).map(([name, valuesSet]) => ({
    name,
    values: Array.from(valuesSet),
  }));
};

const REFUND_ELIGIBLE_STATUSES: string[] = [ORDER_STATUS.CANCELLED, ORDER_STATUS.RETURNED, ORDER_STATUS.FAILED];

/**
 * Determines whether an order qualifies for a refund request.
 * The order must be in a terminal status (cancelled, delivered, or returned)
 * AND the payment must already be paid.
 */
export function isRefundEligible(orderStatus: string, paymentStatus: string): boolean {
  const _paymentStatus = PAYMENT_STATUS.PAID; // REMOVE IF PAYMENT IS INTEGRATED
  console.log({ orderStatus, paymentStatus });

  return REFUND_ELIGIBLE_STATUSES.includes(orderStatus) && _paymentStatus === PAYMENT_STATUS.PAID;
}
