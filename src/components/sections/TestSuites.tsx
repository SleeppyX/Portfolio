"use client";

import { useState } from "react";

export type Suite = {
  id: string;
  name: string;
  language: string;
  file: string;
  code: string;
  tests: number;
  /** หน้าที่ชุดนี้เทสต์ เช่น "Bio page" */
  target: string;
  /** ลิงก์ไปดูไฟล์บน GitHub */
  url: string;
};

type TestSuitesProps = {
  suites: Suite[];
  viewLabel: string;
  /** มี {count} ให้แทนค่า เช่น "{count} tests" */
  testsLabel: string;
};

/** แท็บสลับดูโค้ดเทสต์ของแต่ละ framework (ใช้สีหน้าต่างชุดเดียวกับ Test Runner) */
export function TestSuites({ suites, viewLabel, testsLabel }: TestSuitesProps) {
  const [active, setActive] = useState(suites[0].id);
  const suite = suites.find((s) => s.id === active) ?? suites[0];
  const lines = suite.code.split("\n");

  return (
    <div className="mt-6">
      <div role="tablist" aria-label="Test frameworks" className="flex flex-wrap gap-2">
        {suites.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            id={`tab-${s.id}`}
            aria-selected={s.id === active}
            aria-controls="test-suite-panel"
            onClick={() => setActive(s.id)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              s.id === active
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted hover:border-accent hover:text-foreground"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div
        id="test-suite-panel"
        role="tabpanel"
        aria-labelledby={`tab-${suite.id}`}
        className="test-runner mt-4 overflow-hidden rounded-xl border border-(--t-border) bg-(--t-bg) font-mono text-sm text-(--t-fg)"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-(--t-border) bg-(--t-bar) px-4 py-2.5 text-xs">
          <span className="text-(--t-fg)">{suite.file}</span>
          <span className="text-(--t-muted)">
            {suite.language} · {suite.target} · {testsLabel.replace("{count}", String(suite.tests))}
          </span>
          <a
            href={suite.url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-(--t-blue) hover:underline"
          >
            {viewLabel} ↗
          </a>
        </div>
        <pre className="max-h-96 overflow-auto p-4 leading-relaxed">
          <code>
            {lines.map((line, index) => (
              <span key={index} className="block">
                <span className="mr-4 inline-block w-6 text-right text-(--t-muted)/50 select-none">
                  {index + 1}
                </span>
                {line || " "}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
