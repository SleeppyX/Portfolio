import { getLocale, getTranslations } from "next-intl/server";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getFeaturedProjects } from "@/lib/projects";

/** ผลงานเด่นบนหน้าแรก: แสดงเฉพาะผลงานที่ตั้ง featured: true */
export async function FeaturedProjects() {
  const t = await getTranslations("Projects");
  const locale = await getLocale();
  const projects = getFeaturedProjects(locale);

  return (
    <Section id="projects" title={t("title")}>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <ButtonLink href="/projects" variant="outline">
          {t("viewAll")}
        </ButtonLink>
      </div>
    </Section>
  );
}
