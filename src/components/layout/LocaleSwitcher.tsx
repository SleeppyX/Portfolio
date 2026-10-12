"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** ปุ่ม EN / TH: เปลี่ยนภาษาโดยอยู่หน้าเดิม */
export function LocaleSwitcher() {
  const t = useTranslations("Locale");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={t("switch")}
      className="flex rounded-lg border border-border p-0.5 text-xs font-medium"
    >
      {routing.locales.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => router.replace(pathname, { locale: option })}
          aria-pressed={option === locale}
          className={`rounded-md px-2 py-1 transition-colors ${
            option === locale
              ? "bg-accent text-accent-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          {t(option)}
        </button>
      ))}
    </div>
  );
}
