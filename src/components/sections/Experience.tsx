import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { experience } from "@/data/experience";
import { formatYearMonth } from "@/lib/date";
import { localize } from "@/lib/localize";

export async function Experience() {
  const t = await getTranslations("Experience");
  const locale = await getLocale();

  return (
    <Section id="experience" title={t("title")}>
      <ol className="relative space-y-8 border-l border-border pl-6">
        {experience.map((item) => (
          <li key={`${item.start}-${item.title.en}`} className="relative">
            <span className="absolute top-1.5 -left-[31px] size-3 rounded-full border-2 border-background bg-accent" />
            <p className="text-sm text-muted">
              {formatYearMonth(item.start, locale)} –{" "}
              {item.end ? formatYearMonth(item.end, locale) : t("present")}
              <span className="ml-2 rounded bg-accent-soft px-1.5 py-0.5 text-xs text-accent">
                {t(item.type)}
              </span>
            </p>
            <h3 className="mt-1 font-semibold">{localize(item.title, locale)}</h3>
            <p className="text-sm text-muted">{localize(item.organization, locale)}</p>
            <p className="mt-2 text-muted">{localize(item.description, locale)}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
