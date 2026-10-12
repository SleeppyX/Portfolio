import type { Localized } from "@/lib/localize";

export type ExperienceItem = {
  /** work = งาน/ฝึกงาน, education = การศึกษา */
  type: "work" | "education";
  title: Localized;
  organization: Localized;
  /** รูปแบบ "YYYY-MM" เช่น "2024-06" */
  start: string;
  /** ไม่ใส่ = ยังทำอยู่ (แสดงเป็น Present / ปัจจุบัน) */
  end?: string;
  description: Localized;
};

/** Timeline ประสบการณ์และการศึกษา เรียงจากใหม่ไปเก่า */
export const experience: ExperienceItem[] = [
  {
    type: "work",
    title: { en: "Frontend Developer Intern", th: "นักศึกษาฝึกงาน Frontend" },
    organization: { en: "Example Tech Co., Ltd.", th: "บริษัท ตัวอย่าง เทค จำกัด" },
    start: "2025-06",
    end: "2025-10",
    description: {
      en: "Built dashboard features in Next.js and improved page load time by 30%.",
      th: "พัฒนาฟีเจอร์ Dashboard ด้วย Next.js และลดเวลาโหลดหน้าเว็บลง 30%",
    },
  },
  {
    type: "education",
    title: {
      en: "B.Sc. Computer Science",
      th: "วิทยาศาสตรบัณฑิต สาขาวิทยาการคอมพิวเตอร์",
    },
    organization: { en: "Example University", th: "มหาวิทยาลัยตัวอย่าง" },
    start: "2022-06",
    description: {
      en: "Focused on software engineering and human-computer interaction.",
      th: "เน้นวิศวกรรมซอฟต์แวร์และการออกแบบปฏิสัมพันธ์ระหว่างคนกับคอมพิวเตอร์",
    },
  },
];
