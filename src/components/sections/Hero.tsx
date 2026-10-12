import { getLocale, getTranslations } from "next-intl/server";
import { TestRunner } from "@/components/sections/TestRunner";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { DownloadIcon } from "@/components/ui/icons";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/localize";
import { getAllProjects } from "@/lib/projects";

/**
 * บรรทัดเทสต์ใน Test Runner คำนวณจากข้อมูลจริงทั้งหมด
 * (เพิ่มผลงาน/ทักษะ/งานใหม่ ตัวเลขจะเปลี่ยนตามเอง) เป็นภาษาอังกฤษทุกภาษา
 */
function buildTests(locale: Locale): string[] {
  const currentJob = experience.find((item) => item.type === "work" && !item.end);
  const skills = skillGroups.flatMap((group) => group.items);
  const projectCount = getAllProjects(locale).length;
  const gpax = experience.find((item) => item.gpax)?.gpax;

  return [
    currentJob && `works as ${currentJob.title.en}`,
    skills.length > 2
      ? `knows ${skills.slice(0, 2).join(", ")} +${skills.length - 2} more`
      : `knows ${skills.join(", ")}`,
    `ships ${projectCount} projects`,
    gpax && `maintains GPAX ${gpax.toFixed(2)}`,
  ].filter((test): test is string => Boolean(test));
}

export async function Hero() {
  const t = await getTranslations("Hero");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="grid items-center gap-12 py-16 sm:py-24 md:grid-cols-2">
      <div className="max-w-xl text-center md:text-left">
        <p className="text-muted">{t("greeting")}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          {localize(profile.name, locale)}
        </h1>
        <p className="mt-3 text-xl font-medium text-accent">{localize(profile.role, locale)}</p>
        <p className="mt-4 text-lg text-muted">{localize(profile.tagline, locale)}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
          <ButtonLink href={{ pathname: "/", hash: "projects" }}>{t("viewProjects")}</ButtonLink>
          {profile.resume && (
            <ButtonAnchor variant="outline" href={localize(profile.resume, locale)} download>
              <DownloadIcon />
              {t("downloadResume")}
            </ButtonAnchor>
          )}
        </div>
      </div>

      <div className="flex justify-center md:justify-end">
        <TestRunner
          suite={profile.name.en}
          tests={buildTests(locale)}
          rerunLabel={t("rerunTests")}
        />
      </div>
    </section>
  );
}
