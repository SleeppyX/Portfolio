"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

type CopyButtonProps = {
  text: string;
  /** ข้อความที่โผล่หลังคัดลอกสำเร็จ */
  copiedLabel: string;
  title: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** ปุ่มคัดลอกข้อความ (ใช้กับ Discord ที่ไม่มีลิงก์โปรไฟล์) */
export function CopyButton({
  text,
  copiedLabel,
  title,
  className,
  style,
  children,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    // ลองวิธี textarea ก่อน: ทำงานทันทีในจังหวะที่กด และใช้ได้ในเบราว์เซอร์ในแอป
    // ส่วน Clipboard API ในบางเบราว์เซอร์จะค้างรอสิทธิ์โดยไม่ตอบกลับ
    if (copyWithTextarea(text) || (await copyWithClipboardApi(text))) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
    // ถ้าคัดลอกไม่ได้ทั้งสองวิธี ก็ยังเห็น username บนปุ่มอยู่แล้ว
  };

  return (
    <button type="button" onClick={copy} title={title} className={className} style={style}>
      {children}
      <span aria-live="polite" className="shrink-0 text-xs text-accent">
        {copied ? copiedLabel : null}
      </span>
    </button>
  );
}

/** วิธีสำรอง: Clipboard API (บางเบราว์เซอร์ในแอป เช่น IG/LINE ไม่อนุญาต) */
async function copyWithClipboardApi(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** วิธีหลัก: เลือกข้อความใน textarea ที่ซ่อนไว้แล้วสั่ง copy */
function copyWithTextarea(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}
