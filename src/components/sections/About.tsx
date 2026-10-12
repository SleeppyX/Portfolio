import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { profile } from "@/data/profile";
import { localize } from "@/lib/localize";

export async function About() {
  const t = await getTranslations("About");
  const locale = await getLocale();

  return (
    <Section id="about" title={t("title")}>
      <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
        {localize(profile.about, locale).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}
