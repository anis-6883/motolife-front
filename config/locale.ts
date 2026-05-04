"use server";

import { cookies } from "next/headers";
import { COOKIE_NAME, defaultLocale } from "./constant";

export async function getUserLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: string) {
  (await cookies()).set(COOKIE_NAME, locale);
}
