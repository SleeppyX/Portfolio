# Portfolio

เว็บ Portfolio สองภาษา (EN / TH) สร้างด้วย Next.js, TypeScript, Tailwind CSS และ MDX

## เริ่มใช้งาน

```bash
npm install     # ติดตั้งครั้งแรก
npm run dev     # เปิดเว็บที่ http://localhost:3000
```

| คำสั่ง           | ใช้ทำอะไร                                          |
| ---------------- | -------------------------------------------------- |
| `npm run dev`    | เปิดเว็บสำหรับพัฒนา (แก้ไฟล์แล้วหน้าเว็บอัปเดตเอง) |
| `npm run build`  | build เว็บจริง (ตรวจข้อมูลผลงานทั้งหมดด้วย)        |
| `npm run format` | จัดรูปแบบโค้ดทุกไฟล์ด้วย Prettier                  |
| `npm run check`  | ตรวจ lint + type + format ก่อน push                |

## โครงสร้างโฟลเดอร์

```
content/projects/        ← ผลงาน (ไฟล์ .mdx 1 ไฟล์ต่อ 1 ภาษา)
messages/                ← ข้อความบนปุ่ม/เมนู/หัวข้อ (en.json, th.json)
public/
  images/                ← รูปโปรไฟล์ และ images/projects/ รูปปกผลงาน
  resume/                ← ไฟล์ Resume (resume-en.pdf, resume-th.pdf)
src/
  data/                  ← ข้อมูลส่วนตัว ทักษะ ประสบการณ์
    profile.ts           ← ชื่อ ตำแหน่ง About อีเมล ลิงก์ GitHub/LinkedIn
    skills.ts            ← ทักษะแบ่งกลุ่ม
    experience.ts        ← Timeline งานและการศึกษา
  app/[locale]/          ← หน้าเว็บ (routes)
    page.tsx             ← หน้าแรก (เรียงลำดับ section ที่นี่)
    projects/page.tsx    ← หน้ารวมผลงาน + ตัวกรอง
    projects/[slug]/     ← หน้ารายละเอียดผลงาน
  components/
    sections/            ← แต่ละส่วนของหน้าแรก (Hero, About, Skills, ...)
    projects/            ← การ์ดผลงาน, ตัวกรอง, ตัวแสดง MDX
    layout/              ← Header, Footer, ปุ่มสลับภาษา/ธีม
    ui/                  ← ชิ้นส่วนเล็กที่ใช้ซ้ำ (Button, Tag, Section, ...)
  lib/                   ← ฟังก์ชันช่วย (อ่านไฟล์ผลงาน, จัดรูปแบบวันที่, เลือกภาษา)
  i18n/                  ← ตั้งค่าระบบภาษา
  app/globals.css        ← สีของทั้งเว็บ
```

**หลักง่ายๆ:** เปลี่ยน _ข้อมูล_ แก้ใน `src/data/`, `content/` หรือ `messages/` ส่วน _หน้าตา_ แก้ใน `src/components/`

## งานที่ทำบ่อย

### แก้ข้อมูลส่วนตัว

แก้ `src/data/profile.ts` ข้อความที่มีสองภาษาเขียนเป็น `{ en: "...", th: "..." }`

- รูปโปรไฟล์: วางไฟล์ใน `public/images/` แล้วแก้ `avatar`
- Resume: วางไฟล์แทนที่ `public/resume/resume-en.pdf` และ `resume-th.pdf`
  ถ้ามีไฟล์เดียว ให้ชี้ `resume.en` กับ `resume.th` ไปที่ไฟล์เดียวกัน

### เพิ่มผลงานใหม่

