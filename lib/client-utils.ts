import moment from "moment";
import { formatNumber } from "./formatters";
import { IProductPublic } from "./types";

export const onError = (errors: any) => {
  console.log("Validation Errors:", errors);
};
// Date and time (like formatDate)
export default function formatDateToDateString(date: string) {
  const formattedDate = moment(date).format("MMM DD, YYYY");
  return formattedDate;
  // Example: Mar 03, 2026
}

export function formatDate(iso: string | Date) {
  return moment(iso).format("DD MMM YYYY, hh:mm A");
  // Example: 03 Mar 2026, 10:30 AM
}

// Time only (like formatTime)
export function formatTime(iso: string | Date) {
  return moment(iso).format("HH:mm");
  // 24-hour format, Example: 14:30
}

// Date only (like formatLogDate)
export function formatLogDate(iso: string | Date) {
  return moment(iso).format("DD MMM YYYY");
  // Example: 03 Mar 2026
}

export const chunkProducts = (arr: IProductPublic[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export const buildWhatsAppMessage = (
  selectedAttributes: Record<string, string>,
  product: any,
  quantity: number,
  priceData: any,
  productUrl: string,
  variantText: string
) => {
  const message = `
Hi Moto Life 👋

I would like to order the following product:

🛍 Product Name: ${product.name}
🎨 Variant: ${variantText}
🔢 Quantity: ${quantity}
💰 Price: ${formatNumber(Number(priceData.price))} BDT

🔗 Product Link:
${productUrl}

Please confirm availability. Thank you 😊
  `;

  return encodeURIComponent(message);
};
