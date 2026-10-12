import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // ปิดกฎเรื่องการจัดรูปแบบที่ชนกับ Prettier (ให้ Prettier จัดการแทน)
  prettier,
  {
    rules: {
      // อนุญาตตัวแปรที่ขึ้นต้นด้วย _ ไว้สำหรับค่าที่ตั้งใจไม่ใช้
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
