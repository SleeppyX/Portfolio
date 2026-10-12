import type { Localized } from "@/lib/localize";

export type SkillGroup = {
  title: Localized;
  items: string[];
};

/** ทักษะแบ่งเป็นกลุ่ม เพิ่ม/ลบกลุ่มหรือรายการได้เลย */
export const skillGroups: SkillGroup[] = [
  {
    title: { en: "Quality Assurance", th: "Quality Assurance" },
    items: ["Cypress", "Postman", "Test Case Design", "Regression Testing", "Issue Logging"],
  },
  {
    title: { en: "Development", th: "Development" },
    items: ["HTML / CSS", "JavaScript", "Node.js", "Express", "MongoDB", "Python"],
  },
  {
    title: { en: "Tools", th: "เครื่องมือ" },
    items: ["Git / GitHub", "VS Code"],
  },
];
