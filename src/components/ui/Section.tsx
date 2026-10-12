import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SectionProps = {
  /** id สำหรับลิงก์จากเมนู เช่น "about" → /#about */
  id: string;
  title: string;
  children: ReactNode;
};

/** กรอบมาตรฐานของแต่ละส่วนบนหน้าแรก (ระยะห่าง + หัวข้อ + animation) */
export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 py-16 sm:py-24">
      <Reveal>
        <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {children}
      </Reveal>
    </section>
  );
}
