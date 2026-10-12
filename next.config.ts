import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// เชื่อม next-intl เข้ากับ Next.js (อ่าน config จาก src/i18n/request.ts)
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
