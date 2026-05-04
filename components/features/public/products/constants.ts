import { Icons } from "@/components/icons";
import { PaymentItem } from "@/lib/types";

export const insideDhaka = ["Dhaka"];
export const nearDhaka = ["Gazipur", "Narayanganj", "Manikganj", "Munshiganj", "Narsingdi", "Tangail"];
export const colorMap: Record<string, string> = {
  RED: "#ef4444",
  GREEN: "#22c55e",
  BLUE: "#3b82f6",
  BLACK: "#000000",
  WHITE: "#ffffff",
  YELLOW: "#eab308",
  SKY: "#0ea5e9",
};
export const AllStatuses = {
  confirmed: {
    label: "Order Confirmed",
    index: "confirmed",
  },
  ready: {
    label: "Ready to Ship",
    index: "ready",
  },
  shipped: {
    label: "Shipped",
    index: "shipped",
  },
  delivery: {
    label: "Out for Delivery",
    index: "delivery",
  },
  delivered: {
    label: "Delivered",
    index: "delivered",
  },
  cancel: {
    label: "Cancelled",
    index: "cancelled",
  },
};

export const sampleOrderData = {
  orderId: "order0213232",
  estimatedDeliveryDate: "22 December, 2025",
  shippingAddress: "1456 Veltri Drive, Anchorage, AK 99502",
  paymentMethod: "Cash on delivery",
  status: "cancelled",
  orderSteps: {
    confirmed: "03/09/2025",
    ready: "03/09/2025",
    shipped: "03/09/2025",
    delivery: "03/09/2025",
    delivered: "03/09/2025",
  },
  items: [
    {
      id: "1",
      vendorId: "vendor-1",
      vendorName: "MotoGear BD",
      name: "Axor Apex Venomous Helmet – Red (L)",
      image: "/images/casual-set.png",
      color: "Red",
      size: "L",
      quantity: 12,
      price: 199,
    },
    {
      id: "2",
      vendorId: "vendor-1",
      vendorName: "MotoGear BD",
      name: "Axor Apex Venomous Helmet – Matte Red (L)",
      image: "/images/White-hoodie.png",
      color: "Red",
      size: "L",
      quantity: 1,
      price: 399,
    },
    {
      id: "5",
      vendorId: "vendor-1",
      vendorName: "MotoGear BD",
      name: "Axor Apex Venomous Helmet – Gloss Red (L)",
      image: "/images/White-hoodie.png",
      color: "Red",
      size: "L",
      quantity: 1,
      price: 499,
    },
    {
      id: "3",
      vendorId: "vendor-2",
      vendorName: "S.B. Motor",
      name: "Axor Apex Venomous Helmet – Racing Edition",
      image: "/images/denim.png",
      color: "Red",
      size: "L",
      quantity: 1,
      price: 8799,
    },
    {
      id: "4",
      vendorId: "vendor-2",
      vendorName: "S.B. Motor",
      name: "Axor Apex Venomous Helmet – Street Edition",
      image: "/images/casual-set.png",
      color: "Red",
      size: "L",
      quantity: 1,
      price: 299,
    },
  ],

  summary: {
    subtotal: 10195,
    deliveryCharge: 0,
    tax: 815.6,
    couponDiscount: 500,
    total: 10410.6,
  },
};
export type samPleOrderType = typeof sampleOrderData;
export const sampleOrderAry = [
  {
    orderId: "order0213232",
    estimatedDeliveryDate: "22 December, 2025",
    shippingAddress: "1456 Veltri Drive, Anchorage, AK 99502",
    paymentMethod: "Cash on delivery",
    status: "ready",
    orderSteps: {
      confirmed: "03/09/2025",
      ready: "03/09/2025",
      shipped: "03/09/2025",
      delivery: "03/09/2025",
      delivered: "03/09/2025",
    },
    items: [
      {
        id: "1",
        vendorId: "vendor-1",
        vendorName: "MotoGear BD",
        name: "Axor Apex Venomous Helmet – Red (L)",
        image: "/images/casual-set.png",
        color: "Red",
        size: "L",
        quantity: 12,
        price: 199,
      },
      {
        id: "5",
        vendorId: "vendor-1",
        vendorName: "MotoGear BD",
        name: "Axor Apex Venomous Helmet – Gloss Red (L)",
        image: "/images/White-hoodie.png",
        color: "Red",
        size: "L",
        quantity: 1,
        price: 499,
      },
      {
        id: "3",
        vendorId: "vendor-2",
        vendorName: "S.B. Motor",
        name: "Axor Apex Venomous Helmet – Racing Edition",
        image: "/images/denim.png",
        color: "Red",
        size: "L",
        quantity: 1,
        price: 8799,
      },
      {
        id: "4",
        vendorId: "vendor-2",
        vendorName: "S.B. Motor",
        name: "Axor Apex Venomous Helmet – Street Edition",
        image: "/images/casual-set.png",
        color: "Red",
        size: "L",
        quantity: 1,
        price: 299,
      },
    ],

    summary: {
      subtotal: 10195,
      deliveryCharge: 0,
      tax: 815.6,
      couponDiscount: 500,
      total: 10410.6,
    },
  },
  {
    orderId: "order0213231",
    estimatedDeliveryDate: "2 December, 2025",
    shippingAddress: "1456 Veltri Drive, Anchorage, AK 99502",
    paymentMethod: "Cash on delivery",
    status: "cancelled",
    orderSteps: {
      confirmed: "03/09/2025",
      ready: "03/09/2025",
      shipped: "03/09/2025",
      delivery: "03/09/2025",
      delivered: "03/09/2025",
    },
    items: [
      {
        id: "1",
        vendorId: "vendor-1",
        vendorName: "MotoGear BD",
        name: "Axor Apex Venomous Helmet – Red (L)",
        image: "/images/casual-set.png",
        color: "Red",
        size: "L",
        quantity: 12,
        price: 199,
      },
      {
        id: "2",
        vendorId: "vendor-1",
        vendorName: "MotoGear BD",
        name: "Axor Apex Venomous Helmet – Matte Red (L)",
        image: "/images/White-hoodie.png",
        color: "Red",
        size: "L",
        quantity: 1,
        price: 399,
      },
      {
        id: "5",
        vendorId: "vendor-1",
        vendorName: "MotoGear BD",
        name: "Axor Apex Venomous Helmet – Gloss Red (L)",
        image: "/images/White-hoodie.png",
        color: "Red",
        size: "L",
        quantity: 1,
        price: 499,
      },
      {
        id: "3",
        vendorId: "vendor-2",
        vendorName: "S.B. Motor",
        name: "Axor Apex Venomous Helmet – Racing Edition",
        image: "/images/denim.png",
        color: "Red",
        size: "L",
        quantity: 1,
        price: 8799,
      },
      {
        id: "4",
        vendorId: "vendor-2",
        vendorName: "S.B. Motor",
        name: "Axor Apex Venomous Helmet – Street Edition",
        image: "/images/casual-set.png",
        color: "Red",
        size: "L",
        quantity: 1,
        price: 299,
      },
    ],

    summary: {
      subtotal: 10195,
      deliveryCharge: 0,
      tax: 815.6,
      couponDiscount: 500,
      total: 10410.6,
    },
  },
  {
    orderId: "order02138798878231",
    estimatedDeliveryDate: "2 December, 2025",
    shippingAddress: "1456 Veltri Drive, Anchorage, AK 99502",
    paymentMethod: "Cash on delivery",
    status: "delivered",

    orderSteps: {
      confirmed: "03/09/2025",
      ready: "03/09/2025",
      shipped: "03/09/2025",
      delivery: "03/09/2025",
      delivered: "03/09/2025",
    },
    items: [
      {
        id: "1",
        vendorId: "vendor-1",
        vendorName: "MotoGear BD",
        name: "Axor Apex Venomous Helmet – Red (L)",
        image: "/images/casual-set.png",
        color: "Red",
        size: "L",
        quantity: 12,
        price: 199,
      },
      {
        id: "2",
        vendorId: "vendor-1",
        vendorName: "MotoGear BD",
        name: "Axor Apex Venomous Helmet – Matte Red (L)",
        image: "/images/White-hoodie.png",
        color: "Red",
        size: "L",
        quantity: 1,
        price: 399,
      },
      {
        id: "5",
        vendorId: "vendor-1",
        vendorName: "MotoGear BD",
        name: "Axor Apex Venomous Helmet – Gloss Red (L)",
        image: "/images/White-hoodie.png",
        color: "Red",
        size: "L",
        quantity: 1,
        price: 499,
      },
      {
        id: "3",
        vendorId: "vendor-2",
        vendorName: "S.B. Motor",
        name: "Axor Apex Venomous Helmet – Racing Edition",
        image: "/images/denim.png",
        color: "Red",
        size: "L",
        quantity: 1,
        price: 8799,
      },
      {
        id: "4",
        vendorId: "vendor-2",
        vendorName: "S.B. Motor",
        name: "Axor Apex Venomous Helmet – Street Edition",
        image: "/images/casual-set.png",
        color: "Red",
        size: "L",
        quantity: 1,
        price: 299,
      },
    ],

    summary: {
      subtotal: 10195,
      deliveryCharge: 0,
      tax: 815.6,
      couponDiscount: 500,
      total: 10410.6,
    },
  },
];
export interface SubCategory {
  name: string;
  value: string;
}
export interface CategoryItem {
  name: string;
  value: string;
  subCategories?: SubCategory[];
}

