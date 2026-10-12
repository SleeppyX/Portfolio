import type { Localized } from "@/lib/localize";

/**
 * ข้อมูลส่วนตัว: แก้ไฟล์นี้ไฟล์เดียวเพื่อเปลี่ยนชื่อ ตำแหน่ง รูป และช่องทางติดต่อ
 * (ตอนนี้เป็นข้อมูลตัวอย่าง ให้เปลี่ยนเป็นของจริง)
 */
export const profile = {
  name: {
    en: "Leepx Example",
    th: "ลีพเอ็กซ์ ตัวอย่าง",
  } satisfies Localized,

  role: {
    en: "Frontend Developer",
    th: "Frontend Developer",
  } satisfies Localized,

  /** ประโยคสั้นๆ ใต้ชื่อในส่วน Hero */
  tagline: {
    en: "I build fast, accessible web apps with React and Next.js.",
    th: "พัฒนาเว็บแอปที่เร็วและใช้งานง่ายด้วย React และ Next.js",
  } satisfies Localized,

  /** ย่อหน้าในส่วน About แต่ละ string คือ 1 ย่อหน้า */
  about: {
    en: [
      "I'm a developer who enjoys turning ideas into clean, usable interfaces. I care about readable code, performance, and the small details that make a product feel good.",
      "Recently I've been focusing on Next.js, TypeScript, and design systems. Outside of work I like learning new tools and building side projects.",
    ],
    th: [
      "เป็นนักพัฒนาที่ชอบเปลี่ยนไอเดียให้เป็นหน้าจอที่ใช้งานง่าย ให้ความสำคัญกับโค้ดที่อ่านง่าย ประสิทธิภาพ และรายละเอียดเล็กๆ ที่ทำให้ผลิตภัณฑ์ใช้แล้วรู้สึกดี",
      "ช่วงนี้โฟกัสที่ Next.js, TypeScript และ Design System นอกเวลางานชอบลองเครื่องมือใหม่ๆ และทำโปรเจกต์ส่วนตัว",
    ],
  } satisfies Localized<string[]>,

  location: {
    en: "Bangkok, Thailand",
    th: "กรุงเทพฯ ประเทศไทย",
  } satisfies Localized,

  /** รูปโปรไฟล์ วางไฟล์ไว้ใน public/images/ */
  avatar: "/images/avatar.svg",

  /** ไฟล์ Resume แยกตามภาษา วางไฟล์ไว้ใน public/resume/ */
  resume: {
    en: "/resume/resume-en.pdf",
    th: "/resume/resume-th.pdf",
  } satisfies Localized,

  email: "hello@example.com",

  socials: {
    github: "https://github.com/your-username",
    linkedin: "https://www.linkedin.com/in/your-username",
  },
};
