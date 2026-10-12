import type { Locale } from "@/i18n/routing";

/** ข้อความที่มีทั้งภาษาอังกฤษและไทย เช่น { en: "Hello", th: "สวัสดี" } */
export type Localized<T = string> = Record<Locale, T>;

/** เลือกข้อความตามภาษาที่เปิดอยู่ */
export function localize<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
