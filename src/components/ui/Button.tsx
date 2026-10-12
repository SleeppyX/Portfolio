import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  outline: "border border-border hover:border-accent hover:text-accent",
};

type Variant = keyof typeof variants;

/** ปุ่มที่เป็นลิงก์ภายในเว็บ (ใส่ภาษาให้อัตโนมัติ) */
export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

/** ปุ่มที่เป็นลิงก์ธรรมดา เช่น ไฟล์ PDF, เว็บภายนอก, mailto: */
export function ButtonAnchor({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"a"> & { variant?: Variant }) {
  return <a className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
