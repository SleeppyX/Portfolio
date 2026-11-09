import fs from "node:fs";
import path from "node:path";
import { getTranslations } from "next-intl/server";
import { CiStatus } from "@/components/sections/CiStatus";
import { TestSuites, type Suite } from "@/components/sections/TestSuites";
import { Section } from "@/components/ui/Section";

/** repo และ workflow ที่รันเทสต์ (ใช้ดึงสถานะ CI และลิงก์ไปดูโค้ด) */
const REPO = "SleeppyX/Portfolio";
const WORKFLOW = "e2e.yml";

/** ชุดเทสต์ใน e2e/ แต่ละ framework เทสต์คนละหน้า */
const SUITES = [
  { id: "cypress", name: "Cypress", language: "JavaScript", file: "e2e/cypress/e2e/bio.cy.js" },
  { id: "selenium", name: "Selenium", language: "Python", file: "e2e/selenium/test_portfolio.py" },
  {
    id: "robot",
    name: "Robot Framework",
    language: "Robot",
    file: "e2e/robot/projects.robot",
  },
] as const;

/** นับจำนวนเทสต์ในไฟล์ตามรูปแบบของแต่ละ framework */
function countTests(id: (typeof SUITES)[number]["id"], code: string) {
  if (id === "cypress") return code.match(/^\s*it\(/gm)?.length ?? 0;
  if (id === "selenium") return code.match(/^def test_/gm)?.length ?? 0;
  // Robot: ชื่อเทสต์คือบรรทัดที่ไม่เยื้อง ใต้หัวข้อ *** Test Cases ***
  const cases = code.split(/^\*\*\* Test Cases \*\*\*$/m)[1] ?? "";
  return cases.split("\n").filter((line) => /^\S/.test(line)).length;
}

/** Automated Testing: โค้ดเทสต์จริงของเว็บนี้ 3 framework + สถานะ CI ล่าสุด */
export async function AutomatedTesting() {
  const t = await getTranslations("Testing");

  // อ่านไฟล์ตอน build (หน้านี้เป็น static) โค้ดที่แสดงจึงตรงกับที่ CI รันเสมอ
  const suites: Suite[] = SUITES.map((suite) => {
    const code = fs.readFileSync(path.join(process.cwd(), suite.file), "utf8").trimEnd();
    return {
      ...suite,
      code,
      tests: countTests(suite.id, code),
      target: t(`targets.${suite.id}`),
      url: `https://github.com/${REPO}/blob/main/${suite.file}`,
    };
  });
  const total = suites.reduce((sum, suite) => sum + suite.tests, 0);

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

      <TestSuites suites={suites} viewLabel={t("viewOnGithub")} testsLabel={t.raw("tests")} />
    </Section>
  );
}
