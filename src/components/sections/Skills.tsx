import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { skillGroups } from "@/data/skills";
import { localize } from "@/lib/localize";

export async function Skills() {
  const t = await getTranslations("Skills");
  const locale = await getLocale();

  return (
    <Section id="skills" title={t("title")}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <div key={group.title.en} className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold">{localize(group.title, locale)}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border px-2.5 py-1 text-sm text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
