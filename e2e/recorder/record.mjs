/**
 * อัดวิดีโอตอนเทสต์ทั้ง 3 framework รันจริง สำหรับ popup ใน section "Automated Testing"
 *
 * วิธีใช้ (เปิดเว็บไว้ที่ http://localhost:3000 ก่อน):
 *   cd e2e/recorder && npm install && npm run record            # อัดทุกชุด
 *   npm run record -- selenium                                    # อัดเฉพาะชุดเดียว
 *
 * ผลลัพธ์:
 *   public/videos/<id>.mp4, public/videos/<id>.jpg (ภาพตัวอย่าง)
 *   src/data/test-videos.json (ความยาววิดีโอ + เวลาเริ่มของแต่ละเทสต์ สำหรับไฮไลต์ step)
 *
 * Cypress อัดวิดีโอเองได้ ส่วน Selenium/Robot ใช้วิธีเปิด Chrome ไว้ให้เทสต์ต่อเข้ามา
 * แล้วดึงภาพหน้าจอผ่าน Chrome DevTools Protocol (Page.startScreencast)
 */
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const e2e = path.join(root, "e2e");
const outDir = path.join(root, "public", "videos");
const dataFile = path.join(root, "src", "data", "test-videos.json");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const DEBUG_PORT = 9555;
const python = path.join(
  e2e,
  ".venv",
  process.platform === "win32" ? "Scripts/python.exe" : "bin/python",
);
const chrome =
  process.env.CHROME_PATH ||
  (process.platform === "win32"
    ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
    : "/usr/bin/google-chrome");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "e2e-record-"));

function run(command, args, options) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: "inherit", shell: false, ...options });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

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

/** บีบอัดเป็น mp4 (H.264) ขนาดเล็ก เปิดได้ทุกเบราว์เซอร์ + ทำภาพตัวอย่าง */
function encode(inputArgs, id, posterAt) {
  const video = path.join(outDir, `${id}.mp4`);
  execFileSync(
    ffmpeg,
    [
      "-y",
      ...inputArgs,
      "-vf",
      "scale=1280:-2,format=yuv420p",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "30",
      "-r",
      "24",
      "-movflags",
      "+faststart",
      "-an",
      video,
    ],
    { stdio: "ignore" },
  );
  const duration = videoDuration(video);
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-ss",
      String(Math.min(posterAt, duration - 0.1)),
      "-i",
      video,
      "-frames:v",
      "1",
      "-q:v",
      "4",
      path.join(outDir, `${id}.jpg`),
    ],
    { stdio: "ignore" },
  );
  return duration;
}

/* ---------- Cypress: ใช้วิดีโอที่ Cypress อัดเอง ---------- */
async function recordCypress() {
  const stepsFile = path.join(tmp, "cypress.json");
  const videosFolder = path.join(tmp, "cypress-videos");
  const code = await run("npx", ["cypress", "run"], {
    cwd: path.join(e2e, "cypress"),
    shell: true,
    env: {
      ...process.env,
      CYPRESS_BASE_URL: BASE_URL,
      RECORD_STEPS_FILE: stepsFile,
      RECORD_VIDEOS_DIR: videosFolder,
    },
  });
  const { tests } = JSON.parse(fs.readFileSync(stepsFile, "utf8"));
  // Cypress บันทึกวิดีโอไว้ใน videosFolder (ไม่ได้ส่ง path กลับมาใน after:spec)
  const video = fs
    .readdirSync(videosFolder, { recursive: true })
    .map((name) => path.join(videosFolder, String(name)))
    .find((file) => file.endsWith(".mp4"));
  const duration = encode(["-i", video], "cypress", 6);
  // วิดีโอเริ่มก่อนเทสต์แรกเล็กน้อย จึงนับเวลาย้อนจากท้ายวิดีโอ
  const total = tests.reduce((sum, test) => sum + test.duration, 0) / 1000;
  let start = Math.max(0, duration - total - 1);
  const steps = tests.map((test) => {
    const step = { title: test.title, start: Number(start.toFixed(1)) };
    start += test.duration / 1000;
    return step;
  });
  return { duration, steps, passed: code === 0 };
}

