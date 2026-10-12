import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { profile } from "@/data/profile";
import { localize } from "@/lib/localize";

export async function Footer() {
  const t = await getTranslations("Footer");
  const locale = await getLocale();

  return (
    <footer className="border-t border-border py-8 text-sm text-muted">
      <Container>
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {localize(profile.name, locale)}
          </p>
          <p>{t("builtWith")}</p>
        </div>
      </Container>
    </footer>
  );
}
