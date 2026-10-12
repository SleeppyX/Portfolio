import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectContent } from "@/components/projects/ProjectContent";
import { ButtonAnchor } from "@/components/ui/Button";
import { ArrowLeftIcon, ExternalIcon, GithubIcon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/Tag";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatYearMonth } from "@/lib/date";
import { getProject, getProjectSlugs } from "@/lib/projects";

// slug ที่ไม่มีไฟล์ผลงาน → หน้า 404
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug, locale as Locale);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const project = getProject(slug, locale as Locale);
  if (!project) notFound();

  const t = await getTranslations("Projects");

  return (
    <article className="mx-auto max-w-3xl py-12 sm:py-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent"
      >
        <ArrowLeftIcon width={16} height={16} />
        {t("back")}
      </Link>

      <header className="mt-6">
        <p className="text-sm text-muted">{formatYearMonth(project.date, locale as Locale)}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
        <p className="mt-3 text-lg text-muted">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        {(project.demo || project.repo) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demo && (
              <ButtonAnchor href={project.demo} target="_blank" rel="noreferrer">
                <ExternalIcon />
                {t("demo")}
              </ButtonAnchor>
            )}
            {project.repo && (
              <ButtonAnchor variant="outline" href={project.repo} target="_blank" rel="noreferrer">
                <GithubIcon />
                {t("repo")}
              </ButtonAnchor>
            )}
          </div>
        )}
      </header>

      {project.isFallback && (
        <p className="mt-6 rounded-lg border border-border bg-accent-soft p-3 text-sm">
          {t("fallbackNotice")}
        </p>
      )}

      <Image
        src={project.cover}
        alt=""
        width={1200}
        height={675}
        priority
        className="mt-8 aspect-video w-full rounded-xl border border-border object-cover"
      />

      <div className="mt-10">
        <ProjectContent source={project.content} />
      </div>
    </article>
  );
}