export const defaultCategories: CategoryItem[] = [
  { name: "Engine Oil", value: "engine-oil" },
  {
    name: "Helmet",
    value: "helmet",
    subCategories: [
      { name: "Full Face Helmet", value: "helmet/full-face" },
      { name: "Half Helmet", value: "helmet/half" },
      { name: "Open Face Helmet", value: "helmet/open-face" },
    ],
  },
  { name: "Locks", value: "locks" },
  { name: "Parts", value: "parts" },
  {
    name: "Windbreaker & Jacket",
    value: "windbreaker-jacket",
    subCategories: [
      { name: "Riding Jacket", value: "windbreaker-jacket/riding" },
      { name: "Casual Jacket", value: "windbreaker-jacket/casual" },
    ],
  },
  {
    name: "Hand Gloves",
    value: "gloves",
    subCategories: [
      { name: "Leather Gloves", value: "gloves/leather" },
      { name: "Textile Gloves", value: "gloves/textile" },
    ],
  },
  { name: "Fog & LED", value: "fog-led" },
  {
    name: "Accessories",
    value: "accessories",
    subCategories: [
      { name: "Mirrors", value: "accessories/mirrors" },
      { name: "Grips", value: "accessories/grips" },
    ],
  },
  { name: "Flamingo", value: "flamingo" },
];
export const vendorDetails = {
  productQty: 2140,
  reviews: 10234,
};
export const vendorsAry = ["MotoGear BD", "MotoGear BD 2", "MotoGear BD 3", "MotoGear BD 4"];
export const vendorTypesAry = ["Verified", "Premium Partner", "New Seller"];
export const availabilityAry = ["In stock", "Upcoming", "Out of stock"];

