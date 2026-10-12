import { defineRouting } from "next-intl/routing";

/**
 * ตั้งค่าภาษาของเว็บ
 * - เพิ่มภาษาใหม่: เพิ่มรหัสภาษาใน `locales` แล้วสร้างไฟล์ messages/<รหัส>.json
 * - เปิด "/" จะถูกส่งไปที่ภาษา `defaultLocale`
 */
export const routing = defineRouting({
  locales: ["en", "th"],
  defaultLocale: "en",
  // ไม่เดาภาษาจากเบราว์เซอร์ เพื่อให้ทุกคนเห็นภาษาอังกฤษก่อนเสมอ
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
