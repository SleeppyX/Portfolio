import type { Locale } from "@/i18n/routing";
import type messages from "../messages/en.json";

// ทำให้ TypeScript รู้จัก key ของคำแปลทั้งหมด พิมพ์ key ผิดจะขึ้นแดงทันที
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
