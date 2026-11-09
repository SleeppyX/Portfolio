"use client";

import { useState, type ReactNode } from "react";

type DetectionFrameProps = {
  /** ป้ายบนกรอบ เช่น "person 0.97" */
  label: string;
  children: ReactNode;
};

/**
 * กรอบตรวจจับวัตถุแบบ YOLO รอบรูป: มุมกรอบวิ่งเข้ามาล็อก + เส้นสแกน + ป้ายผลลัพธ์
 * สแกนเองตอนเปิดหน้า และสแกนซ้ำเมื่อเอาเมาส์ชี้ (style อยู่ใน globals.css: .detect-*)
 */
export function DetectionFrame({ label, children }: DetectionFrameProps) {
  // เปลี่ยน key เพื่อสร้าง overlay ใหม่ = เล่น animation ใหม่ตั้งแต่ต้น
  const [scan, setScan] = useState(0);

  return (
    <div className="relative" onMouseEnter={() => setScan((n) => n + 1)}>
      {children}
      <div key={scan} aria-hidden className="pointer-events-none absolute -inset-3">
        <div className="detect-box absolute inset-0">
          <span className="absolute top-0 left-0 size-5 border-t-2 border-l-2 border-accent" />
          <span className="absolute top-0 right-0 size-5 border-t-2 border-r-2 border-accent" />
          <span className="absolute bottom-0 left-0 size-5 border-b-2 border-l-2 border-accent" />
          <span className="absolute right-0 bottom-0 size-5 border-r-2 border-b-2 border-accent" />
        </div>
        <span className="detect-label absolute -top-6 left-0 rounded-sm bg-accent px-1.5 py-0.5 font-mono text-[10px] leading-none text-accent-foreground">
          {label}
        </span>
        <div className="absolute inset-3 overflow-hidden rounded-full">
          <span className="detect-scan absolute inset-x-0 h-8 bg-gradient-to-b from-transparent to-accent/50" />
        </div>
      </div>
    </div>
  );
}
