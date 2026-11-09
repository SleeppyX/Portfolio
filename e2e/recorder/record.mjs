/**
 * อัดวิดีโอตอนเทสต์ Cypress รันจริงทั้งระบบ สำหรับ popup ใน section "Automated Testing"
 *
 * วิธีใช้ (เปิดเว็บไว้ที่ http://localhost:3000 ก่อน):
 *   cd e2e/recorder && npm install && npm run record
 *
 * ผลลัพธ์:
 *   public/videos/cypress.mp4, public/videos/cypress.jpg (ภาพตัวอย่าง)
 *   src/data/test-videos.json (ความยาววิดีโอ + เวลาเริ่มของแต่ละเทสต์ สำหรับไฮไลต์ step)
 *
 * Cypress อัดวิดีโอแยกตาม spec (bio, portfolio, projects) ตัวอัดจะเอามาต่อเป็นวิดีโอเดียว
 */
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const outDir = path.join(root, "public", "videos");
const dataFile = path.join(root, "src", "data", "test-videos.json");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "e2e-record-"));

/** ความยาววิดีโอ (วินาที) อ่านจากข้อความของ ffmpeg */
function videoDuration(file) {
  let text = "";
  try {
    execFileSync(ffmpeg, ["-i", file], { stdio: ["ignore", "ignore", "pipe"] });
  } catch (error) {
    text = String(error.stderr);
  }
  const [, h, m, s] = text.match(/Duration: (\d+):(\d+):([\d.]+)/) ?? [];
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

// 1) รัน Cypress ทุก spec พร้อมอัดวิดีโอ (slowmo.js หน่วงคำสั่งให้ดูทัน)
const stepsFile = path.join(tmp, "cypress.jsonl");
const code = await new Promise((resolve) => {
  const child = spawn("npx", ["cypress", "run"], {
    cwd: path.join(root, "e2e", "cypress"),
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      CYPRESS_BASE_URL: BASE_URL,
      RECORD_STEPS_FILE: stepsFile,
      RECORD_VIDEOS_DIR: path.join(tmp, "videos"),
    },
  });
  child.on("exit", (exitCode) => resolve(exitCode ?? 1));
});

// 2) คำนวณเวลาเริ่มของแต่ละเทสต์ในวิดีโอที่ต่อกันแล้ว
// วิดีโอของแต่ละ spec เริ่มก่อนเทสต์แรกเล็กน้อย จึงนับเวลาย้อนจากท้ายวิดีโอ
const specs = fs
  .readFileSync(stepsFile, "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line))
  .sort((a, b) => a.spec.localeCompare(b.spec));
const steps = [];
let offset = 0;
for (const spec of specs) {
  const length = videoDuration(spec.video);
  const total = spec.tests.reduce((sum, test) => sum + test.duration, 0) / 1000;
  let start = offset + Math.max(0, length - total - 1);
  for (const test of spec.tests) {
    steps.push({ group: test.group, title: test.title, start: Number(start.toFixed(1)) });
    start += test.duration / 1000;
  }
  offset += length;
}

// 3) ต่อวิดีโอทุก spec แล้วบีบอัดเป็น mp4 (H.264) ขนาดเล็ก เปิดได้ทุกเบราว์เซอร์
const listFile = path.join(tmp, "videos.txt");
fs.writeFileSync(
  listFile,
  specs.map((spec) => `file '${spec.video.replaceAll("\\", "/")}'`).join("\n"),
);
fs.mkdirSync(outDir, { recursive: true });
const video = path.join(outDir, "cypress.mp4");
execFileSync(
  ffmpeg,
  [
    "-y",
    ...["-f", "concat", "-safe", "0", "-i", listFile],
    ...["-vf", "scale=1280:-2,format=yuv420p", "-c:v", "libx264", "-preset", "slow"],
    ...["-crf", "30", "-r", "24", "-movflags", "+faststart", "-an", video],
  ],
  { stdio: "ignore" },
);
const duration = videoDuration(video);

// 4) ภาพตัวอย่าง (ช่วงที่เห็นหน้าเว็บ + command log)
const poster = path.join(outDir, "cypress.jpg");
const posterAt = String(steps[1]?.start ?? 3);
execFileSync(ffmpeg, ["-y", "-ss", posterAt, "-i", video, "-frames:v", "1", "-q:v", "4", poster], {
  stdio: "ignore",
});

const data = { duration: Number(duration.toFixed(1)), passed: code === 0, steps };
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2) + "\n");
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`cypress: ${steps.length} tests, ${data.duration}s, passed=${data.passed}`);
