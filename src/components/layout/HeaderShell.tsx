"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * กรอบของ Header: หน้า Bio ใช้แบบโปร่งใสไม่มีเส้นขอบ ให้ท้องฟ้าต่อเนื่องถึงขอบบน
 * และไม่ค้างด้านบน (ถ้าค้าง ข้อความจะซ้อนกับเนื้อหาตอนเลื่อน เพราะไม่มีพื้นหลัง)
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const isBio = usePathname() === "/";
  return (
    <header
      className={
        isBio
          ? "relative z-40 bg-transparent"
          : "sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur"
      }
    >
      {children}
    </header>
  );
}
