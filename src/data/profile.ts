import type { Localized } from "@/lib/localize";

/**
 * ข้อมูลส่วนตัว: แก้ไฟล์นี้ไฟล์เดียวเพื่อเปลี่ยนชื่อ ตำแหน่ง รูป และช่องทางติดต่อ
 */
export const profile = {
  name: {
    en: "Sawarut Songmueang",
    // TODO: เปลี่ยนเป็นชื่อ-นามสกุลภาษาไทย
    th: "Sawarut Songmueang",
  } satisfies Localized,

  role: {
    en: "QA Engineer & Software Developer",
    th: "QA Engineer & Software Developer",
  } satisfies Localized,

  /** ประโยคสั้นๆ ใต้ชื่อในส่วน Hero */
  tagline: {
    en: "I test software so it works in real life, and build it so it's worth testing.",
    th: "ทดสอบซอฟต์แวร์ให้ใช้งานได้จริง และพัฒนาซอฟต์แวร์ให้มีคุณภาพตั้งแต่ต้น",
  } satisfies Localized,

  /** ย่อหน้าในส่วน About แต่ละ string คือ 1 ย่อหน้า */
  about: {
    en: [
      "I'm a final-year Computer Engineering and Artificial Intelligence student at Panyapiwat Institute of Management (PIM), currently working as a software developer intern on a case management system for a government agency.",
      "Before that, I spent five months as a QA engineer intern, where I designed test cases, ran manual and automated tests with Cypress, and tested APIs with Postman. That experience shapes how I write code: I think about how it can break before I ship it.",
      "I'm also interested in AI and computer vision, and I enjoy learning new tools by building small projects.",
    ],
    th: [
      "นักศึกษาปีสุดท้าย สาขาวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์ สถาบันการจัดการปัญญาภิวัฒน์ (PIM) ตอนนี้ฝึกงานตำแหน่ง Software Developer พัฒนาระบบบริหารจัดการคดีให้หน่วยงานภาครัฐ",
      "ก่อนหน้านี้ฝึกงานเป็น QA Engineer 5 เดือน ออกแบบ Test Case ทดสอบทั้งแบบ Manual และ Automated ด้วย Cypress และทดสอบ API ด้วย Postman ประสบการณ์นี้ทำให้เวลาเขียนโค้ดจะคิดก่อนเสมอว่าระบบพังได้ตรงไหนบ้าง",
      "สนใจด้าน AI และ Computer Vision และชอบเรียนรู้เครื่องมือใหม่ๆ ด้วยการลงมือทำโปรเจกต์เล็กๆ",
    ],
  } satisfies Localized<string[]>,

  location: {
    en: "Bangkok, Thailand",
    th: "กรุงเทพฯ ประเทศไทย",
  } satisfies Localized,

  /** รูปโปรไฟล์ วางไฟล์ไว้ใน public/images/ */
  avatar: "/images/avatar.svg",

  /**
   * ไฟล์ Resume แยกตามภาษา วางไฟล์ไว้ใน public/resume/
   * ตั้งเป็น null เพื่อซ่อนปุ่ม Download resume
   */
  resume: null as Localized | null,

  email: "sawarutreal@gmail.com",

  /** ช่องทางโซเชียล ลบบรรทัดไหนออก ไอคอนนั้นจะไม่แสดง */
  socials: {
    github: "https://github.com/SleeppyX",
  } as { github?: string; linkedin?: string },
};
