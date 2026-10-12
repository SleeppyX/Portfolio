import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// ทำงานก่อนทุก request: เติม /en หรือ /th ให้ URL ที่ไม่มีภาษา
export default createMiddleware(routing);

export const config = {
  // ข้าม api, ไฟล์ภายในของ Next และไฟล์ที่มีนามสกุล (รูป, pdf ฯลฯ)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
