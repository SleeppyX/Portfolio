import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Container } from "@/components/ui/Container";
import { profile } from "@/data/profile";
import { routing } from "@/i18n/routing";
import { localize } from "@/lib/localize";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoThai = Noto_Sans_Thai({ variable: "--font-thai", subsets: ["thai"] });

/** สร้างหน้าไว้ล่วงหน้าทุกภาษาตอน build (เว็บเป็น static ทั้งหมด) */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const name = localize(profile.name, locale);
  const role = localize(profile.role, locale);
  return {
    title: { default: `${name} | ${role}`, template: `%s | ${name}` },
    description: localize(profile.tagline, locale),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // บอก next-intl ว่าหน้านี้เป็นภาษาอะไร เพื่อให้ build เป็น static ได้
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoThai.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col font-sans">
        <NextIntlClientProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-1">
              <Container>{children}</Container>
            </main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
