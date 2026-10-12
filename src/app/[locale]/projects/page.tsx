import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import type { Locale } from "@/i18n/routing";
import { getAllProjects, getAllTags } from "@/lib/projects";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "Projects" });
  return { title: t("allTitle") };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("Projects");
  const projects = getAllProjects(locale as Locale);

  return (
    <div className="py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("allTitle")}</h1>
      <p className="mt-3 mb-10 text-muted">{t("allDescription")}</p>
      <ProjectFilter projects={projects} tags={getAllTags(projects)} />
    </div>
  );
}
