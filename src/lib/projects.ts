import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { routing, type Locale } from "@/i18n/routing";

/**
 * อ่านผลงานจาก content/projects/
 *
 * แต่ละผลงานมีไฟล์:
 *   <slug>.en.mdx  ต้องมีเสมอ และเก็บข้อมูลหลักทั้งหมด (รูป, tag, ลิงก์ ฯลฯ)
 *   <slug>.th.mdx  ไม่บังคับ ใส่แค่ title/summary + เนื้อหาภาษาไทย
 *                  ถ้าไม่มีไฟล์นี้ หน้าภาษาไทยจะแสดงเนื้อหาภาษาอังกฤษแทน
 */

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

const yearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'ต้องเป็นรูปแบบ "YYYY-MM" เช่น "2025-03"');

/** ข้อมูลที่ต้องมีใน frontmatter ของไฟล์ .en.mdx */
const baseSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  /** path รูปปกใน public/ เช่น /images/projects/my-app.png */
  cover: z.string().startsWith("/"),
  tags: z.array(z.string()).min(1),
  date: yearMonth,
  featured: z.boolean().default(false),
  demo: z.url().optional(),
  repo: z.url().optional(),
});

/** ไฟล์ภาษาอื่นแปลได้แค่ข้อความ ข้อมูลอื่นใช้จากไฟล์ .en.mdx */
const translationSchema = baseSchema.pick({ title: true, summary: true });

export type ProjectMeta = z.infer<typeof baseSchema> & { slug: string };

export type Project = ProjectMeta & {
  /** เนื้อหา MDX (ส่วนหลัง frontmatter) */
  content: string;
  /** true = ไม่มีไฟล์ภาษานี้ เลยแสดงภาษาอังกฤษแทน */
  isFallback: boolean;
};

function filePath(slug: string, locale: Locale) {
  return path.join(PROJECTS_DIR, `${slug}.${locale}.mdx`);
}

/** แปลง frontmatter ด้วย schema ถ้าข้อมูลผิดจะ error บอกชื่อไฟล์และ field ที่ผิด */
function parse<T extends z.ZodType>(schema: T, data: unknown, file: string) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `ข้อมูลผลงานไม่ถูกต้องในไฟล์ ${path.relative(process.cwd(), file)}\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data as z.infer<T>;
}

/** รายชื่อ slug ของผลงานทั้งหมด (ดูจากไฟล์ .en.mdx) */
export function getProjectSlugs(): string[] {
  const suffix = `.${routing.defaultLocale}.mdx`;
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((name) => name.endsWith(suffix))
    .map((name) => name.slice(0, -suffix.length));
}

export function getProject(slug: string, locale: Locale): Project | null {
  const baseFile = filePath(slug, routing.defaultLocale);
  if (!fs.existsSync(baseFile)) return null;

  const base = matter(fs.readFileSync(baseFile, "utf8"));
  const meta = parse(baseSchema, base.data, baseFile);

  const localeFile = filePath(slug, locale);
  if (locale === routing.defaultLocale || !fs.existsSync(localeFile)) {
    return {
      ...meta,
      slug,
      content: base.content,
      isFallback: locale !== routing.defaultLocale,
    };
  }

  const translated = matter(fs.readFileSync(localeFile, "utf8"));
  const text = parse(translationSchema, translated.data, localeFile);
  return {
    ...meta,
    ...text,
    slug,
    content: translated.content,
    isFallback: false,
  };
}

/** ผลงานทั้งหมด เรียงจากใหม่ไปเก่า */
export function getAllProjects(locale: Locale): ProjectMeta[] {
  return getProjectSlugs()
    .map((slug) => getProject(slug, locale))
    .filter((project): project is Project => project !== null)
    .map(({ content: _content, isFallback: _isFallback, ...meta }) => meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** ผลงานที่ตั้ง featured: true สำหรับโชว์บนหน้าแรก */
export function getFeaturedProjects(locale: Locale): ProjectMeta[] {
  return getAllProjects(locale).filter((project) => project.featured);
}

/** tag ทั้งหมดที่ใช้ในผลงาน (ไม่ซ้ำ เรียงตามตัวอักษร) สำหรับปุ่มกรอง */
export function getAllTags(projects: ProjectMeta[]): string[] {
  return [...new Set(projects.flatMap((project) => project.tags))].sort();
}
