import type { Localized } from "@/lib/localize";

export type Interest = {
  title: Localized;
  description: Localized;
  /** คำสั้นๆ ใต้หัวข้อ แสดงเป็นตัว mono */
  keywords: string[];
};

/** ความสนใจที่แสดงใน section "Lab & Interests" บนหน้า Portfolio */
export const interests: Interest[] = [
  {
    title: { en: "IoT", th: "IoT" },
    description: {
      en: "Connecting sensors and microcontrollers to the web, and turning their data into live dashboards.",
      th: "เชื่อมเซนเซอร์และไมโครคอนโทรลเลอร์เข้ากับเว็บ แล้วแสดงข้อมูลเป็น dashboard แบบเรียลไทม์",
    },
    keywords: ["sensors", "MQTT", "dashboards"],
  },
  {
    title: { en: "Computer Vision", th: "Computer Vision" },
    description: {
      en: "Teaching models to find and recognize things in images, such as object detection and banknote classification.",
      th: "สอนโมเดลให้หาและจำแนกสิ่งของในภาพ เช่น การตรวจจับวัตถุ และการจำแนกธนบัตร",
    },
    keywords: ["object detection", "classification", "OpenCV"],
  },
  {
    title: { en: "Explainable AutoML", th: "Explainable AutoML" },
    description: {
      en: "Automated machine learning pipelines that can also explain why a model made each prediction.",
      th: "ระบบ machine learning อัตโนมัติ ที่อธิบายได้ด้วยว่าโมเดลตัดสินใจแต่ละครั้งเพราะอะไร",
    },
    keywords: ["AutoML", "XAI", "pipelines"],
  },
];
