"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

export function ThemeToggle() {
  const t = useTranslations("Theme");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={t("toggle")}
      className="rounded-lg p-2 text-muted transition-colors hover:text-foreground"
    >
      {/* แสดงไอคอนด้วย CSS เพื่อไม่ให้กระพริบตอนโหลดหน้า */}
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="block dark:hidden" />
    </button>
  );
}