1. วางรูปปกใน `public/images/projects/` (แนะนำอัตราส่วน 16:9 เช่น 1200×675)
2. สร้างไฟล์ `content/projects/<slug>.en.mdx` โดย `<slug>` จะเป็น URL เช่น `my-app` → `/en/projects/my-app`

   ```mdx
   ---
   title: My App
   summary: คำอธิบายสั้นๆ 1-2 บรรทัด แสดงบนการ์ด
   cover: /images/projects/my-app.png
   tags: [Next.js, TypeScript]
   date: "2026-01" # ปี-เดือน ใช้เรียงลำดับ (ใหม่สุดขึ้นก่อน)
   featured: true # true = โชว์บนหน้าแรก (ไม่ใส่ = false)
   demo: https://... # ไม่บังคับ
   repo: https://github.com/... # ไม่บังคับ
   ---

   ## Overview

   เขียนรายละเอียดด้วย Markdown ได้เลย ใส่หัวข้อ รายการ รูป ลิงก์ ได้ตามปกติ
   ```

3. (ไม่บังคับ) สร้าง `content/projects/<slug>.th.mdx` สำหรับภาษาไทย
   ใส่แค่ `title` กับ `summary` ใน frontmatter แล้วตามด้วยเนื้อหาภาษาไทย
   ข้อมูลอื่น (รูป, tag, วันที่, ลิงก์) ดึงจากไฟล์ `.en.mdx` ให้เอง

   ```mdx
   ---
   title: My App
   summary: คำอธิบายภาษาไทย
   ---

   ## ภาพรวม

   ...
   ```

   ถ้าไม่สร้างไฟล์ภาษาไทย หน้าภาษาไทยจะแสดงเนื้อหาภาษาอังกฤษพร้อมข้อความแจ้ง

> ถ้ากรอก frontmatter ผิด (ลืม field, วันที่ผิดรูปแบบ, URL ไม่ถูก)
> หน้าเว็บจะ error พร้อมบอกชื่อไฟล์และ field ที่ผิด

### แก้ทักษะ / ประสบการณ์

- ทักษะ: `src/data/skills.ts` เพิ่มชื่อใน `items` หรือเพิ่มกลุ่มใหม่
- ประสบการณ์/การศึกษา: `src/data/experience.ts` เรียงจากใหม่ไปเก่า
  ไม่ใส่ `end` = ยังทำอยู่ (แสดงเป็น Present / ปัจจุบัน)

### แก้ข้อความบนเมนู / ปุ่ม / หัวข้อ

แก้ใน `messages/en.json` และ `messages/th.json` (ต้องมี key เหมือนกันทั้งสองไฟล์)

### เปลี่ยนสีเว็บ

แก้ตัวแปร `--accent` ใน `src/app/globals.css` (มีสองที่: โหมดสว่าง `:root` และโหมดมืด `.dark`)

### เพิ่ม/ลบ/สลับ section บนหน้าแรก

แก้รายการ component ใน `src/app/[locale]/page.tsx`
ถ้าเพิ่ม section ใหม่ ให้เพิ่ม id ใน `navItems` ของ `src/components/layout/Header.tsx` ด้วย

## Deploy (GitHub + Vercel)

1. สร้าง repo บน GitHub แล้ว push โค้ดนี้ขึ้นไป
2. เข้า [vercel.com](https://vercel.com) → **Add New Project** → เลือก repo → **Deploy** (ไม่ต้องตั้งค่าอะไรเพิ่ม)
3. หลังจากนี้ทุกครั้งที่ push ขึ้น `main` เว็บจะอัปเดตเอง
4. ถ้ามีโดเมนของตัวเอง ไปตั้งที่ Project → Settings → Domains

## Tech stack

- [Next.js](https://nextjs.org) (App Router, static generation)
- [next-intl](https://next-intl.dev): ระบบสองภาษา `/en`, `/th`
- [Tailwind CSS](https://tailwindcss.com) + `@tailwindcss/typography`
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) + [gray-matter](https://github.com/jonschlinkert/gray-matter): อ่านผลงานจากไฟล์ MDX
- [Zod](https://zod.dev): ตรวจ frontmatter ของผลงาน
- [next-themes](https://github.com/pacocoursey/next-themes): โหมดมืด/สว่าง
- ESLint + Prettier
