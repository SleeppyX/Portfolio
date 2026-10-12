import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { profile } from "@/data/profile";
import { localize } from "@/lib/localize";

export async function About() {
  const t = await getTranslations("About");
  const locale = await getLocale();

  return (
    <Section id="about" title={t("title")}>
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        <Image
          src={profile.avatar}
          alt={localize(profile.name, locale)}
          width={192}
          height={192}
          className="size-36 shrink-0 rounded-full border-4 border-accent-soft object-cover sm:size-44"
        />
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
          {localize(profile.about, locale).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}
