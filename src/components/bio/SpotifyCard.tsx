"use client";

import { useState } from "react";

type SpotifyCardProps = {
  /** ลิงก์ Spotify ปกติ เช่น https://open.spotify.com/track/... หรือ /playlist/... */
  url: string;
  label: string;
  playLabel: string;
};

/** แปลงลิงก์ Spotify ปกติเป็นลิงก์ player แบบฝัง (ธีมมืด) และตัด ?si= ออก */
function toEmbedUrl(url: string) {
  const { pathname } = new URL(url);
  return `https://open.spotify.com/embed${pathname}?theme=0`;
}

/**
 * การ์ด Now playing: ตอนแรกเป็นปุ่มธรรมดา ยังไม่โหลดอะไรจาก Spotify
 * กดแล้วค่อยโหลด player ของ Spotify มาแทนที่ (ออกจากหน้านี้ = เพลงหยุดเอง)
 */
export function SpotifyCard({ url, label, playLabel }: SpotifyCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mt-4 w-full rounded-xl border border-border bg-card/70 px-5 py-4 backdrop-blur">
      <p className="text-xs font-medium tracking-wider text-accent uppercase">{label}</p>
      {loaded ? (
        <iframe
          src={toEmbedUrl(url)}
          title="Spotify player"
          height={80}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="mt-3 w-full rounded-xl border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group mt-2 flex w-full items-center gap-3 text-left"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground transition group-hover:scale-105">
            <svg aria-hidden width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="flex-1 font-semibold">{playLabel}</span>
          <span className="text-xs text-muted">♫ Spotify</span>
        </button>
      )}
    </div>
  );
}
