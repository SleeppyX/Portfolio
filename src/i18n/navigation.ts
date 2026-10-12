import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// ใช้ Link / useRouter จากไฟล์นี้แทนของ next โดยตรง
// เพื่อให้ลิงก์ใส่ /en หรือ /th ให้อัตโนมัติ
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
