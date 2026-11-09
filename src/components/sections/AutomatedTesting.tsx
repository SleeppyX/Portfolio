import { getTranslations } from "next-intl/server";
import { CiStatus } from "@/components/sections/CiStatus";
import { TestVideos, type TestVideo } from "@/components/sections/TestVideos";
import { Section } from "@/components/ui/Section";
import videos from "@/data/test-videos.json";

/** repo และ workflow ที่รันเทสต์ (ใช้ดึงสถานะ CI และลิงก์ไปดูโค้ด) */
const REPO = "SleeppyX/Portfolio";
const WORKFLOW = "e2e.yml";

/** ชุดเทสต์ใน e2e/ แต่ละ framework เทสต์คนละหน้า (วิดีโอสร้างด้วย e2e/recorder) */
const SUITES = [
  { id: "cypress", name: "Cypress", language: "JavaScript", file: "e2e/cypress/e2e/bio.cy.js" },
  { id: "selenium", name: "Selenium", language: "Python", file: "e2e/selenium/test_portfolio.py" },
  { id: "robot", name: "Robot Framework", language: "Robot", file: "e2e/robot/projects.robot" },
] as const;

/** Automated Testing: การ์ดของแต่ละ framework กดแล้วดูวิดีโอตอนเทสต์รันจริง + สถานะ CI */
export async function AutomatedTesting() {
  const t = await getTranslations("Testing");

  const suites: TestVideo[] = SUITES.map((suite) => ({
    ...suite,
    ...videos[suite.id],
    target: t(`targets.${suite.id}`),
    video: `/videos/${suite.id}.mp4`,
    poster: `/videos/${suite.id}.jpg`,
    codeUrl: `https://github.com/${REPO}/blob/main/${suite.file}`,
  }));
  const total = suites.reduce((sum, suite) => sum + suite.steps.length, 0);

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
          {t("summary", { tests: total, frameworks: suites.length })}
        </span>
      </div>

      <TestVideos
        suites={suites}
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
    </Section>
  );
}
