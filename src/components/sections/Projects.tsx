import { getLocale, getTranslations } from "next-intl/server";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Section } from "@/components/ui/Section";
import { getAllProjects } from "@/lib/projects";

/** ผลงานบนหน้า Portfolio: แสดงทุกชิ้น เรียงจากใหม่ไปเก่า */
export async function Projects() {
  const t = await getTranslations("Projects");
  const locale = await getLocale();
  const projects = getAllProjects(locale);

  return (
    <Section id="projects" title={t("title")}>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </div>
    </Section>
  );
}
