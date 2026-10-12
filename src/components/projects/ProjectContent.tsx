import { MDXRemote } from "next-mdx-remote/rsc";

/** แสดงเนื้อหา MDX ของผลงาน (ตกแต่งด้วย class prose จาก @tailwindcss/typography) */
export function ProjectContent({ source }: { source: string }) {
  return (
    <div className="prose max-w-none prose-slate dark:prose-invert prose-a:text-accent prose-img:rounded-xl">
      <MDXRemote source={source} />
    </div>
  );
}
