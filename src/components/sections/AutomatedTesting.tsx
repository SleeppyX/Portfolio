import { getTranslations } from "next-intl/server";
import { CiStatus } from "@/components/sections/CiStatus";
import { TestVideo } from "@/components/sections/TestVideo";
import { Section } from "@/components/ui/Section";
import run from "@/data/test-videos.json";

/** repo และ workflow ที่รันเทสต์ (ใช้ดึงสถานะ CI และลิงก์ไปดูโค้ด) */
const REPO = "SleeppyX/Portfolio";
const WORKFLOW = "e2e.yml";

/** ชื่อ describe ในแต่ละ spec ของ e2e/cypress → key ของคำแปลใน Testing.groups */
const GROUPS: Record<string, "bio" | "portfolio" | "projects"> = {
  "Bio page": "bio",
  "Portfolio page": "portfolio",
  "Project pages": "projects",
};

/** framework อื่นที่เคยใช้ (แสดงเป็น badge ไม่มีวิดีโอ) */
const ALSO_USED = [
  { name: "Selenium", language: "Python" },
  { name: "Robot Framework", language: "Robot" },
];

/** Automated Testing: วิดีโอตอนเทสต์ Cypress รันจริงทั้งเว็บ + สถานะ CI */
export async function AutomatedTesting() {
  const t = await getTranslations("Testing");

  // ชุดเทสต์ตามลำดับที่อยู่ในวิดีโอ
  const groups = [...new Set(run.steps.map((step) => step.group))].map((id) => ({
    id,
    label: t(`groups.${GROUPS[id] ?? "bio"}`),
  }));

  return (
    <Section id="testing" title={t("title")}>
      <p className="max-w-3xl text-lg text-muted">{t("intro")}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm">
        <CiStatus
          repo={REPO}
          workflow={WORKFLOW}
          labels={{
            title: t("ci"),
            success: t("status.success"),
            failure: t("status.failure"),
            running: t("status.running"),
            unknown: t("status.unknown"),
          }}
        />
        <span className="text-muted">
          {t("summary", { tests: run.steps.length, suites: groups.length })}
        </span>
      </div>

      <TestVideo
        run={{
          ...run,
          name: "Cypress",
          language: "JavaScript",
          groups,
          video: "/videos/cypress.mp4",
          poster: "/videos/cypress.jpg",
          codeUrl: `https://github.com/${REPO}/tree/main/e2e/cypress/e2e`,
        }}
        labels={{
          watch: t("watch"),
          close: t("close"),
          steps: t("steps"),
          viewCode: t("viewOnGithub"),
          recorded: t("recorded"),
          tests: t.raw("tests") as string,
          passed: t.raw("passed") as string,
        }}
      />

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <span className="mr-1 text-muted">{t("alsoUsed")}</span>
        {ALSO_USED.map((tool) => (
          <span
            key={tool.name}
            className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs"
          >
            {tool.name} <span className="text-muted">· {tool.language}</span>
          </span>
        ))}
      </div>
    </Section>
  );
}
