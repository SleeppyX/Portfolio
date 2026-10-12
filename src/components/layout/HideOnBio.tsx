"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

/** ซ่อนเนื้อหาข้างในเมื่ออยู่หน้า Bio (หน้าแรก) เช่น เมนูด้านบน */
export function HideOnBio({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/" ? null : children;
}