/* ---------- Selenium / Robot: เปิด Chrome ไว้แล้วอัดผ่าน CDP ---------- */
async function recordWithScreencast(id, command, args, cwd) {
  const stepsFile = path.join(tmp, `${id}.jsonl`);
  const browser = spawn(
    chrome,
    [
      "--headless=new",
      `--remote-debugging-port=${DEBUG_PORT}`,
      "--window-size=1280,800",
      `--user-data-dir=${path.join(tmp, `${id}-profile`)}`,
      "--no-first-run",
      "--hide-scrollbars",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let version;
  for (let i = 0; i < 50 && !version; i++) {
    version = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`)
      .then((r) => r.json())
      .catch(() => null);
    if (!version) await sleep(200);
  }
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve));
  let nextId = 0;
  const send = (method, params = {}, sessionId) =>
    ws.send(JSON.stringify({ id: ++nextId, method, params, sessionId }));

  // อัดทุกแท็บที่เทสต์ใช้ (Selenium/Robot ต่อเข้ามาที่แท็บของ Chrome ตัวนี้)
  const frames = [];
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Target.attachedToTarget" && message.params.targetInfo.type === "page") {
      const { sessionId } = message.params;
      send(
        "Page.startScreencast",
        { format: "jpeg", quality: 80, maxWidth: 1280, maxHeight: 800 },
        sessionId,
      );
    }
    if (message.method === "Page.screencastFrame") {
      // ใช้เวลาที่ได้รับเฟรม (timestamp ของ Chrome นับต่างกันในแต่ละแท็บ)
      frames.push({ time: Date.now() / 1000, data: message.params.data });
      send("Page.screencastFrameAck", { sessionId: message.params.sessionId }, message.sessionId);
    }
  });
  send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: false, flatten: true });
  send("Target.setDiscoverTargets", { discover: true });
  // แท็บที่เปิดอยู่แล้ว (about:blank) ก็ต้องอัดด้วย
  const targets = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`).then((r) => r.json());
  for (const target of targets.filter((t) => t.type === "page")) {
    send("Target.attachToTarget", { targetId: target.id, flatten: true });
  }
  await sleep(500);

  const code = await run(command, args, {
    cwd,
    env: {
      ...process.env,
      BASE_URL,
      CHROME_DEBUGGER: `127.0.0.1:${DEBUG_PORT}`,
      RECORD_STEPS_FILE: stepsFile,
    },
  });
  await sleep(800);
  ws.close();
  browser.kill();

  const records = fs
    .readFileSync(stepsFile, "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));

  // เขียนเฟรมเป็นไฟล์ แล้วต่อเป็นวิดีโอตามเวลาจริงของแต่ละเฟรม
  // ตัดช่วงก่อนเทสต์แรก (ตอนเปิด browser เป็นจอดำ)
  const firstStepTime = Math.min(...records.filter((r) => r.title).map((r) => r.time));
  frames.sort((a, b) => a.time - b.time);
  frames.splice(
    0,
    Math.max(
      0,
      frames.findIndex((frame) => frame.time >= firstStepTime - 0.3),
    ),
  );
  const frameDir = path.join(tmp, `${id}-frames`);
  fs.mkdirSync(frameDir);
  const list = ["ffconcat version 1.0"];
  frames.forEach((frame, index) => {
    const file = path.join(frameDir, `${String(index).padStart(5, "0")}.jpg`);
    fs.writeFileSync(file, Buffer.from(frame.data, "base64"));
    const next = frames[index + 1]?.time ?? frame.time + 1;
    list.push(
      `file '${file.replaceAll("\\", "/")}'`,
      `duration ${Math.max(0.04, next - frame.time).toFixed(3)}`,
    );
  });
  const listFile = path.join(tmp, `${id}.ffconcat`);
  fs.writeFileSync(listFile, list.join("\n"));

  const firstFrame = frames[0].time;
  const steps = records
    .filter((record) => record.title)
    .map((step) => ({
      title: step.title,
      start: Number(Math.max(0, step.time - firstFrame).toFixed(1)),
    }));
  // ตัดวิดีโอให้จบหลังเทสต์สุดท้ายเสร็จ 1.5 วินาที (ช่วงปิด browser เป็นภาพนิ่งยาว)
  const lastEnd = Math.max(...records.filter((record) => record.end).map((record) => record.end));
  const keep = ["-t", (lastEnd - firstFrame + 1.5).toFixed(1)];
  const duration = encode(
    ["-f", "concat", "-safe", "0", "-i", listFile, ...keep],
    id,
    steps[1]?.start ?? 3,
  );
  return { duration, steps, passed: code === 0 };
}

const suites = {
  cypress: recordCypress,
  selenium: () =>
    recordWithScreencast("selenium", python, ["-m", "pytest", "-q"], path.join(e2e, "selenium")),
  robot: () =>
    recordWithScreencast(
      "robot",
      python,
      [
        "-m",
        "robot",
        "--listener",
        path.join(here, "robot_listener.py"),
        "--variable",
        `BASE_URL:${BASE_URL}`,
        "--variable",
        `DEBUGGER:127.0.0.1:${DEBUG_PORT}`,
        "--outputdir",
        path.join(tmp, "robot-results"),
        "projects.robot",
      ],
      path.join(e2e, "robot"),
    ),
};

fs.mkdirSync(outDir, { recursive: true });
const data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : {};
const only = process.argv.slice(2);
for (const [id, record] of Object.entries(suites)) {
  if (only.length && !only.includes(id)) continue;
  console.log(`\n=== Recording ${id} ===`);
  const result = await record();
  data[id] = { ...result, duration: Number(result.duration.toFixed(1)) };
  console.log(
    `${id}: ${result.steps.length} tests, ${data[id].duration}s, passed=${result.passed}`,
  );
}
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2) + "\n");
fs.rmSync(tmp, { recursive: true, force: true });
