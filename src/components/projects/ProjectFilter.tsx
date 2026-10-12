"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { ProjectMeta } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

type ProjectFilterProps = {
  projects: ProjectMeta[];
  tags: string[];
};

/** ปุ่มกรองตาม tag + ตารางผลงาน (หน้า /projects) */
export function ProjectFilter({ projects, tags }: ProjectFilterProps) {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const visible = activeTag ? projects.filter((p) => p.tags.includes(activeTag)) : projects;

  const options = [
    { value: null, label: t("filterAll") },
    ...tags.map((tag) => ({ value: tag, label: tag })),
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === activeTag;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => setActiveTag(option.value)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-muted">{t("empty")}</p>
      )}
    </>
  );
}
