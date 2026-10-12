/** ป้ายเล็กๆ สำหรับชื่อเทคโนโลยี/ทักษะ */
export function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
      {children}
    </span>
  );
}
