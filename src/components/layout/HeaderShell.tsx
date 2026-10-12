"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

/** กรอบของ Header: หน้า Bio ใช้แบบโปร่งใสไม่มีเส้นขอบ ให้ท้องฟ้าต่อเนื่องถึงขอบบน */
export function HeaderShell({ children }: { children: ReactNode }) {
  const isBio = usePathname() === "/";
  return (
    <header
      className={`sticky top-0 z-40 ${
        isBio ? "bg-transparent" : "border-b border-border bg-background/80 backdrop-blur"
      }`}
    >
      {children}
    </header>
  );
}
