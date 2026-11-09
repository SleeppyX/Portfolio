"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

type Run = {
  status: string;
  conclusion: string | null;
  html_url: string;
  updated_at: string;
};

type CiStatusProps = {
  /** เช่น "SleeppyX/Portfolio" */
  repo: string;
  /** ชื่อไฟล์ workflow เช่น "e2e.yml" */
  workflow: string;
  labels: { title: string; success: string; failure: string; running: string; unknown: string };
};

/** "3 ชั่วโมงที่แล้ว" ตามภาษาของหน้า */
function timeAgo(iso: string, locale: string) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return format.format(0, "minute");
}

/**
 * สถานะ CI รอบล่าสุดบน branch main ดึงสดจาก GitHub API (ไม่ต้องใช้ token)
 * ถ้าดึงไม่ได้ (เช่น ติดโควตา 60 ครั้ง/ชม.) ยังแสดงลิงก์ไปหน้า Actions ได้
 */
export function CiStatus({ repo, workflow, labels }: CiStatusProps) {
  const locale = useLocale();
  const [run, setRun] = useState<Run | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(
      `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/runs?branch=main&per_page=1`,
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return;
        const latest = data.workflow_runs?.[0];
        if (latest) setRun(latest);
        else setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [repo, workflow]);

  const state = !run
    ? "unknown"
    : run.status !== "completed"
      ? "running"
      : run.conclusion === "success"
        ? "success"
        : "failure";
  const dot = {
    success: "bg-accent",
    failure: "bg-danger",
    running: "bg-yellow-500 animate-pulse",
    unknown: "bg-muted",
  }[state];

  return (
    <a
      href={run?.html_url ?? `https://github.com/${repo}/actions/workflows/${workflow}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 hover:border-accent"
    >
      <span aria-hidden className={`size-2 rounded-full ${dot}`} />
      <span className="font-semibold">{labels.title}</span>
      <span className={state === "failure" ? "text-danger" : "text-muted"}>
        {run || failed ? labels[state] : "…"}
        {run && ` · ${timeAgo(run.updated_at, locale)}`}
      </span>
    </a>
  );
}
