import { notFound } from "next/navigation";

// URL ที่ไม่มีหน้ารองรับ (เช่น /en/abc) → แสดงหน้า not-found.tsx ของภาษานั้น
export default function CatchAllPage() {
  notFound();
}
