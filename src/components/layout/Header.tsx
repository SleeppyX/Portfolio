import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { MenuIcon } from "@/components/ui/icons";
import { profile } from "@/data/profile";
import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/localize";
import { HideOnBio } from "./HideOnBio";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

/** เมนูด้านบน: ลิงก์ไปแต่ละส่วนของหน้า Portfolio (ค่าคือ id ของ Section) */
const navItems = ["about", "skills", "experience", "projects", "contact"] as const;

export async function Header() {
  const t = await getTranslations("Nav");
  const locale = await getLocale();

  const links = navItems.map((id) => (
    <Link
      key={id}
      href={{ pathname: "/portfolio", hash: id }}
      className="text-sm text-muted transition-colors hover:text-foreground"
    >
      {t(id)}
    </Link>
  ));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="font-semibold tracking-tight">
            {localize(profile.name, locale)}
          </Link>

          {/* หน้า Bio ไม่มีเมนู เหลือแค่ปุ่มภาษาและธีม */}
          <HideOnBio>
            <nav className="hidden items-center gap-6 md:flex">{links}</nav>
          </HideOnBio>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />

            {/* เมนูมือถือ: ใช้ <details> เปิด/ปิดได้โดยไม่ต้องเขียน JS */}
            <HideOnBio>
              <details className="relative md:hidden">
                <summary
                  aria-label={t("menu")}
                  className="list-none rounded-lg p-2 text-muted hover:text-foreground [&::-webkit-details-marker]:hidden"
                >
                  <MenuIcon />
                </summary>
                <nav className="absolute right-0 mt-2 flex w-44 flex-col gap-3 rounded-lg border border-border bg-background p-4 shadow-lg">
                  {links}
                </nav>
              </details>
            </HideOnBio>
          </div>
        </div>
      </Container>
    </header>
  );
}
