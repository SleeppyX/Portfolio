import type { Localized } from "@/lib/localize";

export type SkillGroup = {
  title: Localized;
  items: string[];
};

/** ทักษะแบ่งเป็นกลุ่ม เพิ่ม/ลบกลุ่มหรือรายการได้เลย */
export const skillGroups: SkillGroup[] = [
  {
    title: { en: "Frontend", th: "Frontend" },
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML / CSS"],
  },
  {
    title: { en: "Backend", th: "Backend" },
    items: ["Node.js", "REST API", "PostgreSQL", "Prisma"],
  },
  {
    title: { en: "Tools", th: "เครื่องมือ" },
    items: ["Git / GitHub", "Figma", "Vercel", "VS Code"],
  },
];
