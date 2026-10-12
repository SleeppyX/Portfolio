import type { ReactNode } from "react";

/** จำกัดความกว้างเนื้อหาและเว้นขอบซ้ายขวา ใช้ครอบทุกหน้า */
export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">{children}</div>;
}