export const getPaymentBriefData = (orderData: samPleOrderType): Record<string, PaymentItem> => {
  return {
    orderId: {
      label: "Order ID",
      value: orderData.orderId,
    },
    orderDate: {
      label: "Order Date",
      value: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    },
    estdDelivery: {
      label: "Estimated Delivery",
      value: orderData.estimatedDeliveryDate,
    },
    total: {
      label: "Total",
      value: `${orderData.summary.total} BDT`,
    },
    paymentMethod: {
      label: "Payment Method",
      icon: "VisaIcon",
    },
  };
};

export const SampleOrderSteps = [
  { id: "confirmed", label: "Order Confirmed", icon: "OrderConfirmed" },
  { id: "ready", label: "Ready to Ship", icon: "ReadyToShip" },
  { id: "shipped", label: "Shipped", icon: "Shipped" },
  { id: "delivery", label: "Out for Delivery", icon: "OutForDelivery" },
  { id: "delivered", label: "Delivered", icon: "Delivered" },
];
export const stepsObj: Record<
  string,
  {
    label: string;
    icon: keyof typeof Icons;
  }
> = {
  pending: { label: "Order Pending", icon: "Pending" },
  confirmed: { label: "Order Confirmed", icon: "OrderConfirmed" },
  ready: { label: "Ready to Ship", icon: "ReadyToShip" },
  shipped: { label: "Shipped", icon: "Shipped" },
  delivery: { label: "Out for Delivery", icon: "OutForDelivery" },
  delivered: { label: "Delivered", icon: "Delivered" },
};
export const SampleCoupons = [
  {
    title: "Gift Voucher",
    amount: 250,
    voucherCode: "CASHB",
    requiredPoints: 500,
    status: "expired",
    expired: "10 Jan 2026",
    maxAmount: "5000",
  },
  {
    title: "Gift Voucher",
    amount: 250,
    voucherCode: "CASHB",
    requiredPoints: 800,
    status: "available",
    validityDays: 5,
  },
  {
    title: "Gift Voucher",
    amount: 2500,
    voucherCode: "CASHCB",
    requiredPoints: 2800,
    status: "available",
    validityDays: 3,
  },
  {
    title: "Gift Voucher",
    amount: 250,
    voucherCode: "CASHB",
    requiredPoints: 1000,
    status: "applied",
    validityDays: 0,
    orderId: "239843898434",
    appliedOn: "10 Jan 2026",
  },
];
export const RefundList = [
  {
    _id: "abc",
    orderId: "34444444443",
    product: {
      name: "GlidePro Urban Helmet",
      image: "/images/sample-data-images/prod1.png",
      quantity: "1",
    },
    requestDate: "Jan 01, 2026",
    vendor: "MotoGear BD",
    refundAmount: "456",
    status: "cancelled",
  },
  {
    _id: "def555555",
    orderId: "34353454545",
    product: {
      name: "MOTUL 300V 10W40 100% ",
      image: "/images/sample-data-images/prod4.png",
      quantity: "1",
    },
    requestDate: "Jan 01, 2026",
    vendor: "S.B. Motor",
    refundAmount: "123",
    status: "pending",
  },

  {
    _id: "abghce12",
    orderId: "56657656757",
    product: {
      name: "GlidePro Urban Helmet",
      image: "/images/sample-data-images/prod2.png",
      quantity: "3",
    },
    requestDate: "Jan 01, 2026",
    vendor: "S.B. Motor",
    refundAmount: "456",
    status: "cancelled",
  },
  {
    _id: "absdfdfdcdf11",
    orderId: "45645656567",
    product: {
      name: "GlidePro Urban Helmet",
      image: "/images/sample-data-images/prod3.png",
      quantity: "5",
    },
    requestDate: "Jan 01, 2026",
    vendor: "S.B. Motor",
    refundAmount: "284.00",
    status: "refunded",
  },
  {
    _id: "abdfec3455421",
    orderId: "34444444443",
    product: {
      name: "GlidePro Urban Helmet",
      image: "/images/sample-data-images/prod1.png",
      quantity: "1",
    },
    requestDate: "Jan 01, 2026",
    vendor: "MotoGear BD",
    refundAmount: "456",
    status: "cancelled",
  },
  {
    _id: "ddfdfeef3423",
    orderId: "34353454545",
    product: {
      name: "MOTUL 300V 10W40 100% SYNTHETIC FRANCE 1L",
      image: "/images/sample-data-images/prod4.png",
      quantity: "1",
    },
    requestDate: "Jan 01, 2026",
    vendor: "S.B. Motor",
    refundAmount: "123",
    status: "pending",
  },

  {
    _id: "abghsdfdc4354",
    orderId: "56657656757",
    product: {
      name: "GlidePro Urban Helmet",
      image: "/images/sample-data-images/prod2.png",
      quantity: "3",
    },
    requestDate: "Jan 01, 2026",
    vendor: "S.B. Motor",
    refundAmount: "456",
    status: "cancelled",
  },
  {
    _id: "abcsdserererdf",
    orderId: "45645656567",
    product: {
      name: "GlidePro Urban Helmet",
      image: "/images/sample-data-images/prod3.png",
      quantity: "5",
    },
    requestDate: "Jan 01, 2026",
    vendor: "S.B. Motor",
    refundAmount: "284.00",
    status: "refunded",
  },
  {
    _id: "def55rr5555",
    orderId: "34353454545",
    product: {
      name: "MOTUL 300V 10W40 100% SYNTHETIC FRANCE 1L",
      image: "/images/sample-data-images/prod4.png",
      quantity: "1",
    },
    requestDate: "Jan 01, 2026",
    vendor: "S.B. Motor",
    refundAmount: "123",
    status: "pending",
  },

  {
    _id: "abghctre12",
    orderId: "56657656757",
    product: {
      name: "GlidePro Urban Helmet",
      image: "/images/sample-data-images/prod2.png",
      quantity: "3",
    },
    requestDate: "Jan 01, 2026",
    vendor: "S.B. Motor",
    refundAmount: "456",
    status: "cancelled",
  },
  {
    _id: "absdfdfdtycdf11",
    orderId: "45645656567",
    product: {
      name: "GlidePro Urban Helmet",
      image: "/images/sample-data-images/prod3.png",
      quantity: "5",
    },
    requestDate: "Jan 01, 2026",
    vendor: "S.B. Motor",
    refundAmount: "284.00",
    status: "refunded",
  },
];
