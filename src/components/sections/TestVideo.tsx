"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type TestRun = {
  name: string;
  language: string;
  video: string;
  poster: string;
  codeUrl: string;
  /** ความยาววิดีโอ (วินาที) */
  duration: number;
  passed: boolean;
  /** ชุดเทสต์ (หน้าเว็บที่ทดสอบ) ตามลำดับในวิดีโอ */
  groups: { id: string; label: string }[];
  /** เทสต์แต่ละตัว ชุดที่อยู่ และวินาทีที่เริ่มในวิดีโอ */
  steps: { group: string; title: string; start: number }[];
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

/** การ์ดวิดีโอเทสต์ (ภาพตัวอย่าง + ปุ่ม Watch + ชุดเทสต์) กดแล้วเปิด popup วิดีโอ */
export function TestVideo({ run, labels }: { run: TestRun; labels: Labels }) {
  const [open, setOpen] = useState(false);
  const total = run.steps.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-6 grid w-full overflow-hidden rounded-xl border border-border bg-card text-left transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_32px_-12px_var(--accent)] focus-visible:border-accent focus-visible:outline-none lg:grid-cols-[3fr_2fr]"
      >
        <div className="relative">
          <Image
            src={run.poster}
            alt=""
            width={1280}
            height={720}
            className="aspect-video h-full w-full object-cover object-top"
          />
          <span className="absolute inset-0 grid place-items-center bg-black/30 transition group-hover:bg-black/15">
            <span className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground shadow-lg transition group-hover:scale-105">
              <svg aria-hidden width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {labels.watch}
            </span>
          </span>
          <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-xs text-white">
            {clock(run.duration)}
          </span>
        </div>

        <div className="flex flex-col p-6">
          <h3 className="text-xl font-semibold">{run.name}</h3>
          <p className="mt-1 text-sm text-muted">{run.language}</p>
          <ul className="mt-5 space-y-2 font-mono text-sm">
            {run.groups.map((group) => (
              <li key={group.id} className="flex justify-between gap-4 border-b border-border pb-2">
                <span>{group.label}</span>
                <span className="text-muted">
                  {format(labels.tests, {
                    count: run.steps.filter((step) => step.group === group.id).length,
                  })}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-5 font-mono text-sm text-accent">
            {run.passed ? "✓ " : "✗ "}
            {format(labels.passed, { passed: run.passed ? total : 0, total })}
          </p>
        </div>
      </button>

      {open && <VideoDialog run={run} labels={labels} onClose={() => setOpen(false)} />}
    </>
  );
}

/** Popup: วิดีโอ + รายการเทสต์ที่ไฮไลต์ตามเวลาในวิดีโอ (กดชื่อเทสต์เพื่อกระโดดไปช่วงนั้น) */
function VideoDialog({
  run,
  labels,
  onClose,
}: {
  run: TestRun;
  labels: Labels;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  // เทสต์ที่กำลังรันอยู่ในวิดีโอ = เทสต์สุดท้ายที่เริ่มแล้ว
  const current = run.steps.findLastIndex((step) => time >= step.start);

  // เลื่อนรายการให้เห็นเทสต์ที่กำลังรัน (เฉพาะตอนรายการมี scroll ของตัวเอง เช่นบนจอใหญ่)
  useEffect(() => {
    const box = list.current;
    const item = box?.querySelector<HTMLElement>(`[data-step="${current}"]`);
    if (!box || !item || box.scrollHeight <= box.clientHeight) return;
    box.scrollTo({ top: item.offsetTop - box.clientHeight / 2, behavior: "smooth" });
  }, [current]);

  const seek = (start: number) => {
    if (!video.current) return;
    video.current.currentTime = start;
    video.current.play();
  };

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => {
        // กดพื้นหลังด้านนอกเพื่อปิด
        if (event.target === dialog.current) dialog.current.close();
      }}
      aria-label={run.name}
      className="m-auto w-[min(76rem,calc(100%-2rem))] rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div>
          <p className="font-semibold">
            {run.name} · {run.groups.map((group) => group.label).join(" · ")}
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

      <div className="grid lg:grid-cols-[1fr_20rem]">
        <video
          ref={video}
          src={run.video}
          poster={run.poster}
          controls
          autoPlay
          muted
          playsInline
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          className="aspect-video w-full bg-black"
        />

        {/* lg:h-0 lg:min-h-full: ให้ความสูงเท่าวิดีโอ แล้ว scroll รายการแทนการยืดทั้ง popup */}
        <div className="flex flex-col border-t border-border lg:h-0 lg:min-h-full lg:border-t-0 lg:border-l">
          <p className="px-5 pt-4 text-xs font-medium tracking-wider text-accent uppercase">
            {labels.steps} · {format(labels.tests, { count: run.steps.length })}
          </p>
          <ol ref={list} className="relative flex-1 overflow-y-auto p-3 font-mono text-sm">
            {run.groups.map((group) => (
              <li key={group.id} className="mb-2">
                <p className="px-2 pt-1 pb-1 text-xs text-muted">{group.label}</p>
                <ol className="space-y-0.5">
                  {run.steps.map((step, index) => {
                    if (step.group !== group.id) return null;
                    const state =
                      index < current ? "done" : index === current ? "running" : "pending";
                    return (
                      <li key={step.title} data-step={index}>
                        <button
                          type="button"
                          onClick={() => seek(step.start)}
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
              </li>
            ))}
          </ol>
          <a
            href={run.codeUrl}
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
