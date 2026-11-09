"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type TestVideo = {
  id: string;
  name: string;
  language: string;
  /** หน้าที่ชุดนี้เทสต์ เช่น "Bio page" */
  target: string;
  video: string;
  poster: string;
  codeUrl: string;
  /** ความยาววิดีโอ (วินาที) */
  duration: number;
  passed: boolean;
  /** เทสต์แต่ละตัว และวินาทีที่เริ่มในวิดีโอ */
  steps: { title: string; start: number }[];
};

type Labels = {
  watch: string;
  close: string;
  steps: string;
  viewCode: string;
  recorded: string;
  /** มี {count} ให้แทนค่า */
  tests: string;
  /** มี {passed} และ {total} ให้แทนค่า */
  passed: string;
};

const format = (template: string, values: Record<string, number>) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  );

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

/** การ์ดของแต่ละ framework (ภาพตัวอย่าง + ปุ่ม Watch) กดแล้วเปิด popup วิดีโอ */
export function TestVideos({ suites, labels }: { suites: TestVideo[]; labels: Labels }) {
  const [open, setOpen] = useState<TestVideo | null>(null);

  return (
    <>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {suites.map((suite) => (
          <button
            key={suite.id}
            type="button"
            onClick={() => setOpen(suite)}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_32px_-12px_var(--accent)] focus-visible:border-accent focus-visible:outline-none"
          >
            <div className="relative">
              <Image
                src={suite.poster}
                alt=""
                width={640}
                height={400}
                className="aspect-video w-full object-cover object-top"
              />
              <span className="absolute inset-0 grid place-items-center bg-black/30 transition group-hover:bg-black/15">
                <span className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-lg transition group-hover:scale-105">
                  <svg aria-hidden width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {labels.watch}
                </span>
              </span>
              <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-xs text-white">
                {clock(suite.duration)}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-semibold">{suite.name}</h3>
              <p className="mt-1 text-sm text-muted">
                {suite.language} · {suite.target}
              </p>
              <p className="mt-3 font-mono text-xs text-accent">
                {suite.passed ? "✓ " : "✗ "}
                {format(labels.passed, {
                  passed: suite.passed ? suite.steps.length : 0,
                  total: suite.steps.length,
                })}
              </p>
            </div>
          </button>
        ))}
      </div>

      {open && <VideoDialog suite={open} labels={labels} onClose={() => setOpen(null)} />}
    </>
  );
}

/** Popup: วิดีโอ + รายการเทสต์ที่ไฮไลต์ตามเวลาในวิดีโอ (กดชื่อเทสต์เพื่อกระโดดไปช่วงนั้น) */
function VideoDialog({
  suite,
  labels,
  onClose,
}: {
  suite: TestVideo;
  labels: Labels;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  // เทสต์ที่กำลังรันอยู่ในวิดีโอ = เทสต์สุดท้ายที่เริ่มแล้ว
  const current = suite.steps.findLastIndex((step) => time >= step.start);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => {
        // กดพื้นหลังด้านนอกเพื่อปิด
        if (event.target === dialog.current) dialog.current.close();
      }}
      aria-label={`${suite.name} · ${suite.target}`}
      className="m-auto w-[min(72rem,calc(100%-2rem))] rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div>
          <p className="font-semibold">
            {suite.name} · {suite.target}
          </p>
          <p className="text-xs text-muted">{labels.recorded}</p>
        </div>
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          aria-label={labels.close}
          className="rounded-lg p-2 text-muted hover:text-foreground"
        >
          <svg
            aria-hidden
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_18rem]">
        <video
          ref={video}
          src={suite.video}
          poster={suite.poster}
          controls
          autoPlay
          muted
          playsInline
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          className="aspect-video w-full bg-black"
        />

        <div className="flex flex-col border-t border-border lg:border-t-0 lg:border-l">
          <p className="px-5 pt-4 text-xs font-medium tracking-wider text-accent uppercase">
            {labels.steps} · {format(labels.tests, { count: suite.steps.length })}
          </p>
          <ol className="flex-1 space-y-1 p-3 font-mono text-sm">
            {suite.steps.map((step, index) => {
              const state = index < current ? "done" : index === current ? "running" : "pending";
              return (
                <li key={step.title}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!video.current) return;
                      video.current.currentTime = step.start;
                      video.current.play();
                    }}
                    className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-card ${
                      state === "running"
                        ? "bg-accent-soft text-foreground"
                        : state === "done"
                          ? "text-muted"
                          : "text-muted/60"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`w-4 shrink-0 ${state === "pending" ? "" : "text-accent"}`}
                    >
                      {state === "done" ? "✓" : state === "running" ? "▸" : "○"}
                    </span>
                    <span className="flex-1">{step.title}</span>
                    <span className="text-xs text-muted">{clock(step.start)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <a
            href={suite.codeUrl}
            target="_blank"
            rel="noreferrer"
            className="border-t border-border px-5 py-3 text-sm text-accent hover:underline"
          >
            {labels.viewCode} ↗
          </a>
        </div>
      </div>
    </dialog>
  );
}
