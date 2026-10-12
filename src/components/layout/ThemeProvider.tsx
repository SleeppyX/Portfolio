"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/** จัดการโหมดมืด/สว่าง: ใส่ class "dark" บน <html> และจำค่าที่เลือกไว้ (เริ่มต้นเป็นโหมดมืด) */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      {children}
    </NextThemesProvider>
  );
}
