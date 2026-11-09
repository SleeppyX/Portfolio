"use client";

import { useEffect, useState } from "react";

/** พิกัดคงที่ของ "เซนเซอร์" (กรุงเทพฯ) ไม่ได้ใช้ตำแหน่งของคนดู */
const LAT = 13.75;
const LON = 100.5;
const WEATHER_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m&hourly=temperature_2m&past_hours=24&forecast_hours=0&timezone=Asia%2FBangkok`;
const AIR_URL = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}&current=pm2_5&timezone=Asia%2FBangkok`;
/** ดึงข้อมูลใหม่ทุก 5 นาที */
const REFRESH_MS = 5 * 60 * 1000;

type Reading = {
  temperature: number;
  humidity: number;
  pm25: number | null;
  /** อุณหภูมิย้อนหลัง 24 ชั่วโมง สำหรับกราฟเส้น */
  history: number[];
  fetchedAt: number;
};

type SensorCardProps = {
  labels: {
    online: string;
    offline: string;
    location: string;
    temperature: string;
    humidity: string;
    history: string;
    justNow: string;
    /** มี {minutes} ให้แทนค่า */
    minutesAgo: string;
  };
};

async function fetchReading(): Promise<Reading> {
  const [weather, air] = await Promise.all([
    fetch(WEATHER_URL).then((res) => {
      if (!res.ok) throw new Error(`weather ${res.status}`);
      return res.json();
    }),
    // PM2.5 เป็นค่าเสริม ถ้าดึงไม่ได้ยังแสดงค่าอื่นต่อ
    fetch(AIR_URL)
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null),
  ]);
  return {
    temperature: weather.current.temperature_2m,
    humidity: weather.current.relative_humidity_2m,
    pm25: air?.current?.pm2_5 ?? null,
    history: weather.hourly.temperature_2m.filter((value: number | null) => value !== null),
    fetchedAt: Date.now(),
  };
}

/**
 * การ์ด "เซนเซอร์" สไตล์อุปกรณ์ IoT: ดึงอากาศจริงของกรุงเทพฯ จาก Open-Meteo (ไม่ต้องใช้ API key)
 * ถ้าดึงไม่ได้จะขึ้นสถานะ offline เหมือนอุปกรณ์หลุดการเชื่อมต่อ
 */
export function SensorCard({ labels }: SensorCardProps) {
  const [reading, setReading] = useState<Reading | null>(null);
  const [status, setStatus] = useState<"loading" | "online" | "offline">("loading");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetchReading()
        .then((next) => {
          if (cancelled) return;
          setReading(next);
          setStatus("online");
        })
        .catch(() => {
          if (!cancelled) setStatus("offline");
        });

    load();
    const refresh = window.setInterval(load, REFRESH_MS);
    // อัปเดตข้อความ "x นาทีที่แล้ว" ทุก 30 วินาที
    const tick = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(refresh);
      window.clearInterval(tick);
    };
  }, []);

  const minutes = reading ? Math.max(0, Math.floor((now - reading.fetchedAt) / 60_000)) : 0;
  const updated =
    minutes === 0 ? labels.justNow : labels.minutesAgo.replace("{minutes}", String(minutes));
  const value = (n: number | null | undefined, digits = 0) =>
    status === "online" && n != null ? n.toFixed(digits) : "--";

  return (
    <div className="relative rounded-xl border border-border bg-card p-5 font-mono text-sm">
      {/* มุมกรอบแบบ HUD */}
      <span
        aria-hidden
        className="absolute -top-px -left-px size-3 border-t-2 border-l-2 border-accent"
      />
      <span
        aria-hidden
        className="absolute -top-px -right-px size-3 border-t-2 border-r-2 border-accent"
      />
      <span
        aria-hidden
        className="absolute -bottom-px -left-px size-3 border-b-2 border-l-2 border-accent"
      />
      <span
        aria-hidden
        className="absolute -right-px -bottom-px size-3 border-r-2 border-b-2 border-accent"
      />

      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="flex items-center gap-2">
          <span aria-hidden className="relative flex size-2">
            {status === "online" && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
            )}
            <span
              className={`relative inline-flex size-2 rounded-full ${
                status === "offline" ? "bg-danger" : status === "online" ? "bg-accent" : "bg-muted"
              }`}
            />
          </span>
          <span className="font-semibold">node-bkk-01</span>
          <span className={status === "offline" ? "text-danger" : "text-muted"}>
            {status === "offline" ? labels.offline : status === "online" ? labels.online : "…"}
          </span>
        </span>
        <span className="text-muted">{labels.location}</span>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3">
        <div>
          <dt className="text-xs text-muted">{labels.temperature}</dt>
          <dd className="mt-1 text-2xl font-semibold">
            {value(reading?.temperature, 1)}
            <span className="text-sm text-muted">°C</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">{labels.humidity}</dt>
          <dd className="mt-1 text-2xl font-semibold">
            {value(reading?.humidity)}
            <span className="text-sm text-muted">%</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">PM2.5</dt>
          <dd className="mt-1 text-2xl font-semibold">
            {value(reading?.pm25)}
            <span className="text-sm text-muted"> µg/m³</span>
          </dd>
        </div>
      </dl>

      <Sparkline values={status === "online" ? (reading?.history ?? []) : []} />

      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>{labels.history}</span>
        <span aria-live="polite">{status === "online" ? updated : ""}</span>
      </div>
    </div>
  );
}

/** กราฟเส้นเล็กของอุณหภูมิ 24 ชั่วโมง */
function Sparkline({ values }: { values: number[] }) {
  const width = 300;
  const height = 48;
  if (values.length < 2) {
    return <div className="mt-5 h-12 rounded border border-dashed border-border" />;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - 4 - ((v - min) / range) * (height - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      className="mt-5 h-12 w-full overflow-visible"
    >
      <polyline
        points={`0,${height} ${points} ${width},${height}`}
        className="fill-accent/10 stroke-none"
      />
      <polyline
        points={points}
        fill="none"
        className="stroke-accent"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}
