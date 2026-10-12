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
    title: { en: "Software Developer Intern", th: "นักศึกษาฝึกงาน Software Developer" },
    // ไม่ระบุชื่อหน่วยงานตามข้อตกลงของโปรเจกต์
    organization: { en: "Government agency project", th: "โปรเจกต์ของหน่วยงานภาครัฐ" },
    start: "2026-09",
    description: {
      en: "Building a web-based case management prototype with role-based workflows, document generation, and dashboards.",
      th: "พัฒนา prototype ระบบบริหารจัดการคดีบนเว็บ มีขั้นตอนงานแยกตามบทบาทผู้ใช้ ระบบสร้างเอกสาร และ Dashboard",
    },
  },
  {
    type: "work",
    title: { en: "QA Engineer Intern", th: "นักศึกษาฝึกงาน QA Engineer" },
    organization: { en: "Internship", th: "ฝึกงาน" },
    start: "2025-01",
    end: "2025-05",
    description: {
      en: "Designed and ran test cases from system requirements, automated tests with Cypress, tested APIs with Postman, and logged and verified bugs through regression testing.",
      th: "ออกแบบและรัน Test Case จาก Requirement ทำ Automated Test ด้วย Cypress ทดสอบ API ด้วย Postman บันทึก Bug และตรวจสอบการแก้ไขด้วย Regression Test",
    },
  },
  {
    type: "work",
    title: { en: "Retail Internship", th: "นักศึกษาฝึกงานค้าปลีก" },
    organization: { en: "7-Eleven", th: "7-Eleven" },
    start: "2024-03",
    end: "2024-05",
    description: {
      en: "Handled customers, the point-of-sale system, and delivery orders during busy hours.",
      th: "ดูแลลูกค้า ระบบขายหน้าร้าน และออเดอร์เดลิเวอรีในช่วงเวลาเร่งด่วน",
    },
  },
  {
    type: "education",
    title: {
      en: "B.Eng. Computer Engineering and Artificial Intelligence",
      th: "วิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์",
    },
    organization: {
      en: "Panyapiwat Institute of Management (PIM)",
      th: "สถาบันการจัดการปัญญาภิวัฒน์ (PIM)",
    },
    start: "2023-06",
    description: {
      en: "Faculty of Engineering and Technology. GPAX 3.64.",
      th: "คณะวิศวกรรมศาสตร์และเทคโนโลยี เกรดเฉลี่ยสะสม 3.64",
    },
  },
];
