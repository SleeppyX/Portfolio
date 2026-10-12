import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SectionProps = {
  /** id สำหรับลิงก์จากเมนู เช่น "about" → /#about */
  id: string;
  title: string;
  children: ReactNode;
};

/** เวลาเทสต์ปลอมของแต่ละ section (คำนวณจาก id ให้ได้ค่าเดิมทุกครั้ง) */
function fakeDuration(id: string) {
  const hash = [...id].reduce((sum, char) => sum * 31 + char.charCodeAt(0), 7);
  return 12 + (Math.abs(hash) % 48);
}

/** กรอบมาตรฐานของแต่ละส่วนบนหน้าแรก (ระยะห่าง + หัวข้อ + animation) */
export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 py-16 sm:py-24">
      <Reveal>
        <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {/* สถานะเทสต์: หมุนก่อน แล้วเป็น ✓ ตอนเลื่อนมาถึง (style อยู่ใน globals.css) */}
          <span aria-hidden className="grid size-6 place-items-center text-accent">
            <span className="test-status-spinner size-4 animate-spin rounded-full border-2 border-muted border-t-transparent" />
            <span className="test-status-pass text-xl leading-none">✓</span>
          </span>
          {title}
          <span aria-hidden className="test-status-pass font-mono text-xs font-normal text-muted">
            {fakeDuration(id)}ms
          </span>
        </h2>
        {children}
      </Reveal>
    </section>
  );
}
