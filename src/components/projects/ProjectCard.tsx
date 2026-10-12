import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatYearMonth } from "@/lib/date";
import type { ProjectMeta } from "@/lib/projects";

type ProjectCardProps = {
  project: ProjectMeta;
  locale: Locale;
};

/** การ์ดผลงาน 1 ชิ้น กดแล้วไปหน้ารายละเอียด */
export function ProjectCard({ project, locale }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-1 hover:border-accent hover:shadow-lg"
    >
      <Image
        src={project.cover}
        alt=""
        width={800}
        height={450}
        className="aspect-video w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-muted">{formatYearMonth(project.date, locale)}</p>
        <h3 className="mt-1 text-lg font-semibold group-hover:text-accent">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
