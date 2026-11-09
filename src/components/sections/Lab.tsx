import { getLocale, getTranslations } from "next-intl/server";
import { SensorCard } from "@/components/sections/SensorCard";
import { Section } from "@/components/ui/Section";
import { interests } from "@/data/interests";
import { localize } from "@/lib/localize";

/** Lab & Interests: การ์ดเซนเซอร์ข้อมูลจริง (IoT) + ความสนใจด้าน IoT / AI */
export async function Lab() {
  const t = await getTranslations("Lab");
  const locale = await getLocale();

  return (
    <Section id="lab" title={t("title")}>
      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <div>
          <SensorCard
            labels={{
              online: t("online"),
              offline: t("offline"),
              location: t("location"),
              temperature: t("temperature"),
              humidity: t("humidity"),
              history: t("history"),
              justNow: t("justNow"),
              // ส่งข้อความดิบ ให้การ์ดแทน {minutes} เองฝั่ง browser
              minutesAgo: t.raw("minutesAgo") as string,
            }}
          />
          <p className="mt-3 text-xs text-muted">{t("sensorNote")}</p>
        </div>

        <ul className="space-y-6">
          {interests.map((interest) => (
            <li key={interest.title.en} className="flex gap-3">
              <span aria-hidden className="mt-1.5 size-2 shrink-0 rotate-45 bg-accent" />
              <div>
                <h3 className="font-semibold">{localize(interest.title, locale)}</h3>
                <p className="mt-1 text-muted">{localize(interest.description, locale)}</p>
                <p className="mt-2 font-mono text-xs text-accent">
                  {interest.keywords.join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
