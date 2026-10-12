"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TestStatus = "pending" | "running" | "pass" | "fail";

type TestLine = {
  status: TestStatus;
  /** เวลาที่เทสต์ใช้ (ms) มีค่าเมื่อผ่านแล้ว */
  duration?: number;
};

type TestRunnerProps = {
  /** ชื่อชุดเทสต์ (ชื่อเจ้าของเว็บ) */
  suite: string;
  /** ข้อความของเทสต์แต่ละบรรทัด */
  tests: string[];
  /** ข้อความปุ่มรันใหม่ สำหรับ screen reader */
  rerunLabel: string;
};

/** จังหวะเวลาของ animation (ms) */
const START_DELAY = 300;
const STEP = 250;
const FAIL_PAUSE = 600;
const RETRY_PAUSE = 450;
/** โอกาสที่กด Re-run แล้วจะเจอเทสต์ fail ก่อน retry ผ่าน (easter egg) */
const FLAKY_CHANCE = 1 / 3;

const randomDuration = () => 8 + Math.floor(Math.random() * 52);

/**
 * หน้าต่างจำลองการรันเทสต์ใน Hero: แต่ละบรรทัดหมุนแล้วขึ้น ✓ ทีละบรรทัด
 * กด Re-run แล้วบางครั้งจะมีเทสต์ fail ก่อน retry ผ่าน
 * ถ้าเครื่องตั้งค่า reduced motion จะแสดงผลลัพธ์สุดท้ายทันที
 */
export function TestRunner({ suite, tests, rerunLabel }: TestRunnerProps) {
  const [lines, setLines] = useState<TestLine[]>(() => tests.map(() => ({ status: "pending" })));
  const [message, setMessage] = useState<{ text: string; tone: "fail" | "retry" } | null>(null);
  const [retried, setRetried] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const run = useCallback(
    (allowFlaky: boolean) => {
      clearTimers();
      const at = (ms: number, step: () => void) => {
        timers.current.push(window.setTimeout(step, ms));
      };
      const update = (index: number, line: TestLine) =>
        setLines((current) => current.map((old, i) => (i === index ? line : old)));

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        at(0, () => {
          setLines(tests.map(() => ({ status: "pass", duration: randomDuration() })));
          setMessage(null);
          setRetried(false);
          setDone(true);
        });
        return;
      }

      const flakyIndex =
        allowFlaky && Math.random() < FLAKY_CHANCE ? Math.floor(Math.random() * tests.length) : -1;

      at(0, () => {
        setLines(tests.map(() => ({ status: "pending" })));
        setMessage(null);
        setRetried(flakyIndex >= 0);
        setDone(false);
      });

      let time = START_DELAY;
      tests.forEach((_, index) => {
        at(time, () => update(index, { status: "running" }));
        time += STEP;

        if (index === flakyIndex) {
          at(time, () => {
            update(index, { status: "fail" });
            setMessage({ text: "AssertionError: Timed out after 4000ms", tone: "fail" });
          });
          time += FAIL_PAUSE;
          at(time, () => {
            update(index, { status: "running" });
            setMessage({ text: "Retrying (1/2)...", tone: "retry" });
          });
          time += RETRY_PAUSE;
        }

        at(time, () => {
          update(index, { status: "pass", duration: randomDuration() });
          if (index === flakyIndex) setMessage(null);
        });
      });

      at(time, () => setDone(true));
    },
    [tests],
  );

  useEffect(() => {
    run(false);
    return clearTimers;
  }, [run]);

  const total = lines.reduce((sum, line) => sum + (line.duration ?? 0), 0);

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] font-mono text-sm text-[#e6edf3] shadow-2xl shadow-black/30">
      {/* แถบหัวหน้าต่าง */}
      <div className="flex items-center gap-2 border-b border-[#30363d] bg-[#161b22] px-4 py-2.5">
        <span aria-hidden className="size-3 rounded-full bg-[#f85149]" />
        <span aria-hidden className="size-3 rounded-full bg-[#d29922]" />
        <span aria-hidden className="size-3 rounded-full bg-[#3fb950]" />
        <span className="ml-2 flex-1 text-xs text-[#8b949e]">portfolio.cy.js</span>
        <button
          type="button"
          onClick={() => run(true)}
          disabled={!done}
          aria-label={rerunLabel}
          title={rerunLabel}
          className="rounded px-1.5 text-base leading-none text-[#8b949e] transition-colors hover:text-[#3fb950] focus-visible:outline-2 focus-visible:outline-[#3fb950] disabled:opacity-40"
        >
          ↻
        </button>
      </div>

      <div className="space-y-1 p-4 sm:p-5">
        <p className="text-[#8b949e]">
          <span className="text-[#3fb950]">$</span> npx cypress run
        </p>
        <p className="pt-3 font-semibold">{suite}</p>

        <ul className="space-y-1 pl-2">
          {tests.map((test, index) => {
            const line = lines[index];
            return (
              <li key={test} className="flex items-start gap-2">
                <StatusIcon status={line.status} />
                <span
                  className={
                    line.status === "pending"
                      ? "text-[#8b949e]/50"
                      : line.status === "fail"
                        ? "text-[#f85149]"
                        : line.status === "pass"
                          ? "text-[#8b949e]"
                          : ""
                  }
                >
                  {test}
                  {line.duration !== undefined && (
                    <span className="ml-2 text-xs text-[#8b949e]/70">({line.duration}ms)</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        {/* บรรทัดสถานะ: ข้อความ error/retry ระหว่างรัน หรือสรุปผลตอนจบ */}
        <p aria-live="polite" className="min-h-6 pt-3">
          {message ? (
            <span className={message.tone === "fail" ? "text-[#f85149]" : "text-[#d29922]"}>
              {message.text}
            </span>
          ) : done ? (
            <>
              <span className="text-[#3fb950]">
                {tests.length} passing ({(total / 1000).toFixed(2)}s)
              </span>
              {retried && <span className="text-[#8b949e]"> · 1 flaky, retried</span>}
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: TestStatus }) {
  if (status === "running") {
    return (
      <span
        aria-hidden
        className="mt-[0.2rem] size-3.5 shrink-0 animate-spin rounded-full border-2 border-[#8b949e] border-t-transparent"
      />
    );
  }
  const icon = { pending: "○", pass: "✓", fail: "✗" }[status];
  const color = { pending: "text-[#8b949e]/50", pass: "text-[#3fb950]", fail: "text-[#f85149]" }[
    status
  ];
  return (
    <span aria-hidden className={`w-3.5 shrink-0 text-center ${color}`}>
      {icon}
    </span>
  );
}
