import { DELIVERY_RESPONSIBILITIES, SHIPPING_ZONES, SYSTEM_TYPES } from "@/config/constant";
import z from "zod";

export const generalSettingsSchema = z.object({
  maintenanceSystem: z.enum(SYSTEM_TYPES).nullable(),
  maintenanceTime: z.string().nullable(),
  maintenanceAnnouncement: z.boolean(),
  maintenanceTimeStart: z.string().nullable(),
  maintenanceTimeEnd: z.string().nullable(),
});

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

export const orderSettingsSchema = z.object({
  guestCheckoutEnabled: z.boolean(),
  // showVatOrTax: z.boolean(),
  isFreeDeliveryEnabled: z.boolean(),
  freeDeliveryThreshold: z.coerce.number().optional(),
  freeDeliveryResponsibility: z.enum(DELIVERY_RESPONSIBILITIES).nullable(),
  maxRefundableDays: z.string().optional(),
});

export type OrderSettingsFormValues = z.infer<typeof orderSettingsSchema>;

export const shippingSettingsSchema = z.object({
  shippingZones: z.array(z.enum(SHIPPING_ZONES)).nullable(),
  shippingCosts: z.array(
    z.object({
      zone: z.enum(SHIPPING_ZONES),
      cost: z.coerce.number().min(0, "Cost must be a positive number"),
    })
  ),
  shippingTimeText: z.string().max(100, "Shipping time text cannot exceed 100 characters").optional(),
});

export type ShippingSettingsFormValues = z.infer<typeof shippingSettingsSchema>;
