import type { Locale } from "@/i18n/routing";

/** แปลง "2025-03" เป็น "Mar 2025" (en) หรือ "มี.ค. 2025" (th) */
export function formatYearMonth(value: string, locale: Locale): string {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH-u-ca-gregory" : "en-US", {
    year: "numeric",
    month: "short",
  }).format(new Date(year, month - 1));
}
